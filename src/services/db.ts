import { collection, addDoc, getDocs, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { SavedQuote, WindowSegment } from '../types';

const QUOTES_COLLECTION = 'quotes';

export const saveQuote = async (clientName: string, segments: WindowSegment[], totalCost: number): Promise<string> => {
  const quoteData: Omit<SavedQuote, 'id'> = {
    clientName,
    date: new Date().toISOString(),
    segments,
    totalCost
  };
  
  const docRef = await addDoc(collection(db, QUOTES_COLLECTION), quoteData);
  return docRef.id;
};

export const getQuotes = async (): Promise<SavedQuote[]> => {
  const q = query(collection(db, QUOTES_COLLECTION), orderBy('date', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as SavedQuote[];
};

export const deleteQuote = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, QUOTES_COLLECTION, id));
};
