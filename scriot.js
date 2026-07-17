import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
  authDomain: "roya-platform-26860.firebaseapp.com",
  databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
  projectId: "roya-platform-26860",
  storageBucket: "roya-platform-26860.firebasestorage.app",
  messagingSenderId: "897544406776",
  appId: "1:897544406776:web:aa112013dea672fb141d0d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// دالة إظهار الصفحات
window.showPage = (id) => {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
};

// الربط البرمجي للأزرار
window.addEventListener('DOMContentLoaded', () => {
    // فتح وإغلاق السايدبار
    document.getElementById('openBtn')?.addEventListener('click', () => document.getElementById("mySidebar").style.width = "280px");
    document.getElementById('closeBtn')?.addEventListener('click', () => document.getElementById("mySidebar").style.width = "0");

    // التنقل بين الصفحات
    document.getElementById('btn-home')?.addEventListener('click', () => window.showPage('home'));
    document.getElementById('btn-announcements')?.addEventListener('click', () => window.showPage('announcements'));
    document.getElementById('btn-games')?.addEventListener('click', () => window.showPage('games'));

    // التوقيت
    setInterval(() => {
        const now = new Date();
        document.getElementById('date-display').innerText = now.toLocaleDateString('ar-IQ');
        document.getElementById('time-display').innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);

    // جلب الإعلانات
    onValue(ref(db, 'announcements'), (snap) => {
        const list = document.getElementById('announcements-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(c => {
            const data = c.val();
            list.innerHTML += `<div class="card"><h3>${data.title}</h3><p>${data.text}</p></div>`;
        });
    });
});
