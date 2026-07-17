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

function renderClassCard(name, section, code) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card"; // هذا الكلاس يحمل التنسيق الذي صممناه سابقاً
    
    card.innerHTML = `
        <h3>${name} - ${section}</h3>
        <p>الرمز: <strong>${code}</strong></p>
        <p>الأستاذ: غير محدد</p>
        <button onclick="enterClass('${code}')">دخول الصف</button>
    `;
    container.appendChild(card);
}
