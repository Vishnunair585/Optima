import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type LegalDocType = 'privacy-policy' | 'terms-of-service';
export type LegalDocStatus = 'draft' | 'published' | 'archived';

export interface LegalDocumentVersion {
  id?: string;
  versionId: string;
  type: LegalDocType;
  status: LegalDocStatus;
  content: string;
  createdAt: any;
  publishedAt?: any;
  createdBy: string;
}

export interface LegalDocumentMeta {
  id: LegalDocType;
  currentPublishedVersion: string | null;
}

// Get the latest published version of a legal document
export const getPublishedLegalDoc = async (type: LegalDocType): Promise<LegalDocumentVersion | null> => {
  try {
    const docRef = doc(db, 'legalDocuments', type);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const meta = docSnap.data() as LegalDocumentMeta;
    if (!meta.currentPublishedVersion) return null;

    const versionRef = doc(db, 'legalDocuments', type, 'versions', meta.currentPublishedVersion);
    const versionSnap = await getDoc(versionRef);
    
    if (versionSnap.exists()) {
      return { id: versionSnap.id, ...versionSnap.data() } as LegalDocumentVersion;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching published ${type}:`, error);
    return null;
  }
};

// Admin: Get all versions of a document
export const getLegalDocVersions = async (type: LegalDocType): Promise<LegalDocumentVersion[]> => {
  try {
    const versionsRef = collection(db, 'legalDocuments', type, 'versions');
    const q = query(versionsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LegalDocumentVersion));
  } catch (error) {
    console.error(`Error fetching versions for ${type}:`, error);
    return [];
  }
};

// Admin: Save a new draft
export const saveLegalDocDraft = async (type: LegalDocType, versionId: string, content: string, createdBy: string) => {
  try {
    const versionRef = doc(db, 'legalDocuments', type, 'versions', versionId);
    
    const newVersion: Omit<LegalDocumentVersion, 'id'> = {
      versionId,
      type,
      status: 'draft',
      content,
      createdAt: serverTimestamp(),
      createdBy
    };

    await setDoc(versionRef, newVersion);
    return true;
  } catch (error) {
    console.error(`Error saving draft for ${type}:`, error);
    throw error;
  }
};

// Admin: Publish a version
export const publishLegalDocVersion = async (type: LegalDocType, versionId: string) => {
  try {
    const metaRef = doc(db, 'legalDocuments', type);
    const metaSnap = await getDoc(metaRef);
    
    // If there's an existing published version, archive it
    if (metaSnap.exists()) {
      const currentPublished = metaSnap.data().currentPublishedVersion;
      if (currentPublished && currentPublished !== versionId) {
        const oldVersionRef = doc(db, 'legalDocuments', type, 'versions', currentPublished);
        await updateDoc(oldVersionRef, { status: 'archived' });
      }
    }

    // Set the new version to published
    const newVersionRef = doc(db, 'legalDocuments', type, 'versions', versionId);
    await updateDoc(newVersionRef, { 
      status: 'published',
      publishedAt: serverTimestamp() 
    });

    // Update the metadata document pointer
    await setDoc(metaRef, { currentPublishedVersion: versionId }, { merge: true });
    
    return true;
  } catch (error) {
    console.error(`Error publishing ${type} version ${versionId}:`, error);
    throw error;
  }
};
