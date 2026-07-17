// classes.js

window.addEventListener('DOMContentLoaded', () => {
    // 1. عرض ترحيب الطالب تلقائياً عند فتح الصفحة
    showStudentInfo();

    // ربط زر الحفظ إذا كان موجوداً في الصفحة
    const saveBtn = document.getElementById("saveClassBtn");
    if (saveBtn) {
        saveBtn.addEventListener('click', saveClass);
    }
});// classes.js

window.addEventListener('DOMContentLoaded', () => {
    // عرض بيانات الطالب إذا كان مسجلاً مسبقاً
    showStudentInfo();
    
    // ربط زر الحفظ
    const saveBtn = document.getElementById("saveClassBtn");
    if (saveBtn) {
        saveBtn.addEventListener('click', saveClass);
    }
});

// 1. وظيفة عرض بيانات الطالب الترحيبية
function showStudentInfo() {
    if (localStorage.getItem("isStudent") === "true") {
        const infoBox = document.createElement('div');
        infoBox.style.cssText = "background: #e8f5e9; padding: 20px; border-right: 5px solid #2e7d32; margin: 20px; border-radius: 8px;";
        infoBox.innerHTML = `<h3>مرحباً بك: ${localStorage.getItem("studentName")}</h3><p>رقم الهاتف: ${localStorage.getItem("studentPhone")}</p>`;
        document.body.prepend(infoBox);
    }
}

// 2. وظيفة حفظ الصف وإنشاء البطاقة
function saveClass() {
    const name = document.getElementById("className").value;
    const section = document.getElementById("classSection").value;
    
    // توليد رموز فريدة
    const tCode = "T-" + Math.floor(1000 + Math.random() * 9000);
    const sCode = "S-" + Math.floor(1000 + Math.random() * 9000);
    
    renderClassCard(name, section, tCode, sCode);
}

// 3. وظيفة عرض البطاقة بالتصميم الجديد
function renderClassCard(name, section, tCode, sCode) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card"; // هذا الكلاس سيرتبط بالـ CSS الداكن
    
    card.innerHTML = `
        <h3>الصف ${name} - شعبة ${section}</h3>
        <p>الوصول السريع:</p>
        <div style="display: flex; justify-content: center; gap: 10px;">
            <button onclick="openVerificationModal('${tCode}', 'teacher')">دخول كمعلم</button>
            <button onclick="openVerificationModal('${sCode}', 'student')">دخول كطالب</button>
        </div>
        <div id="qr-${tCode}" style="margin-top:15px; display:flex; justify-content:center;"></div>
    `;
    container.appendChild(card);
    
    // توليد الـ QR كود
    if (typeof QRCode !== "undefined") {
        new QRCode(document.getElementById(`qr-${tCode}`), tCode);
    }
}

// 4. نافذة التحقق من الهوية
window.openVerificationModal = function(code, role) {
    const name = prompt("يرجى إدخال اسمك الثلاثي:");
    const phone = prompt("يرجى إدخال رقم هاتفك للتأكيد:");
    
    if (name && phone) {
        verifyUserAndEnter(name, phone, code, role);
    } else {
        alert("بيانات غير مكتملة، لا يمكن الدخول.");
    }
}

// 5. التحقق وتسجيل الدخول النهائي
function verifyUserAndEnter(name, phone, code, role) {
    alert("جارٍ التحقق من بياناتك...");
    
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

// وظيفة حفظ الصف
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

    console.log("تم حفظ الصف:", className, classSection);
    renderClassCard(className, classSection, teacherCode, studentCode);
}

// وظيفة عرض بطاقة الصف
function renderClassCard(name, section, teacherCode, studentCode) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card";
    
    card.innerHTML = `
        <h3>${name} - ${section}</h3>
        <div class="qr-section">
            <div id="qr-teacher-${teacherCode}"><span>رمز المعلم</span></div>
            <div id="qr-student-${studentCode}"><span>رمز الطالب</span></div>
        </div>
        <button onclick="openVerificationModal('${teacherCode}', 'teacher')">دخول كمعلم</button>
        <button onclick="openVerificationModal('${studentCode}', 'student')">دخول كطالب</button>
    `;
    container.appendChild(card);
    
    // ملاحظة: تأكد من تحميل مكتبة QRCode.js في ملف HTML الخاص بك
    if (typeof QRCode !== "undefined") {
        new QRCode(document.getElementById(`qr-teacher-${teacherCode}`), teacherCode);
        new QRCode(document.getElementById(`qr-student-${studentCode}`), studentCode);
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
    console.log(`المستخدم ${name} يحاول الدخول كـ ${role} باستخدام كود ${code}`);
    alert("جارٍ التحقق من رقم هاتفك...");
    
    // بعد التحقق الناجح، نقوم بتسجيل الدخول
    loginUser(name, phone, role);
}

// وظيفة تسجيل الدخول النهائي
function loginUser(name, phone, role) {
    localStorage.setItem("userRole", role); 
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);
    
    // إذا كان طالباً، نحدث حالة الدخول
    if (role === 'student') {
        localStorage.setItem("isStudent", "true");
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentPhone", phone);
    }

    alert("أهلاً بك يا " + name + "، تم تفعيل صلاحياتك كـ " + role);
    window.location.href = "index.html"; 
}
