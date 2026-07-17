// classes.js - النسخة الموحدة والكاملة

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

    // ملاحظة: تأكد أن مصفوفة allClasses معرفة في ملف classesDatabase.js
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

// وظيفة حفظ الصف (للأستاذ)
function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (!className || !classSection) {
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    // توليد رموز الصف
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

// دالة عرض الدروس (سيتم برمجتها لاحقاً)
window.viewClassLessons = function(id) {
    alert("جارٍ فتح دروس الصف: " + id);
};
