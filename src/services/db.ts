import { collection, addDoc, getDocs, doc, deleteDoc, orderBy, query } from 'firebase/firestore';
import { db, auth } from './firebase';
import type { SavedQuote, WindowSegment } from '../types';

const QUOTES_COLLECTION = 'presupuestos';

export const saveQuote = async (clientName: string, segments: WindowSegment[], totalCost: number): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuario no autenticado');

  const quoteData = {
    clientName,
    date: new Date().toISOString(),
    segments,
    totalCost,
    userId: user.uid,
    userEmail: user.email
  };
  
  const docRef = await addDoc(collection(db, QUOTES_COLLECTION), quoteData);
  return docRef.id;
};

export const getQuotes = async (): Promise<SavedQuote[]> => {
  try {
    // Try with orderBy first
    const q = query(
      collection(db, QUOTES_COLLECTION),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SavedQuote[];
  } catch (e) {
    console.warn('Query with orderBy failed, trying without:', e);
    // Fallback: fetch without orderBy (in case index is missing)
    const snapshot = await getDocs(collection(db, QUOTES_COLLECTION));
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SavedQuote[];
  }
};

export const deleteQuote = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, QUOTES_COLLECTION, id));
};
