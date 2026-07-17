// auth.js
(function() {
    const user = localStorage.getItem("currentUser");
    const path = window.location.pathname;

    // إذا لم يوجد مستخدم ولسنا في صفحة login.html
    if (!user && !path.includes("login.html")) {
        alert("يرجى تسجيل الدخول أولاً");
        window.location.href = "login.html";
    }
})();
