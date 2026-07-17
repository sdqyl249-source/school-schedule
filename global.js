// نضع هذا الكود في ملف JS عام يسمى global.js يتم ربطه بجميع الصفحات
window.onload = function() {
    const role = localStorage.getItem("userRole");
    
    if (!role) {
        // إذا لم يجد بيانات، يعيد المستخدم لصفحة تسجيل الدخول
        alert("يرجى تسجيل الدخول أولاً");
        window.location.href = "login.html";
    } else {
        console.log("المستخدم الحالي مسجل كـ: " + role);
        applyPermissions(role);
    }
};

function applyPermissions(role) {
    if (role === "student") {
        // إخفاء الأزرار التي لا تخص الطالب (مثل أزرار الحذف أو إغلاق الدردشة)
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = 'none');
    }
}
