// استيراد Firebase (باستخدام إصدار المتوافق مع الـ module إذا لزم الأمر)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860"
};
const app = initializeApp(firebaseConfig);

window.addEventListener('DOMContentLoaded', () => {
    
    // 1. وظيفة التنقل بين الصفحات
    const showPage = (id) => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const target = document.getElementById(id);
        if (target) target.style.display = 'block';
        document.getElementById("mySidebar").style.width = "0"; // إغلاق القائمة
    };

    // 2. ربط أزرار القائمة الجانبية (هذا ما يجعلها تعمل!)
    document.getElementById('btn-home')?.addEventListener('click', () => showPage('home'));
    document.getElementById('btn-announcements')?.addEventListener('click', () => showPage('announcements'));
    document.getElementById('btn-classes')?.addEventListener('click', () => showPage('classes'));
    document.getElementById('btn-library')?.addEventListener('click', () => showPage('library'));
    document.getElementById('btn-games')?.addEventListener('click', () => showPage('games'));
    
    // ربط الجدول بملف خارجي
    document.getElementById('btn-schedule')?.addEventListener('click', () => {
        window.location.href = 'schedule.html';
    });

    // 3. التحكم بالسايدبار
    document.getElementById('openBtn')?.addEventListener('click', () => document.getElementById("mySidebar").style.width = "280px");
    document.getElementById('closeBtn')?.addEventListener('click', () => document.getElementById("mySidebar").style.width = "0");

    // 4. تسجيل الدخول
    document.getElementById('authBtn')?.addEventListener('click', () => {
        const pass = prompt("يرجى إدخال كلمة مرور المدير:");
        if (pass === "1234") {
            localStorage.setItem("admin", "true");
            alert("تم تسجيل الدخول بنجاح!");
            location.reload();
        } else { alert("كلمة مرور خاطئة!"); }
    });

    // 5. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);

    // إظهار قسم الإدارة
    if (localStorage.getItem("admin")) {
        document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'block');
    }
});
// أضف هذا الجزء في نهاية ملف scriot.js
window.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            const pass = prompt("يرجى إدخال كلمة مرور المدير:");
            if (pass === "1234") {
                localStorage.setItem("admin", "true");
                alert("تم تسجيل الدخول بنجاح!");
                location.reload(); // لتفعيل أقسام الإدارة
            } else {
                alert("كلمة مرور خاطئة!");
            }
        });
    }
});
