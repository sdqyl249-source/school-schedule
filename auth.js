// auth.js
function checkAuth() {
    const user = localStorage.getItem("currentUser");
    const currentPage = window.location.pathname;

    // إذا كان المستخدم غير مسجل، ولسنا في صفحة الدخول، أعد توجيهه
    if (!user && !currentPage.includes("login.html")) {
        alert("يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة.");
        window.location.href = "login.html";
    } 
    // إذا كان المستخدم مسجلاً، وفتح صفحة الدخول بالخطأ، وجهه للرئيسية
    else if (user && currentPage.includes("login.html")) {
        window.location.href = "index.html";
    }
}

// تنفيذ التحقق
checkAuth();
