import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// 1. إعدادات Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    let userString = localStorage.getItem("currentUser");
    if (userString) {
        const userProfile = JSON.parse(userString);
        loadUserDataFromCloud(userProfile.phone);
        showUserWelcome(userProfile);
        
        if (userProfile.role === 'student') {
            renderStudentClasses();
        } else if (userProfile.role === 'teacher') {
            renderTeacherClasses();
        }
    } else {
        alert("يرجى تسجيل الدخول أولاً!");
    }
});

function loadUserDataFromCloud(phone) {
    const userRef = ref(db, 'users/' + phone);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            localStorage.setItem("currentUser", JSON.stringify(data));
        }
    });
}

function showUserWelcome(user) {
    const infoBox = document.createElement('div');
    infoBox.style.cssText = "background: #e8f5e9; padding: 20px; border-right: 5px solid #2e7d32; margin-bottom: 20px; border-radius: 8px;";
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3><p>الدور الحالي: ${user.role}</p>`;
    document.body.prepend(infoBox);
}

// دالة الانضمام لصف (للطالب)
window.joinClass = function() {
    const code = prompt("أدخل رمز الصف:");
    if (!code) return;

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    const classRef = ref(db, 'classes/' + code);
    
    onValue(classRef, (snapshot) => {
        const classData = snapshot.val();
        if (!classData) { alert("رمز الصف غير موجود."); return; }

        if (!userProfile.joinedClasses) userProfile.joinedClasses = [];
        if (userProfile.joinedClasses.includes(code)) { alert("منضم مسبقاً!"); return; }

        userProfile.joinedClasses.push(code);
        update(ref(db, 'users/' + userProfile.phone), { joinedClasses: userProfile.joinedClasses })
        .then(() => {
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
            renderStudentClasses(); // تحديث الواجهة مباشرة
        });
    }, { onlyOnce: true });
};

// عرض صفوف الطالب
function renderStudentClasses() {
    const container = document.getElementById("classesContainer"); 
    if (!container) return;
    
    container.innerHTML = `<div style="margin-bottom: 20px;"><button onclick="window.joinClass()">+ انضمام لصف جديد</button></div>`;

    onValue(ref(db, 'classes/'), (snapshot) => {
        const data = snapshot.val();
        const userProfile = JSON.parse(localStorage.getItem("currentUser"));
        const joinedCodes = userProfile.joinedClasses || [];
        
        if (data) {
            Object.values(data).forEach(cls => {
                if (joinedCodes.includes(cls.id)) {
                    const card = document.createElement("div");
                    card.className = "class-card";
                    card.innerHTML = `<h3>${cls.name}</h3><p>الأستاذ: ${cls.teacher}</p><button onclick="window.viewClassLessons('${cls.id}')">عرض الدروس</button>`;
                    container.appendChild(card);
                }
            });
        }
    });
}

// عرض صفوف الأستاذ (تم تعديلها لتعمل كـ Listener مباشر)
function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    onValue(ref(db, 'classes/'), (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
        if (data) {
            Object.values(data).forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-card";
                card.style.border = "1px solid #ccc";
                card.style.padding = "10px";
                card.style.margin = "10px";
                
                card.innerHTML = `
                    <h3>${cls.name} - شعبة ${cls.section}</h3>
                    <p>الرمز: ${cls.id}</p>
                    <button onclick="window.viewClassLessons('${cls.id}')">عرض التفاصيل</button>
                    <button onclick="window.deleteClass('${cls.id}')" style="background-color: #ff4444; color: white;">حذف الصف</button>
                `;
                container.appendChild(card);
            });
        }
    });
}

// دالة حفظ الصف (بدون إعادة تحميل الصفحة)
window.saveClass = function() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (!className || !classSection) {
        alert("يرجى اختيار اسم الصف والشعبة!");
        return;
    }

    const classId = "CLASS-" + Math.floor(100000 + Math.random() * 900000); 

    set(ref(db, 'classes/' + classId), {
        id: classId,
        name: className,
        section: classSection,
        teacher: "أ. عقيل السعد",
        lessons: [{ title: "مقدمة" }],
        grades: {}
    }).then(() => {
        alert("تم الحفظ بنجاح!");
        // لا حاجة لـ location.reload() لأن renderTeacherClasses يعمل كـ Listener
    });
};

window.viewClassLessons = function(classId) {
    onValue(ref(db, 'classes/' + classId), (snapshot) => {
        const c = snapshot.val();
        if(!c) return;
        // تأكد من استخدام "classesContainer" هنا أيضاً
        const container = document.getElementById("classesContainer"); 
        container.innerHTML = `<button onclick="location.reload()">العودة</button><h2>دروس: ${c.name}</h2><div id="lessons-list"></div>`;
        c.lessons.forEach((l, i) => {
            const d = document.createElement("div");
            d.innerHTML = `<h4>الدرس ${i + 1}: ${l.title}</h4>`;
            container.appendChild(d);
        });
    }, { onlyOnce: true });
};
window.deleteClass = function(classId) {
    if (confirm("هل أنت متأكد من حذف هذا الصف نهائياً؟")) {
        remove(ref(db, 'classes/' + classId))
        .then(() => {
            alert("تم حذف الصف بنجاح!");
            // لا حاجة لـ reload، الـ onValue سيحدث الشاشة تلقائياً
        })
        .catch((error) => {
            alert("حدث خطأ أثناء الحذف: " + error.message);
        });
    }
};
