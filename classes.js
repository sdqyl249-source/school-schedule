function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (className === "" || classSection === "") {
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    // توليد رمز صف عشوائي (مثلاً: رقم من 4 خانات)
    const classCode = "CLS-" + Math.floor(1000 + Math.random() * 9000);

    // هنا نرسل البيانات (الاسم، الشعبة، الرمز) إلى قاعدة البيانات
    console.log("تم حفظ الصف:", className, section, "الرمز:", classCode);

    // عرض البطاقة مع الرمز
    renderClassCard(className, classSection, classCode);
}

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
    
    // توليد الأكواد (باستخدام مكتبة QRCode.js)
    new QRCode(document.getElementById(`qr-teacher-${teacherCode}`), teacherCode);
    new QRCode(document.getElementById(`qr-student-${studentCode}`), studentCode);
}
function openVerificationModal(code, role) {
    // تظهر نافذة للمستخدم تطلب الاسم ورقم الهاتف
    const name = prompt("يرجى إدخال اسمك الثلاثي:");
    const phone = prompt("يرجى إدخال رقم هاتفك للتأكيد:");

    if (name && phone) {
        // هنا نتحقق من البيانات (نرسلها للسيرفر أو نقارنها بقاعدة البيانات)
        verifyUserAndEnter(name, phone, code, role);
    } else {
        alert("بيانات غير مكتملة، لا يمكن الدخول.");
    }
}

function verifyUserAndEnter(name, phone, code, role) {
    // هنا نقوم بحفظ هوية المستخدم في الـ Session
    // ونحول الطالب للصفحه المطلوبة بناءً على صلاحيته
    console.log(`المستخدم ${name} يحاول الدخول كـ ${role} باستخدام كود ${code}`);
    alert("جارٍ التحقق من رقم هاتفك...");
    // كود إرسال الـ OTP للواتساب سيتم هنا
}
function loginUser(name, phone, role) {
    // حفظ البيانات في LocalStorage (تبقى موجودة حتى لو أغلق المتصفح)
    localStorage.setItem("userRole", role);   // قيمة تكون "student" أو "teacher"
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);

    alert("أهلاً بك يا " + name + "، تم تفعيل صلاحياتك كـ " + role);
    window.location.href = "index.html"; // الانتقال للصفحة الرئيسية
}
