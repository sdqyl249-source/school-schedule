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
