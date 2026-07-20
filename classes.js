window.currentActiveChatClassId = "";

document.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل ملف classes.js بنجاح");
    
    let userString = localStorage.getItem("currentUser");
    if (!userString) return;

    try {
        const userProfile = JSON.parse(userString);
        loadUserDataFromCloud(userProfile.phone);
        showUserWelcome(userProfile);
        
        const role = userProfile.role ? userProfile.role.trim().toLowerCase() : "";
        if (role === 'student') renderStudentClasses();
        else if (role === 'teacher') renderTeacherClasses();

        // ربط الأزرار مع فحص الأمان
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

// دوال الدردشة
window.loadMessages = function(classId) {
    window.currentActiveChatClassId = classId;
    const chatSection = document.getElementById('chatSection');
    const chatTitle = document.getElementById('currentChatTitle');
    const chatBox = document.getElementById("chat-messages");
    
    if (chatSection) chatSection.style.display = 'block';
    if (chatTitle) chatTitle.innerText = "غرفة دردشة الصف: " + classId;
    if (chatBox) {
        chatBox.innerHTML = "جاري التحميل...";
        window.database.ref('chat/' + classId).on('value', (snapshot) => {
            chatBox.innerHTML = "";
            const messages = snapshot.val();
            if (messages) {
                Object.values(messages).forEach(msg => {
                    chatBox.innerHTML += `<div style="margin-bottom: 5px;"><strong>${msg.sender}:</strong> ${msg.text}</div>`;
                });
                chatBox.scrollTop = chatBox.scrollHeight;
            } else {
                chatBox.innerHTML = "لا توجد رسائل بعد.";
            }
        });
    }
};

window.sendMessage = function(classId) {
    const input = document.getElementById("message-input");
    if (!input || !input.value.trim()) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    window.database.ref('chat/' + classId).push({
        sender: user.name,
        text: input.value.trim(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => input.value = "");
};

// دوال إدارة الصفوف
// تحديث دالة renderStudentClasses لتكون آمنة مثل زميلتها
function renderStudentClasses() {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    if (typeof window.database === 'undefined') {
        setTimeout(renderStudentClasses, 500);
        return;
    }
    
    container.innerHTML = `<button onclick="window.joinClass()">+ انضمام لصف جديد</button>`;
    window.database.ref('classes/').on('value', (snapshot) => {
        const data = snapshot.val();
        const user = JSON.parse(localStorage.getItem("currentUser"));
        const joined = user.joinedClasses || [];
        if (data) {
            Object.values(data).forEach(cls => {
                if (joined.includes(cls.id)) {
                    const card = document.createElement("div");
                    card.className = "class-card";
                    card.innerHTML = `<h3>${cls.name}</h3>
                                      <button onclick="window.loadMessages('${cls.id}')">💬 الدردشة</button>
                                      <button onclick="window.viewClassLessons('${cls.id}')">الدروس</button>`;
                    container.appendChild(card);
                }
            });
        }
    });
}

// تحديث دالة loadUserDataFromCloud لتكون آمنة
function loadUserDataFromCloud(phone) {
    if (typeof window.database === 'undefined') {
        setTimeout(() => loadUserDataFromCloud(phone), 500);
        return;
    }
    window.database.ref('users/' + phone).on('value', (s) => { 
        if(s.val()) localStorage.setItem("currentUser", JSON.stringify(s.val())); 
    });
}
function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    // نمط التحقق الآمن
    if (typeof window.database === 'undefined') {
        console.warn("قاعدة البيانات لم تجهز بعد، سننتظر...");
        setTimeout(renderTeacherClasses, 500); // إعادة المحاولة بعد 500 مللي ثانية
        return;
    }

    // الآن نضمن أن window.database موجودة
    window.database.ref('classes/').on('value', (snapshot) => {
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

window.saveClass = function() {
    const name = document.getElementById("className")?.value;
    const section = document.getElementById("classSection")?.value;
    if (!name || !section) return alert("يرجى اختيار اسم الصف والشعبة");
    
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    window.database.ref('classes/' + id).set({ id, name, section, lessons: [{ title: "مقدمة" }] })
    .then(() => alert("تم الحفظ!"));
};

function showUserWelcome(user) {
    const header = document.querySelector('h1') || document.body;
    const infoBox = document.createElement('div');
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3>`;
    header.parentNode.insertBefore(infoBox, header.nextSibling);
}
