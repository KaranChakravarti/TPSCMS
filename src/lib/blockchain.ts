'use client';

import { collection, query, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * Represents a block in the immutable supply chain history.
 * Aligned with the SupplyChainBlock entity in backend.json.
 */
export interface Block {
  id: string;
  productId: string;
  index: number;
  timestamp: string;
  actor: 'Manufacturer' | 'Distributor' | 'Retailer';
  action: string;
  details: Record<string, any>;
  previousHash: string;
  currentHash: string;
}

/**
 * Generates a SHA-256 hash for the given string data.
 */
export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Creates a new block in the product's supply chain history.
 * If the actor is a Manufacturer, it also registers the Product master record.
 */
export async function createBlock(
  productId: string,
  actor: 'Manufacturer' | 'Distributor' | 'Retailer',
  action: string,
  details: Record<string, any>
): Promise<Block> {
  const { firestore } = initializeFirebase();

  // 1. If Manufacturer, register the master Product record first
  if (actor === 'Manufacturer') {
    const productRef = doc(firestore, 'products', productId);
    const productData = {
      id: productId,
      productName: details.productName,
      batchNumber: details.batchNumber,
      manufacturingDate: details.manufacturingDate,
      registeredAt: new Date().toISOString(),
    };
    setDocumentNonBlocking(productRef, productData, { merge: true });
  }

  // 2. Fetch the latest block to determine index and previous hash
  const blocksRef = collection(firestore, 'products', productId, 'supplyChainBlocks');
  const q = query(blocksRef, orderBy('index', 'desc'), limit(1));
  
  let previousBlock: Block | null = null;
  try {
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      previousBlock = querySnapshot.docs[0].data() as Block;
    }
  } catch (err) {
    const contextualError = new FirestorePermissionError({
      operation: 'list',
      path: blocksRef.path,
    });
    errorEmitter.emit('permission-error', contextualError);
    throw contextualError;
  }

  const index = previousBlock ? previousBlock.index + 1 : 0;
  const timestamp = new Date().toISOString();
  const previousHash = previousBlock ? previousBlock.currentHash : '0';
  
  // 3. Cryptographic hash chaining logic
  const blockDataToHash = JSON.stringify({
    index,
    timestamp,
    productId,
    actor,
    action,
    details,
    previousHash
  });
  
  const currentHash = await generateHash(blockDataToHash);
  
  // 4. Create and store the new block
  const newBlockRef = doc(blocksRef);
  const newBlock: Block = {
    id: newBlockRef.id,
    productId,
    index,
    timestamp,
    actor,
    action,
    details,
    previousHash,
    currentHash
  };

  // Optimistic UI approach: we don't await the write
  setDocumentNonBlocking(newBlockRef, newBlock, { merge: false });
  
  return newBlock;
}

/**
 * Retrieves the complete supply chain history for a specific product.
 */
export async function getProductHistory(productId: string): Promise<Block[]> {
  const { firestore } = initializeFirebase();
  const blocksRef = collection(firestore, 'products', productId, 'supplyChainBlocks');
  const q = query(blocksRef, orderBy('index', 'asc'));
  
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as Block);
  } catch (err) {
    const contextualError = new FirestorePermissionError({
      operation: 'list',
      path: blocksRef.path,
    });
    errorEmitter.emit('permission-error', contextualError);
    return [];
  }
}

/**
 * Checks if a master product record exists in the system.
 */
export async function checkProductExists(productId: string): Promise<boolean> {
  const { firestore } = initializeFirebase();
  const productRef = doc(firestore, 'products', productId);
  try {
    const snap = await getDoc(productRef);
    return snap.exists();
  } catch (err) {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      operation: 'get',
      path: productRef.path
    }));
    return false;
  }
}
