import { initializeApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAOkJMVU54wpsJvFJ5WEWzAY1yfLggd4zw',
  authDomain: 'sca-app-18e94.firebaseapp.com',
  projectId: 'sca-app-18e94',
  storageBucket: 'sca-app-18e94.firebasestorage.app',
  messagingSenderId: '1068104368602',
  appId: '1:1068104368602:web:a1c672a4674a81a6f080e3',
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const db = getFirestore(app)
