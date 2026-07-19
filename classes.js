
window.currentActiveChatClassId = "";

// 1. تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل ملف classes.js بنجاح");
    
    let userString = localStorage.getItem("currentUser");
    
    if (!userString) {
        console.warn("لا يوجد مستخدم في LocalStorage");
        return;
    }

    try {
        const userProfile = JSON.parse(userString);
        console.log("بيانات المستخدم:", userProfile);
        
        loadUserDataFromCloud(userProfile.phone);
        showUserWelcome(userProfile);
        
        // التحقق من الدور بدقة (بإضافة trim و toLowerCase لتجنب أخطاء المسافات)
        const role = userProfile.role ? userProfile.role.trim().toLowerCase() : "";
        
        if (role === 'student') {
            console.log("تشغيل واجهة الطالب");
            renderStudentClasses();
        } else if (role === 'teacher') {
            console.log("تشغيل واجهة الأستاذ");
            renderTeacherClasses();
        } else {
            console.warn("دور المستخدم غير معرف أو غير مطابق:", role);
        }

        // ربط زر الإرسال
        const sendBtn = document.getElementById("send-btn");
        const input = document.getElementById("message-input");
        if (sendBtn) {
            sendBtn.onclick = () => {
                if (window.currentActiveChatClassId) window.sendMessage(window.currentActiveChatClassId);
            };
            if (input) {
                input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendBtn.click(); });
            }
        }

        // ربط زر حفظ الصف
        const saveBtn = document.getElementById("saveClassBtn");
        if (saveBtn) {
            saveBtn.addEventListener("click", window.saveClass);
            console.log("تم ربط زر الحفظ بنجاح");
        } else {
            console.warn("لم يتم العثور على زر الحفظ (saveClassBtn)");
        }

    } catch (e) {
        console.error("خطأ في معالجة بيانات المستخدم:", e);
    }
});
// 2. وظائف الدردشة المتوافقة مع Compat
window.loadMessages = function(classId) {
    window.currentActiveChatClassId = classId;
    document.getElementById('chatSection').style.display = 'block';
    document.getElementById('currentChatTitle').innerText = "غرفة دردشة الصف: " + classId;
    const chatBox = document.getElementById("chat-messages");
    chatBox.innerHTML = "جاري التحميل...";

    const chatRef = window.database.ref('chat/' + classId);
    
    chatRef.on('value', (snapshot) => {
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
};

window.sendMessage = function(classId) {
    const input = document.getElementById("message-input");
    if (!input.value.trim()) return;
    const user = JSON.parse(localStorage.getItem("currentUser"));
    
    window.database.ref('chat/' + classId).push({
        sender: user.name,
        text: input.value.trim(),
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }).then(() => input.value = "");
};

// 3. وظائف الصفوف
window.joinClass = function() {
    const classId = prompt("أدخل رمز الصف (4 أرقام):");
    if (!classId || !/^\d{4}$/.test(classId)) return alert("يجب إدخال 4 أرقام!");

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    window.database.ref('classes/' + classId).once('value').then((snapshot) => {
        if (!snapshot.exists()) return alert("الرمز غير موجود.");
        if (userProfile.joinedClasses?.includes(classId)) return alert("منضم مسبقاً!");

        const updatedClasses = [...(userProfile.joinedClasses || []), classId];
        window.database.ref('users/' + userProfile.phone).update({ joinedClasses: updatedClasses }).then(() => {
            userProfile.joinedClasses = updatedClasses;
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
            renderStudentClasses();
        });
    });
};

function renderStudentClasses() {
    const container = document.getElementById("classesContainer");
    container.innerHTML = `<button onclick="window.joinClass()">+ انضمام لصف جديد</button>`;
    
    window.database.ref('classes/').on('value', (snapshot) => {
        const data = snapshot.val();
        const joined = JSON.parse(localStorage.getItem("currentUser")).joinedClasses || [];
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

function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    window.database.ref('classes/').on('value', (snapshot) => {
        container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(cls => {
                const card = document.createElement("div");
                card.className = "class-card";
                card.innerHTML = `<h3>${cls.name}</h3><small>الرمز: ${cls.id}</small><br>
                                  <button onclick="window.viewClassLessons('${cls.id}')">عرض</button>
                                  <button onclick="window.deleteClass('${cls.id}')" style="background:#8b0000;">حذف</button>`;
                container.appendChild(card);
            });
        }
    });
}

window.saveClass = function() {
    const name = document.getElementById("className").value;
    const section = document.getElementById("classSection").value;
    const id = Math.floor(1000 + Math.random() * 9000).toString();
    window.database.ref('classes/' + id).set({ id, name, section, teacher: "أ. عقيل السعد", lessons: [{ title: "مقدمة" }] })
    .then(() => alert("تم الحفظ!"));
};

window.deleteClass = function(classId) {
    if (confirm("حذف الصف؟")) window.database.ref('classes/' + classId).remove();
};

window.viewClassLessons = function(classId) {
    window.database.ref('classes/' + classId).once('value').then((snapshot) => {
        const c = snapshot.val();
        const container = document.getElementById("classesContainer");
        container.innerHTML = `<button onclick="location.reload()">العودة</button><h2>دروس: ${c.name}</h2><div id="lessons-list"></div>`;
        c.lessons?.forEach((l, i) => {
            document.getElementById("lessons-list").innerHTML += `<div>الدرس ${i + 1}: ${l.title}</div>`;
        });
    });
};

function loadUserDataFromCloud(phone) {
    // التأكد من وجود window.database أولاً
    if (!window.database) {
        console.error("قاعدة البيانات غير مهيأة!");
        return;
    }

    window.database.ref('users/' + phone).on('value', (s) => { 
        const userData = s.val();
        if (userData) {
            // تحديث الـ localStorage بالبيانات الأحدث من السحابة
            localStorage.setItem("currentUser", JSON.stringify(userData));
            console.log("تم تحديث بيانات المستخدم من السحابة بنجاح.");
        }
    }, (error) => {
        console.error("خطأ في جلب بيانات المستخدم:", error);
    });
}

function showUserWelcome(user) {
    const infoBox = document.createElement('div');
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3>`;
    document.body.prepend(infoBox);
}
