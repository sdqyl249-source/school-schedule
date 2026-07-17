// classes.js

window.addEventListener('DOMContentLoaded', () => {
    // 1. عرض ترحيب الطالب تلقائياً
    showStudentInfo();

    // 2. ربط زر الحفظ
    const saveBtn = document.getElementById("saveClassBtn");
    if (saveBtn) {
        saveBtn.addEventListener('click', saveClass);
    }
});

// وظيفة عرض بيانات الطالب
function showStudentInfo() {
    if (localStorage.getItem("isStudent") === "true") {
        const studentName = localStorage.getItem("studentName");
        const studentPhone = localStorage.getItem("studentPhone");
        
        const infoBox = document.createElement('div');
        infoBox.style.cssText = "background: #e8f5e9; padding: 20px; border-right: 5px solid #2e7d32; margin-bottom: 20px; border-radius: 8px;";
        infoBox.innerHTML = `<h3>مرحباً بك: ${studentName}</h3><p>الهاتف: ${studentPhone}</p>`;
        
        document.body.prepend(infoBox);
    }
}

// وظيفة حفظ الصف (الموحدة)
function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (className === "" || classSection === "") {
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    // توليد رموز صف عشوائية
    const teacherCode = "T-" + Math.floor(1000 + Math.random() * 9000);
    const studentCode = "S-" + Math.floor(1000 + Math.random() * 9000);

    renderClassCard(className, classSection, teacherCode, studentCode);
}

// وظيفة عرض بطاقة الصف (التصميم الاحترافي)
function renderClassCard(name, section, teacherCode, studentCode) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card"; // تأكد أن هذا الكلاس موجود في CSS
    
    card.innerHTML = `
        <h3>الصف ${name} - شعبة ${section}</h3>
        <p>الوصول السريع:</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
            <button onclick="openVerificationModal('${teacherCode}', 'teacher')">دخول كمعلم</button>
            <button onclick="openVerificationModal('${studentCode}', 'student')">دخول كطالب</button>
        </div>
        <div id="qr-${teacherCode}" style="margin-top:15px; display:flex; justify-content:center;"></div>
    `;
    container.appendChild(card);
    
    // توليد الـ QR
    if (typeof QRCode !== "undefined") {
        new QRCode(document.getElementById(`qr-${teacherCode}`), teacherCode);
    }
}

// وظيفة فتح نافذة التحقق
window.openVerificationModal = function(code, role) {
    const name = prompt("يرجى إدخال اسمك الثلاثي:");
    const phone = prompt("يرجى إدخال رقم هاتفك للتأكيد:");

    if (name && phone) {
        verifyUserAndEnter(name, phone, code, role);
    } else {
        alert("بيانات غير مكتملة، لا يمكن الدخول.");
    }
}

// وظيفة التحقق والدخول
function verifyUserAndEnter(name, phone, code, role) {
    alert("جارٍ التحقق من رقم هاتفك...");
    loginUser(name, phone, role);
}

// وظيفة تسجيل الدخول النهائي
function loginUser(name, phone, role) {
    localStorage.setItem("userRole", role); 
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);
    
    if (role === 'student') {
        localStorage.setItem("isStudent", "true");
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentPhone", phone);
    }

    alert("أهلاً بك يا " + name + "، تم تفعيل صلاحياتك كـ " + role);
    window.location.href = "index.html"; 
}
