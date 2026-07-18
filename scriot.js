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
    const userJson = localStorage.getItem("currentUser");
    const user = userJson ? JSON.parse(userJson) : null;

    // إذا لم يكن المستخدم مسجلاً، أعد توجيهه لصفحة الدخول
    if (!user && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
        return;
    }

    // 2. إظهار/إخفاء عناصر الإدارة (إضافة/تعديل/حذف)
    // تظهر فقط إذا كان المستخدم هو "الأستاذ" (Teacher)
    if (user && user.role === 'teacher') {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'block');
    } else {
        document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    }

    // 3. قسم إظهار المحتوى المخصص (في حال كنت تستخدم الـ Section المخفي في index)
    if (user) {
        const loginSection = document.getElementById("loginSection");
        const classesSection = document.getElementById("classesSection");
        
        if (loginSection) loginSection.style.display = "none";
        if (classesSection) classesSection.style.display = "block";
    }

    // 4. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);
});
// وظيفة إغلاق القائمة
function closeSidebar() {
    document.getElementById("mySidebar").style.width = "0";
}

// تفعيل لون التمييز بناءً على اسم الصفحة
window.addEventListener('DOMContentLoaded', () => {
    let path = window.location.pathname;
    if (path.includes("index.html")) document.getElementById("nav-index").classList.add("active-nav");
    if (path.includes("classes.html")) document.getElementById("nav-classes").classList.add("active-nav");
    // أضف باقي الصفحات بنفس الطريقة
});
