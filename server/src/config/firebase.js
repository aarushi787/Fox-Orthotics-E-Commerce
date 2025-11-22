const admin = require('firebase-admin');

function initFirebase() {
  if (admin.apps && admin.apps.length) return admin;

  const svcJsonEnv = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const svcJsonB64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

  let credential = null;
  if (svcJsonEnv) {
    try {
      const parsed = JSON.parse(svcJsonEnv);
      credential = admin.credential.cert(parsed);
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  } else if (svcJsonB64) {
    try {
      const decoded = Buffer.from(svcJsonB64, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      credential = admin.credential.cert(parsed);
      console.log('Firebase admin initialized from FIREBASE_SERVICE_ACCOUNT_JSON_B64');
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON_B64:', err.message);
    }
  } else if (svcPath) {
    credential = admin.credential.cert(require(svcPath));
  }

  if (credential) {
    admin.initializeApp({ credential });
    console.log('Firebase admin initialized');
  } else {
    console.warn('Firebase admin NOT initialized - no credentials provided');
  }

  return admin;
}

module.exports = initFirebase();
