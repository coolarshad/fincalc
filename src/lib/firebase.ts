import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getPageContent(pageId: string) {
  if (firebaseConfig.projectId === "YOUR_PROJECT_ID") return null;

  try {
    // Firestore requires an even number of segments (Collection/Document).
    // If pageId is 'calculators/loan-calculator', it replaces it with 'calculators-loan-calculator'
    const sanitizedId = pageId.replace(/\//g, '-');
    const docRef = doc(db, "pages", sanitizedId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (err) {
    console.error(`Failed to fetch Firebase content for page ${pageId}:`, err);
    return null;
  }
}
