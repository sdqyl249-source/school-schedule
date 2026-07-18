// scriot.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860"
};

const app = initializeApp(firebaseConfig);
window.db = getDatabase(app);

window.addEventListener('DOMContentLoaded', () => {
    
    // 1. التحقق من الدخول (الحماية)
    // نتحقق من وجود currentUser الذي قمت بإنشائه في صفحة الدخول
    const userJson = localStorage.getItem("currentUser");

    // إذا لم يكن المستخدم مسجلاً، أعد توجيهه لصفحة الدخول
    // افترضنا أن اسم صفحة الدخول هو login.html
    if (!userJson && window.location.pathname !== "/login.html") {
        window.location.href = "login.html"; 
        return;
    }

    // 2. إظهار قسم إدارة الصفوف إذا كان المستخدم مسجلاً
    if (userJson) {
        const loginSection = document.getElementById("loginSection");
        const classesSection = document.getElementById("classesSection");
        
        if (loginSection) loginSection.style.display = "none";
        if (classesSection) classesSection.style.display = "block";
    }

    // 3. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);
});
