import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Cấu hình Firebase của dự án Giviso Water
const firebaseConfig = {
  apiKey: "AIzaSyDQmerSSs0qhO01xNnFWpquZYseDThWxP0",
  authDomain: "lichtruc-e3f82.firebaseapp.com",
  projectId: "lichtruc-e3f82",
  storageBucket: "lichtruc-e3f82.firebasestorage.app",
  messagingSenderId: "476557236437",
  appId: "1:476557236437:web:dfb1cb5848642daecdaa5c",
  measurementId: "G-QYQCZCLWR4"
};

// Khởi tạo ứng dụng Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore (Database) để các Module khác sử dụng
export const db = getFirestore(app);
