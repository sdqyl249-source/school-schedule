// global.js - النسخة الموحدة

window.onload = function() {
    // 1. التحقق من الصفحة الحالية لتجنب الحلقة المفرغة في صفحة التسجيل
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) {
        return; 
    }

    // 2. التحقق من وجود المستخدم في التخزين الموحد
    const userString = localStorage.getItem("currentUser");
    
    if (!userString) {
        // إذا لم يجد بيانات، يعيد المستخدم لصفحة تسجيل الدخول
        alert("يرجى تسجيل الدخول أولاً للوصول إلى المنصة.");
        window.location.href = "login.html";
    } else {
        // إذا كان مسجلاً، نقوم باستخراج البيانات وتطبيق الصلاحيات
        const userProfile = JSON.parse(userString);
        console.log("أهلاً بك يا " + userProfile.name + "، دورك هو: " + userProfile.role);
        
        applyPermissions(userProfile.role);
    }
};

// دالة تطبيق الصلاحيات (إخفاء أدوات الأستاذ عن الطلاب)
function applyPermissions(role) {
    if (role === "student") {
        const adminElements = document.querySelectorAll(".admin-only");
        adminElements.forEach(el => {
            el.style.display = 'none';
        });
        console.log("تم تطبيق صلاحيات الطالب: تم إخفاء عناصر التحكم.");
    }
}

// دالة تسجيل المستخدم (تُستدعى من صفحة login.html)
function registerUser(fullName, phone, role) {
    const userProfile = {
        name: fullName,
        phone: phone,
        role: role, 
        joinedClasses: [] 
    };
    
    localStorage.setItem("currentUser", JSON.stringify(userProfile));
    alert("أهلاً بك يا " + fullName + "، تم إنشاء حسابك بنجاح.");
}
