
import { collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';

export interface Block {
  index: number;
  timestamp: string;
  productId: string;
  actor: 'Manufacturer' | 'Distributor' | 'Retailer';
  action: string;
  details: Record<string, any>;
  previousHash: string;
  currentHash: string;
}

export async function generateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function createBlock(
  productId: string,
  actor: 'Manufacturer' | 'Distributor' | 'Retailer',
  action: string,
  details: Record<string, any>
): Promise<Block> {
  const { firestore } = initializeFirebase();
  const blocksRef = collection(firestore, 'blocks');
  const q = query(
    blocksRef,
    where('productId', '==', productId),
    orderBy('index', 'desc'),
    limit(1)
  );
  
  const querySnapshot = await getDocs(q);
  let previousBlock: Block | null = null;
  
  if (!querySnapshot.empty) {
    previousBlock = querySnapshot.docs[0].data() as Block;
  }

  const index = previousBlock ? previousBlock.index + 1 : 0;
  const timestamp = new Date().toISOString();
  const previousHash = previousBlock ? previousBlock.currentHash : '0';
  
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
  
  const newBlock: Block = {
    index,
    timestamp,
    productId,
    actor,
    action,
    details,
    previousHash,
    currentHash
  };

  await addDoc(blocksRef, newBlock);
  return newBlock;
}

export async function getProductHistory(productId: string): Promise<Block[]> {
  const { firestore } = initializeFirebase();
  const blocksRef = collection(firestore, 'blocks');
  const q = query(
    blocksRef,
    where('productId', '==', productId),
    orderBy('index', 'asc')
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Block);
}
