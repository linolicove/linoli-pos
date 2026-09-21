// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBwwDhK55dCjlyQvogx4h2MVzM63FTYD9E",
  authDomain: "linoli-cove-midigama.firebaseapp.com",
  databaseURL: "https://linoli-cove-midigama-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "linoli-cove-midigama",
  storageBucket: "linoli-cove-midigama.firebasestorage.app",
  messagingSenderId: "1042569283249",
  appId: "1:1042569283249:web:920a611730b2726399c490",
  measurementId: "G-8DNWR5Q7MJ"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);

// Broadcast local state updates up to Firebase Realtime Database
export const syncToCloud = (nodeName, data) => {
  if (data === undefined || data === null) return;
  try {
    const nodeRef = ref(rtdb, `linoli_pos_live/${nodeName}`);
    set(nodeRef, {
      payload: JSON.stringify(data),
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn(`Sync error on ${nodeName}:`, err);
  }
};

// Listen in real time for updates made from any other device
export const subscribeToCloud = (nodeName, callback) => {
  const nodeRef = ref(rtdb, `linoli_pos_live/${nodeName}`);
  return onValue(nodeRef, (snapshot) => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (val && val.payload) {
        try {
          callback(JSON.parse(val.payload));
        } catch (e) {
          console.error(`Parse error on ${nodeName}:`, e);
        }
      }
    }
  });
};