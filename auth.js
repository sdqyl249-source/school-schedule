// auth.js
(function() {
    const user = localStorage.getItem("currentUser");
    
    // إذا لم نجد مستخدم
    if (!user) {
        // نتحقق إذا كنا أصلاً في صفحة الدخول لنمنع الحلقة المفرغة
        if (!window.location.href.includes("login.html")) {
            alert("يرجى تسجيل الدخول أولاً");
            window.location.href = "login.html";
        }
    } 
    // إذا وجدنا مستخدم وكنا في صفحة الدخول، نحوله للرئيسية
    else if (window.location.href.includes("login.html")) {
        window.location.href = "index.html";
    }
})();
