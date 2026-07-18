import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// دالة الانضمام (مُعدلة لتكون أكثر استقراراً)
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
            location.reload(); 
        });
    }, { onlyOnce: true });
};

// عرض صفوف الطالب (نسخة واحدة ومصححة)
function renderStudentClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;
    
    container.innerHTML = `<div style="margin-bottom: 20px;"><button onclick="window.joinClass()">+ انضمام لصف جديد</button></div>`;

    const classesRef = ref(db, 'classes/');
    onValue(classesRef, (snapshot) => {
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

// عرض صفوف الأستاذ
function renderTeacherClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;
    container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
    onValue(ref(db, 'classes/'), (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-card";
                card.innerHTML = `<h3>${cls.name} - ${cls.section}</h3><p>الرمز: ${cls.id}</p><button onclick="window.viewClassLessons('${cls.id}')">عرض التفاصيل</button>`;
                container.appendChild(card);
            });
        }
    });
}

window.saveClass = function() {
    console.log("تم الضغط على الزر بنجاح!"); // أضف هذا السطر فوراً
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;
    if (!className || !classSection) { alert("يرجى ملء الحقول!"); return; }

    const classId = "CLASS-" + Math.floor(100000 + Math.random() * 900000); 
    set(ref(db, 'classes/' + classId), {
        id: classId,
        name: className,
        section: classSection,
        teacher: "أ. عقيل السعد",
        lessons: [{ title: "مقدمة" }],
        grades: {}
    }).then(() => { location.reload(); });
};

window.viewClassLessons = function(classId) {
    onValue(ref(db, 'classes/' + classId), (snapshot) => {
        const c = snapshot.val();
        const container = document.getElementById("classes-container");
        container.innerHTML = `<button onclick="location.reload()">العودة</button><h2>دروس: ${c.name}</h2><div id="lessons-list"></div>`;
        c.lessons.forEach((l, i) => {
            const d = document.createElement("div");
            d.innerHTML = `<h4>الدرس ${i + 1}: ${l.title}</h4>`;
            container.appendChild(d);
        });
    }, { onlyOnce: true });
};
