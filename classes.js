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
function renderStudentClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;
    
    container.innerHTML = `<button onclick="window.joinClass()">+ انضمام لصف جديد</button>`;

    const classesRef = ref(db, 'classes/');
    onValue(classesRef, (snapshot) => {
        const data = snapshot.val();
        const userProfile = JSON.parse(localStorage.getItem("currentUser"));
        const joinedCodes = userProfile.joinedClasses || [];
        
        if (data) {
            Object.values(data).forEach(cls => {
                if (joinedCodes.includes(cls.id)) {
                    // تحقق هل البطاقة موجودة مسبقاً لتجنب التكرار
                    if (!document.getElementById(`card-${cls.id}`)) {
                        const card = document.createElement("div");
                        card.id = `card-${cls.id}`; // إعطاء معرف فريد
                        card.className = "class-card";
                        card.innerHTML = `<h3>${cls.name}</h3><p>الأستاذ: ${cls.teacher}</p><button onclick="viewClassLessons('${cls.id}')">عرض الدروس</button>`;
                        container.appendChild(card);
                    }
                }
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

window.saveClass = function() {
    // 1. جلب القيم من عناصر القائمة (select)
    const classNameSelect = document.getElementById("className");
    const classSectionSelect = document.getElementById("classSection");
    
    const className = classNameSelect.value;
    const classSection = classSectionSelect.value;

    // 2. التحقق من وجود البيانات
    if (!className || !classSection) {
        alert("يرجى اختيار اسم الصف والشعبة!");
        return;
    }

    // 3. توليد كود قوي (6 أرقام) لضمان عدم التكرار أو ظهور 0000
    const classId = "CLASS-" + Math.floor(100000 + Math.random() * 900000); 

    const newClassData = {
        id: classId,
        name: className,
        section: classSection,
        teacher: "أ. عقيل السعد",
        lessons: [{ title: "مقدمة" }],
        grades: {}
    };

    // 4. الحفظ في قاعدة البيانات
    set(ref(db, 'classes/' + classId), newClassData)
    .then(() => {
        alert("تم الحفظ في سحابة الوادي بنجاح! كود الصف هو: " + classId);
        
        // إعادة تحميل الصفحة لتحديث الواجهة وجلب الصف الجديد تلقائياً
        location.reload(); 
    })
    .catch((error) => {
        console.error("خطأ Firebase:", error);
        alert("حدث خطأ أثناء الحفظ: " + error.message);
    });
};

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
    
    // 1. إضافة زر الانضمام في البداية
    container.innerHTML = `
        <div style="margin-bottom: 20px;">
            <button onclick="window.joinClass()" style="background:#3498db; color:white; padding:10px 20px; border:none; border-radius:5px; cursor:pointer;">+ انضمام لصف جديد</button>
        </div>
    `;

    // 2. جلب البيانات وعرض الصفوف
    const classesRef = ref(db, 'classes/');
    onValue(classesRef, (snapshot) => {
        const data = snapshot.val();
        
        // ملاحظة: لا نمسح الزر هنا، بل نضيف الصفوف بعده
        // لذا نستخدم createElement لإضافة البطاقات دون مسح محتوى الزر
        if (data) {
            const userProfile = JSON.parse(localStorage.getItem("currentUser"));
            const joinedCodes = userProfile.joinedClasses || [];
            
            Object.values(data).forEach(cls => {
                if (joinedCodes.includes(cls.id)) {
                    const card = document.createElement("div");
                    card.className = "class-card";
                    card.innerHTML = `
                        <h3>${cls.name}</h3>
                        <p>الأستاذ: ${cls.teacher}</p>
                        <button onclick="viewClassLessons('${cls.id}')">عرض الدروس</button>
                    `;
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
window.joinClass = function() {
    const code = prompt("أدخل رمز الصف الذي زودك به الأستاذ:");
    if (!code) return;

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    if (!userProfile) { alert("يجب تسجيل الدخول أولاً!"); return; }

    // 1. التحقق من وجود الصف في قاعدة البيانات قبل إضافته
    const classRef = ref(db, 'classes/' + code);
    onValue(classRef, (snapshot) => {
        const classData = snapshot.val();
        
        if (!classData) {
            alert("عذراً، رمز الصف غير موجود.");
            return;
        }

        // 2. تحديث قائمة الصفوف للطالب
        if (!userProfile.joinedClasses) userProfile.joinedClasses = [];
        
        if (userProfile.joinedClasses.includes(code)) {
            alert("أنت منضم لهذا الصف مسبقاً!");
            return;
        }

        userProfile.joinedClasses.push(code);

        // 3. حفظ التحديث في Firebase وفي الجهاز
        const userRef = ref(db, 'users/' + userProfile.phone);
        update(userRef, { joinedClasses: userProfile.joinedClasses })
        .then(() => {
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
            alert("تم الانضمام للصف بنجاح!");
            renderStudentClasses(); // إعادة عرض الصفوف
        })
        .catch(err => alert("حدث خطأ: " + err.message));
    }, { onlyOnce: true }); // نستخدم onlyOnce حتى لا يتكرر التنبيه
};
