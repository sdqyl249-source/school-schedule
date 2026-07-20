window.currentActiveChatClassId = "";

// حماية فائقة لضمان عدم حدوث خطأ حتى لو تأخرت القاعدة
window.getSafeDatabase = function() {
    if (typeof window.database !== 'undefined' && window.database !== null) {
        return window.database;
    }
    console.error("قاعدة البيانات غير معرفة بعد!");
    return null;
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل ملف classes.js بنجاح");
    
    let userString = localStorage.getItem("currentUser");
    if (!userString) return;

    try {
        const userProfile = JSON.parse(userString);
        showUserWelcome(userProfile);
        
        // فحص دور المستخدم
        const role = userProfile.role ? userProfile.role.trim().toLowerCase() : "";
        
        // محاولة جلب الصفوف بطريقة آمنة
        const checkDbInterval = setInterval(() => {
            const db = window.getSafeDatabase();
            if (db) {
                clearInterval(checkDbInterval);
                loadUserDataFromCloud(userProfile.phone);
                if (role === 'student') renderStudentClasses();
                else if (role === 'teacher') renderTeacherClasses();
            }
        }, 50);

        // ربط أزرار الدردشة
        const sendBtn = document.getElementById("send-btn");
        const input = document.getElementById("message-input");
        if (sendBtn && input) {
            sendBtn.onclick = () => {
                if (window.currentActiveChatClassId) window.sendMessage(window.currentActiveChatClassId);
            };
            input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendBtn.click(); });
        }

        const saveBtn = document.getElementById("saveClassBtn");
        if (saveBtn) saveBtn.addEventListener("click", window.saveClass);

    } catch (e) {
        console.error("خطأ في تهيئة الصفحة:", e);
    }
});

function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    const db = window.getSafeDatabase();
    if (!db) return;

    db.ref('classes/').on('value', (snapshot) => {
        container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-card";
                card.innerHTML = `<h3>${cls.name}</h3><small>الرمز: ${cls.id}</small><br>
                                  <button onclick="window.viewClassLessons('${cls.id}')">عرض</button>
                                  <button onclick="window.deleteClass('${cls.id}')" style="background:#8b0000; color:white;">حذف</button>`;
                container.appendChild(card);
            });
        }
    });
}

function loadUserDataFromCloud(phone) {
    const db = window.getSafeDatabase();
    if (!db) return;
    db.ref('users/' + phone).on('value', (s) => { 
        if(s.val()) localStorage.setItem("currentUser", JSON.stringify(s.val())); 
    });
}

function showUserWelcome(user) {
    const header = document.querySelector('h1') || document.body;
    const infoBox = document.createElement('div');
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3>`;
    header.parentNode.insertBefore(infoBox, header.nextSibling);
}

window.viewClassLessons = (id) => alert("عرض دروس: " + id);
window.deleteClass = (id) => { 
    const db = window.getSafeDatabase();
    if(confirm("حذف الصف؟") && db) db.ref('classes/' + id).remove(); 
};
window.saveClass = function() {
    const name = document.getElementById("className")?.value;
    const section = document.getElementById("classSection")?.value;
    const db = window.getSafeDatabase();
    if (!name || !section || !db) return alert("خطأ في البيانات أو اتصال القاعدة");
    
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    db.ref('classes/' + id).set({ id, name, section, lessons: [{ title: "مقدمة" }] })
    .then(() => alert("تم الحفظ!"));
};
