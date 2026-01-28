// Sử dụng CDN chính thức của Firebase để chạy trực tiếp trên trình duyệt
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/**
 * CẤU HÌNH FIREBASE - DỰ ÁN GIVISO WATER
 * Bạn hãy lấy các thông số này trong Firebase Console -> Project Settings
 */
const firebaseConfig = {
  apiKey: "AIzaSyDQmerSSs0qhO01xNnFWpquZYseDThWxP0",
  authDomain: "lichtruc-e3f82.firebaseapp.com",
  projectId: "lichtruc-e3f82",
  storageBucket: "lichtruc-e3f82.firebasestorage.app",
  messagingSenderId: "476557236437",
  appId: "1:476557236437:web:dfb1cb5848642daecdaa5c",
  measurementId: "G-QYQCZCLWR4"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Khởi tạo Firestore và Export để các Module khác (Customer, Order) có thể import
export const db = getFirestore(app);

// Xuất các hàm Firestore cần thiết để các file con không phải khai báo lại CDN
export * from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
