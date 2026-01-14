// Firebase configuration for authentication and image storage
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration
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

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Google Auth Provider for social login
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase Storage for images
export const storage = getStorage(app);

export default app;
