// scriot.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860"
};

const app = initializeApp(firebaseConfig);
window.db = getDatabase(app);

window.addEventListener('DOMContentLoaded', () => {

    // دالة تسجيل الدخول الموحدة
    window.handleLogin = function() {
        const name = document.getElementById("studentName").value;
        const phone = document.getElementById("studentPhone").value;
        const role = document.getElementById("userRole").value;

        if (name && phone) {
            localStorage.setItem("studentName", name);
            localStorage.setItem("studentPhone", phone);
            localStorage.setItem("userRole", role);
            localStorage.setItem("isLoggedIn", "true");
            location.reload(); // إعادة تحميل الصفحة لإظهار لوحة الصفوف
        } else {
            alert("يرجى ملء جميع الحقول!");
        }
    };

    // التحقق من حالة الدخول وإظهار القسم المناسب
    if (localStorage.getItem("isLoggedIn") === "true") {
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("classesSection").style.display = "block";
    } else {
        document.getElementById("loginSection").style.display = "block";
        document.getElementById("classesSection").style.display = "none";
    }

    // الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);
});
