// scriot.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860"
};
initializeApp(firebaseConfig);

window.addEventListener('DOMContentLoaded', () => {

    // 1. وظيفة التنقل بين الصفحات
    const showPage = (id) => {
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        const target = document.getElementById(id);
        if (target) target.style.display = 'block';
        document.getElementById("mySidebar").style.width = "0";
    };

    // دالة حماية الصفحات (بوابة الأستاذ والطالب)
   const setupProtectedButton = (btnId, targetUrl) => {
    document.getElementById(btnId)?.addEventListener('click', () => {
        // إذا كان مدير، يذهب للملف مباشرة
        if (localStorage.getItem("admin") === "true") {
            window.location.href = targetUrl;
            return;
        }

        // بوابة الاختيار
        const role = prompt("أهلاً بك في منصة الوادي، اختر صفة الدخول:\n1. أستاذ\n2. طالب");

        if (role === "1") {
            const pass = prompt("أدخل رمز الأستاذ:");
            if (pass === "1234") {
                localStorage.setItem("admin", "true");
                window.location.href = targetUrl; // الانتقال للملف
            } else {
                alert("رمز الأستاذ خاطئ!");
            }
        } else if (role === "2") {
            const pass = prompt("أدخل رمز الصف:");
            if (pass === "0000") {
                const name = prompt("يرجى إدخال اسمك الثلاثي:");
                const phone = prompt("يرجى إدخال رقم هاتفك:");
                localStorage.setItem("studentName", name);
                localStorage.setItem("studentPhone", phone);
                localStorage.setItem("isStudent", "true");
                window.location.href = targetUrl; // الانتقال للملف
            } else {
                alert("رمز الصف خاطئ!");
            }
        }
    });
};

// الاستخدام (سيرسل الطالب أو الأستاذ إلى الملف مباشرة):
setupProtectedButton('btn-classes', 'classes.html');
setupProtectedButton('btn-library', 'library.html');
    // 2. ربط الأزرار برمجياً
    document.getElementById('btn-home')?.addEventListener('click', () => showPage('home'));
    document.getElementById('btn-announcements')?.addEventListener('click', () => showPage('announcements'));
    document.getElementById('btn-games')?.addEventListener('click', () => showPage('games'));
    document.getElementById('btn-schedule')?.addEventListener('click', () => { window.location.href = 'schedule.html'; });

    setupProtectedButton('btn-classes', 'classes');
    setupProtectedButton('btn-library', 'library');

    // 3. التحكم بالسايدبار
    document.getElementById('openBtn')?.addEventListener('click', () => { document.getElementById("mySidebar").style.width = "280px"; });
    document.getElementById('closeBtn')?.addEventListener('click', () => { document.getElementById("mySidebar").style.width = "0"; });

    // 4. تسجيل الدخول العام (للإدارة)
    const authBtn = document.getElementById('authBtn');
    if (authBtn) {
        authBtn.addEventListener('click', () => {
            if (localStorage.getItem("admin") === "true") {
                if (confirm("أنت مسجل كمدير، هل تريد تسجيل الخروج؟")) {
                    localStorage.clear(); // مسح كل البيانات عند الخروج
                    location.reload();
                }
            } else {
                const pass = prompt("يرجى إدخال كلمة مرور المدير:");
                if (pass === "1234") {
                    localStorage.setItem("admin", "true");
                    location.reload();
                } else {
                    alert("كلمة مرور خاطئة!");
                }
            }
        });
    }

    // 5. الوقت والتاريخ
    setInterval(() => {
        const now = new Date();
        const d = document.getElementById('date-display');
        const t = document.getElementById('time-display');
        if(d) d.innerText = now.toLocaleDateString('ar-IQ');
        if(t) t.innerText = now.toLocaleTimeString('ar-IQ');
    }, 1000);

    // إظهار قسم الإدارة
    if (localStorage.getItem("admin") === "true") {
        document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'block');
    }
    
    // إظهار ترحيب للطالب إذا كان مسجلاً
    if (localStorage.getItem("isStudent") === "true") {
        console.log("مرحباً الطالب: " + localStorage.getItem("studentName"));
    }
// --- كود عرض بيانات الطالب تلقائياً في صفحة الصفوف ---
    if (localStorage.getItem("isStudent") === "true") {
        const classesPage = document.getElementById('classes'); // تأكد أن id الصفحة هو 'classes'
        if (classesPage) {
            const infoCard = document.createElement('div');
            infoCard.style.cssText = "background: #e8f5e9; padding: 15px; margin: 10px; border-right: 5px solid #2e7d32; border-radius: 8px; font-weight: bold;";
            infoCard.innerHTML = `
                <p>👤 اسم الطالب: ${localStorage.getItem("studentName")}</p>
                <p>📞 رقم الهاتف: ${localStorage.getItem("studentPhone")}</p>
                <p>📚 رمز الصف: 0000</p>
            `;
            // إضافة البطاقة في بداية صفحة الصفوف
            classesPage.prepend(infoCard);
        }
    }
});
