// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZV1CORKCwgQ7tpCQnpz9fEYimOweQYSk",
  authDomain: "company-registration-f8836.firebaseapp.com",
  projectId: "company-registration-f8836",
  storageBucket: "company-registration-f8836.firebasestorage.app",
  messagingSenderId: "343219013447",
  appId: "1:343219013447:web:a9d031d95a0dcd167aee62",
  measurementId: "G-XLHLLGNHF8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);

// Only initialize analytics in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
