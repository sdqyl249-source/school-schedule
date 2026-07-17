// ملف global.js
window.onload = function() {
    // 1. التحقق من الصفحة الحالية لتجنب التكرار في صفحة تسجيل الدخول
    // نتحقق إذا كان الرابط ينتهي بـ login.html
    if (window.location.pathname.endsWith("login.html")) {
        return; 
    }

    // 2. التحقق من حالة تسجيل الدخول
    const role = localStorage.getItem("userRole");
    
    if (!role) {
        // إذا لم يجد بيانات تسجيل، يعيد المستخدم لصفحة تسجيل الدخول
        alert("يرجى تسجيل الدخول أولاً");
        window.location.href = "login.html";
    } else {
        // إذا كان مسجلاً، نطبق الصلاحيات بناءً على دوره
        console.log("المستخدم الحالي مسجل كـ: " + role);
        applyPermissions(role);
    }
};

// دالة تطبيق الصلاحيات (إخفاء أدوات الأستاذ عن الطلاب)
function applyPermissions(role) {
    if (role === "student") {
        // العثور على جميع العناصر التي تحمل كلاس admin-only وإخفاؤها
        const adminElements = document.querySelectorAll(".admin-only");
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        console.log("تم تطبيق صلاحيات الطالب: تم إخفاء عناصر التحكم.");
    }
}
