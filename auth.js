// auth.js
function checkAuth() {
    // 1. ننتظر قليلاً للتأكد من تحميل LocalStorage
    const user = localStorage.getItem("currentUser");
    
    // 2. الحصول على اسم الصفحة الحالية
    const path = window.location.pathname;
    const isLoginPage = path.includes("login.html");

    // 3. المنطق: إذا لم يوجد مستخدم ولسنا في صفحة الدخول، نمنع الدخول
    if (!user && !isLoginPage) {
        console.log("لم يتم العثور على مستخدم، جاري التحويل...");
        window.location.href = "login.html";
    } 
    // إذا كان المستخدم موجوداً، فلا نفعل شيئاً
}

// تشغيل التحقق عند تحميل الصفحة
window.addEventListener('load', checkAuth);
