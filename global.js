// global.js

document.addEventListener('DOMContentLoaded', function() {
    const isLoginPage = window.location.pathname.endsWith("login.html");
    if (isLoginPage) return; 

    const userString = localStorage.getItem("currentUser");
    if (!userString) {
        window.location.href = "login.html";
    } else {
        const userProfile = JSON.parse(userString);
        applyPermissions(userProfile.role);
    }
});

function applyPermissions(role) {
    if (role === "student") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = 'none');
    }
}

// قمنا بتحويل الكود الخاص بالـ ref إلى دالة ليتم استدعاؤها لاحقاً
window.createNewUser = function(phone, fullName, userProfile) {
    if (!window.database) {
        console.error("قاعدة البيانات غير متوفرة حالياً");
        return;
    }
    window.database.ref('users/' + phone).set(userProfile).then(() => {
        alert("أهلاً بك يا " + fullName + "، تم إنشاء حسابك بنجاح.");
        window.location.href = "index.html";
    }).catch(error => {
        console.error("خطأ في إنشاء المستخدم:", error);
    });
};
