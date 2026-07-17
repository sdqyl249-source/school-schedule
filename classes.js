// classes.js - النسخة النهائية والموحدة

document.addEventListener('DOMContentLoaded', () => {
    // 1. جلب بيانات المستخدم الموحدة
    const userString = localStorage.getItem("currentUser");
    if (!userString) return;
    
    const userProfile = JSON.parse(userString);

    // 2. عرض ترحيب بالمستخدم
    showUserWelcome(userProfile);

    // 3. عرض الصفوف بناءً على نوع المستخدم (طالب أم أستاذ)
    if (userProfile.role === 'student') {
        renderStudentClasses();
    } else {
        // إذا كان أستاذ، نربط زر إضافة الصف
        const saveBtn = document.getElementById("saveClassBtn");
        if (saveBtn) saveBtn.addEventListener('click', saveClass);
    }
});

// وظيفة عرض الترحيب
function showUserWelcome(user) {
    const infoBox = document.createElement('div');
    infoBox.style.cssText = "background: #e8f5e9; padding: 20px; border-right: 5px solid #2e7d32; margin-bottom: 20px; border-radius: 8px;";
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3><p>الدور الحالي: ${user.role}</p>`;
    document.body.prepend(infoBox);
}

// وظيفة عرض صفوف الطالب (فلترة حسب الرموز)
function renderStudentClasses() {
    const container = document.getElementById("classes-container");
    if (!container) return;

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    const joinedCodes = userProfile.joinedClasses || [];

    container.innerHTML = ""; 

    allClasses.forEach(cls => {
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

// بدلاً من firebase.database().ref(...) استخدم التالي:window.db.ref('classes/' + classId).set(newClassData)
    .then(() => {
        alert("تم الحفظ في سحابة الوادي بنجاح!");
    }); هذا التعديل طبقه على هذه الدالة function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (!className || !classSection) {
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    const classId = "CLASS-" + Math.floor(1000 + Math.random() * 9000);
    renderClassCard(className, classSection, classId);
} 

// وظيفة عرض بطاقة الصف (للأستاذ)
function renderClassCard(name, section, id) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `
        <h3>الصف ${name} - شعبة ${section}</h3>
        <p>رمز الصف: <strong>${id}</strong></p>
        <div id="qr-${id}" style="margin-top:15px; display:flex; justify-content:center;"></div>
    `;
    container.appendChild(card);
    
    if (typeof QRCode !== "undefined") {
        new QRCode(document.getElementById(`qr-${id}`), id);
    }
}

// دالة عرض الدروس (المدمجة مع زر الدرجات)
window.viewClassLessons = function(classId) {
    const selectedClass = allClasses.find(cls => cls.id === classId);
    if (!selectedClass) return;

    const container = document.getElementById("classes-container");
    container.innerHTML = `
        <button onclick="renderStudentClasses()">العودة لصفوفي</button>
        <h2>دروس صف: ${selectedClass.name}</h2>
        <button onclick="showStudentGrade('${selectedClass.id}')">عرض درجتي في هذا الصف</button>
        <div id="lessons-list"></div>
    `;

    const lessonsList = document.getElementById("lessons-list");
    selectedClass.lessons.forEach((lesson, index) => {
        const lessonDiv = document.createElement("div");
        lessonDiv.className = "lesson-card";
        lessonDiv.innerHTML = `<h4>الدرس ${index + 1}: ${lesson.title}</h4>`;
        lessonsList.appendChild(lessonDiv);
    });
};

// دالة عرض الدرجة الخاصة بكل طالب
window.showStudentGrade = function(classId) {
    const selectedClass = allClasses.find(cls => cls.id === classId);
    if (!selectedClass) return;

    const studentName = prompt("أدخل اسمك الثلاثي لعرض درجتك:");
    if (!studentName) return;

    const grade = selectedClass.grades[studentName];

    if (grade !== undefined) {
        alert("مرحباً " + studentName + "، درجتك في " + selectedClass.name + " هي: " + grade);
    } else {
        alert("عذراً، لم يتم العثور على درجة بهذا الاسم.");
    }
};
