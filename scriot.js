// scriot.js - النسخة النهائية المصححة

// 1. وظيفة تبديل القائمة (فتح/إغلاق)
window.toggleSidebar = function() {
    const sidebar = document.getElementById("mySidebar");
    if (!sidebar) return;
    
    // التحقق من الحالة الحالية للتبديل
    if (sidebar.style.width === "280px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "280px";
    }
};

window.addEventListener('DOMContentLoaded', () => {
    
    // 2. التحقق من الدخول (الحماية)
    const userJson = localStorage.getItem("currentUser");
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user && !window.location.pathname.includes("login.html")) {
        window.location.href = "login.html";
        return;
    }

    // 3. إظهار/إخفاء عناصر الإدارة (الأستاذ فقط)
    // نستخدم display = '' لإعادة العناصر لنمطها الأصلي في CSS
    const adminElements = document.querySelectorAll('.admin-only');
    if (user && user.role === 'teacher') {
        adminElements.forEach(el => el.style.display = '');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
    }

    // 4. تفعيل لون التمييز للرابط النشط (يدعم كافة الصفحات)
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

    // 5. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);
});
