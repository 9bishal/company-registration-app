const admin = require('firebase-admin');

try {
  // Try to initialize using service account if credentials are provided in env
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized with service account');
  } else {
    // Fallback or initialization without certificate (might have limited access)
    // In many environments, it will look for GOOGLE_APPLICATION_CREDENTIALS
    admin.initializeApp();
    console.log('✅ Firebase Admin initialized with default credentials');
  }
} catch (error) {
  console.warn('⚠️ Firebase Admin initialization failed:', error.message);
}

module.exports = admin;
