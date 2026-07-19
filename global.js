// global.js - احذف كل شيء قبله، ابدأ بهذا:
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
window.database.ref('users/' + phone).set(userProfile).then(() => {
        alert("أهلاً بك يا " + fullName + "، تم إنشاء حسابك بنجاح.");
        window.location.href = "index.html";
    });
};
