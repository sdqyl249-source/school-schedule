// classes.js - الكود الموحد والمعدل ليعمل مع Firebase V9
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

// 2. تهيئة التطبيق وقاعدة البيانات (استخدام getApps لتجنب تكرار التهيئة)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// دالة مزامنة البيانات من السحابة
function loadUserDataFromCloud(phone) {
    const userRef = ref(db, 'users/' + phone);
    onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            localStorage.setItem("currentUser", JSON.stringify(data));
            console.log("تمت مزامنة البيانات من السحابة بنجاح!");
        }
    });
}

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

// دالة عرض صفوف الأستاذ
function renderTeacherClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;
    
    container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
    const classesRef = ref(db, 'classes/');
    
    onValue(classesRef, (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = "<h2>صفوفي كأستاذ:</h2>"; // إعادة التعيين
        if (data) {
            Object.values(data).forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-card";
                card.innerHTML = `
                    <h3>${cls.name} - شعبة ${cls.section}</h3>
                    <p>الرمز: <strong>${cls.id}</strong></p>
                    <button onclick="viewClassLessons('${cls.id}')">عرض تفاصيل الصف</button>
                `;
                container.appendChild(card);
            });
        }
    });
}

// الدوال الأساسية
function showUserWelcome(user) {
    const infoBox = document.createElement('div');
    infoBox.style.cssText = "background: #e8f5e9; padding: 20px; border-right: 5px solid #2e7d32; margin-bottom: 20px; border-radius: 8px;";
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3><p>الدور الحالي: ${user.role}</p>`;
    document.body.prepend(infoBox);
}

function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;
    if (!className || !classSection) { alert("يرجى ملء جميع الحقول!"); return; }

    const classId = "CLASS-" + Math.floor(1000 + Math.random() * 9000);
    const newClassData = {
        id: classId,
        name: className,
        section: classSection,
        teacher: "أ. عقيل السعد",
        lessons: [{ title: "مقدمة" }],
        grades: {}
    };

    set(ref(db, 'classes/' + classId), newClassData)
    .then(() => {
        alert("تم الحفظ في سحابة الوادي بنجاح!");
        renderClassCard(className, classSection, classId);
        document.getElementById("className").value = "";
        document.getElementById("classSection").value = "";
    })
    .catch((error) => { alert("حدث خطأ أثناء الحفظ: " + error.message); });
}

function renderClassCard(name, section, id) {
    const container = document.getElementById("classesContainer");
    if (!container) return;
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `<h3>الصف ${name} - شعبة ${section}</h3><p>رمز الصف: <strong>${id}</strong></p><div id="qr-${id}" style="margin-top:15px; display:flex; justify-content:center;"></div>`;
    container.appendChild(card);
    if (typeof QRCode !== "undefined") { new QRCode(document.getElementById(`qr-${id}`), id); }
}

function renderStudentClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;
    const classesRef = ref(db, 'classes/');
    onValue(classesRef, (snapshot) => {
        const data = snapshot.val();
        container.innerHTML = "";
        if (data) {
            const userProfile = JSON.parse(localStorage.getItem("currentUser"));
            const joinedCodes = userProfile.joinedClasses || [];
            Object.values(data).forEach(cls => {
                if (joinedCodes.includes(cls.id)) {
                    const card = document.createElement("div");
                    card.className = "class-card";
                    card.innerHTML = `<h3>${cls.name}</h3><p>الأستاذ: ${cls.teacher}</p><button onclick="viewClassLessons('${cls.id}')">عرض الدروس</button>`;
                    container.appendChild(card);
                }
            });
        }
    });
}

window.viewClassLessons = function(classId) {
    const classesRef = ref(db, 'classes/' + classId);
    onValue(classesRef, (snapshot) => {
        const selectedClass = snapshot.val();
        if (!selectedClass) return;
        const container = document.getElementById("classes-container");
        container.innerHTML = `<button onclick="location.reload()">العودة للرئيسية</button><h2>دروس صف: ${selectedClass.name}</h2><button onclick="showStudentGrade('${selectedClass.id}')">عرض درجتي</button><div id="lessons-list"></div>`;
        const lessonsList = document.getElementById("lessons-list");
        selectedClass.lessons.forEach((lesson, index) => {
            const lessonDiv = document.createElement("div");
            lessonDiv.className = "lesson-card";
            lessonDiv.innerHTML = `<h4>الدرس ${index + 1}: ${lesson.title}</h4>`;
            lessonsList.appendChild(lessonDiv);
        });
    });
};

window.showStudentGrade = function(classId) {
    const classesRef = ref(db, 'classes/' + classId);
    onValue(classesRef, (snapshot) => {
        const selectedClass = snapshot.val();
        if (!selectedClass) return;
        const studentName = prompt("أدخل اسمك الثلاثي لعرض درجتك:");
        if (!studentName) return;
        const grade = selectedClass.grades[studentName];
        if (grade !== undefined) { alert("مرحباً " + studentName + "، درجتك هي: " + grade); } else { alert("عذراً، لم يتم العثور على درجة بهذا الاسم."); }
    });
};
