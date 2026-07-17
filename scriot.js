import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
  authDomain: "roya-platform-26860.firebaseapp.com",
  databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
  projectId: "roya-platform-26860"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 1. وظيفة التنقل بين الصفحات
window.showPage = (id) => {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    const target = document.getElementById(id);
    if (target) target.style.display = 'block';
};

// 2. وظيفة تسجيل الدخول
window.handleAuth = () => {
    const pass = prompt("يرجى إدخال كلمة مرور المدير:");
    if (pass === "1234") {
        localStorage.setItem("admin", "true");
        location.reload();
    } else { alert("كلمة مرور خاطئة!"); }
};

// 3. وظيفة تحديث الرؤية
window.updateInfo = (key, text) => {
    if(!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    update(ref(db, 'info/' + key), { text });
};

// 4. الربط البرمجي عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    // تحديث الوقت
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);

    // الربط مع الأزرار
    document.getElementById('btn-home')?.addEventListener('click', () => window.showPage('home'));
    document.getElementById('btn-announcements')?.addEventListener('click', () => window.showPage('announcements'));
    document.getElementById('btn-classes')?.addEventListener('click', () => window.showPage('classes'));
    document.getElementById('btn-library')?.addEventListener('click', () => window.showPage('library'));
    document.getElementById('btn-games')?.addEventListener('click', () => window.showPage('games'));
    
    // إظهار قسم الإدارة إذا كان المدير مسجلاً
    if (localStorage.getItem("admin")) {
        document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'block');
    }
});
