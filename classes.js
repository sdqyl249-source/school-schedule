// دالة حفظ الصف
function saveClass() {
    const className = document.getElementById("className").value;
    const classSection = document.getElementById("classSection").value;

    if (className === "" || classSection === "") {
        alert("يرجى ملء جميع الحقول!");
        return;
    }

    // هنا سنضيف كود إرسال البيانات لقاعدة البيانات (Firebase أو غيرها)
    console.log("تم حفظ الصف: " + className + " شعبة: " + classSection);

    // دالة لعرض الصف الجديد في الصفحة فوراً
    renderClassCard(className, classSection);
}

// دالة عرض بطاقة الصف
function renderClassCard(name, section) {
    const container = document.getElementById("classesContainer");
    const card = document.createElement("div");
    card.className = "class-card";
    card.innerHTML = `
        <h3>${name} - ${section}</h3>
        <p>الأستاذ: غير محدد</p>
        <button onclick="enterClass()">دخول الصف</button>
    `;
    container.appendChild(card);
}
