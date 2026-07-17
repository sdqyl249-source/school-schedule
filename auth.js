// auth.js
function checkAuth() {
    // 1. محاولة جلب المستخدم من التخزين
    const user = localStorage.getItem("currentUser");
    
    // 2. التحقق من مسار الصفحة الحالية
    const isLoginPage = window.location.href.includes("login.html");

    // 3. المنطق: إذا لم يوجد مستخدم ولسنا في صفحة الدخول، نحول المستخدم للدخول
    if (!user && !isLoginPage) {
        window.location.href = "login.html";
    } 
    // إذا وجدنا مستخدم، نتأكد أنه لا يحاول الدخول لصفحة الدخول مرة أخرى
    else if (user && isLoginPage) {
        window.location.href = "index.html";
    }
}

// تشغيل التحقق فوراً
checkAuth();
