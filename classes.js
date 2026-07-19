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
    const classId = prompt("أدخل رمز الصف (4 أرقام فقط):");
    
    // 1. التحقق من أن المدخل ليس فارغاً
    if (!classId) return;

    // 2. التحقق من أن الرمز يتكون من 4 أرقام فقط باستخدام Regex
    const isFourDigits = /^\d{4}$/.test(classId);
    if (!isFourDigits) {
        alert("خطأ: يجب أن يتكون رمز الصف من 4 أرقام فقط!");
        return;
    }

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    if (!userProfile) { alert("يجب تسجيل الدخول أولاً!"); return; }

    const classRef = ref(db, 'classes/' + classId);
    
    get(classRef).then((snapshot) => {
        if (!snapshot.exists()) {
            alert("رمز الصف غير موجود.");
            return;
        }

        if (!userProfile.joinedClasses) userProfile.joinedClasses = [];
        
        if (userProfile.joinedClasses.includes(classId)) {
            alert("أنت منضم لهذا الصف مسبقاً!");
            return;
        }

        userProfile.joinedClasses.push(classId);
        
        update(ref(db, 'users/' + userProfile.phone), { 
            joinedClasses: userProfile.joinedClasses 
        }).then(() => {
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
            renderStudentClasses();
            alert("تم الانضمام للصف بنجاح!");
        }).catch((error) => {
            alert("حدث خطأ أثناء الانضمام: " + error.message);
        });
    });
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
                card.className = "class-card"; // هنا نستخدم الكلاس الجديد
                
                card.innerHTML = `
                    <h3>${cls.name}</h3>
                    <p>شعبة: ${cls.section}</p>
                    <small>الرمز: ${cls.id}</small>
                    <br>
                    <button onclick="window.viewClassLessons('${cls.id}')">عرض</button>
                    <button onclick="window.deleteClass('${cls.id}')" style="background:#8b0000;">حذف</button>
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

        const container = document.getElementById("classesContainer"); 
        
        // تغيير هيكل العرض ليتناسب مع الواجهة
        container.innerHTML = `
            <div style="width: 100%; text-align: right; margin-bottom: 20px;">
                <button onclick="location.reload()" style="padding: 10px 20px; cursor: pointer;">العودة للقائمة</button>
            </div>
            <h2>دروس: ${c.name}</h2>
            <div id="lessons-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; width: 100%;"></div>
        `;

        const lessonsList = document.getElementById("lessons-list");
        
        if (c.lessons && Array.isArray(c.lessons)) {
            c.lessons.forEach((l, i) => {
                const d = document.createElement("div");
                d.className = "class-card"; // استخدام نفس كلاس البطاقة
                d.innerHTML = `
                    <h3>الدرس ${i + 1}: ${l.title}</h3>
                    <p>المحتوى: ${l.description || 'لا يوجد وصف'}</p>
                `;
                lessonsList.appendChild(d);
            });
        } else {
            lessonsList.innerHTML = "<p>لا توجد دروس مضافة لهذا الصف.</p>";
        }
    }, { onlyOnce: true });
};
