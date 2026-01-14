// Firebase storage utilities for image uploads
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase";

/**
 * Upload an image to Firebase Storage
 * @param {File} file - The image file to upload
 * @param {string} path - The storage path (e.g., 'logos', 'banners')
 * @param {string} fileName - Custom file name (optional)
 * @returns {Promise<string>} - The download URL of the uploaded image
 */
export const uploadImage = async (file, path, fileName = null) => {
  try {
    // Generate unique file name if not provided
    const uniqueFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${uniqueFileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Upload company logo
 * @param {File} file - The logo image file
 * @param {string} companyId - The company ID for organizing storage
 * @returns {Promise<string>} - The download URL
 */
export const uploadCompanyLogo = async (file, companyId) => {
  return uploadImage(file, `companies/${companyId}/logos`);
};

/**
 * Upload company banner
 * @param {File} file - The banner image file
 * @param {string} companyId - The company ID for organizing storage
 * @returns {Promise<string>} - The download URL
 */
export const uploadCompanyBanner = async (file, companyId) => {
  return uploadImage(file, `companies/${companyId}/banners`);
};

/**
 * Delete an image from Firebase Storage
 * @param {string} imageUrl - The full URL of the image to delete
 */
export const deleteImage = async (imageUrl) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};

export default {
  uploadImage,
  uploadCompanyLogo,
  uploadCompanyBanner,
  deleteImage
};
