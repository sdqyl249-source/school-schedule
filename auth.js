// auth.js
// هذه الدالة تتحقق من وجود حساب مسجل في التخزين
function checkAuth() {
    const user = localStorage.getItem("currentUser");
    
    // إذا لم نجد بيانات مستخدم، نُعيد توجيهه لصفحة التسجيل
    if (!user) {
        alert("يرجى تسجيل الدخول أولاً للوصول إلى هذه الصفحة.");
        window.location.href = "login.html";
    } else {
        // إذا وجدنا المستخدم، يمكننا استخدامه في أي مكان
        const userData = JSON.parse(user);
        console.log("أهلاً بك يا " + userData.name);
    }
}

// تنفيذ التحقق تلقائياً عند تحميل أي صفحة
checkAuth();
