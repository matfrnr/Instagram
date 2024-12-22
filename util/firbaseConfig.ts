// eslint-disable-next-line import/no-extraneous-dependencies
import { initializeApp } from '@firebase/app';

const firebaseConfig = {
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: ''
};

const app = initializeApp(firebaseConfig);

export default app;
