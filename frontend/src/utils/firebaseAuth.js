// Firebase authentication utilities
import { 
  signInWithPopup, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

/**
 * Sign in with Google
 * @returns {Promise<Object>} - The user credentials
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Return user info to send to backend
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      idToken: await user.getIdToken()
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

/**
 * Sign out from Firebase
 */
export const firebaseSignOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign out error:", error);
    throw error;
  }
};

/**
 * Subscribe to auth state changes
 * @param {Function} callback - Callback function that receives user or null
 * @returns {Function} - Unsubscribe function
 */
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

export default {
  signInWithGoogle,
  firebaseSignOut,
  onAuthChange
};
