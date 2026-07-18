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

// دالة لفتح وإغلاق القائمة بنفس الزر
function toggleSidebar() {
    const sidebar = document.getElementById("mySidebar");
    // إذا كان العرض 280px (مفتوحة) أغلقها، وإلا افتحها
    if (sidebar.style.width === "280px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "280px";
    }
}
// جعل الدالة متاحة للزر في ملفات الـ HTML
window.toggleSidebar = toggleSidebar;

window.addEventListener('DOMContentLoaded', () => {
    
    // 1. التحقق من الدخول (الحماية)
    const userJson = localStorage.getItem("currentUser");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
        return;
    }

    // 2. إظهار/إخفاء عناصر الإدارة (الأستاذ فقط)
    if (user && user.role === 'teacher') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }

    // 3. تفعيل لون التمييز للرابط النشط
    let path = window.location.pathname;
    const navMapping = [
        { file: "index.html", id: "nav-index" },
        { file: "classes.html", id: "nav-classes" },
        { file: "schedule.html", id: "nav-schedule" },
        { file: "library.html", id: "nav-library" },
        { file: "games.html", id: "nav-games" }
    ];

    navMapping.forEach(item => {
        if (path.includes(item.file)) {
            const element = document.getElementById(item.id);
            if (element) element.classList.add("active-nav");
        }
    });

    // 4. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);
});
