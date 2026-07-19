import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
// (لاحظ أننا استغنينا عن getAnalytics لأننا نحتاج فقط Database)

const firebaseConfig = {
  apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
  authDomain: "roya-platform-26860.firebaseapp.com",
  databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
  projectId: "roya-platform-26860",
  storageBucket: "roya-platform-26860.firebasestorage.app",
  messagingSenderId: "897544406776",
  appId: "1:897544406776:web:aa112013dea672fb141d0d",
  measurementId: "G-Y88LCNKED2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.currentActiveChatClassId = "";

// 2. التحميل عند بدء التشغيل
document.addEventListener('DOMContentLoaded', () => {
    let userString = localStorage.getItem("currentUser");
    if (userString) {
        const userProfile = JSON.parse(userString);
        loadUserDataFromCloud(userProfile.phone);
        showUserWelcome(userProfile);
        
        if (userProfile.role === 'student') renderStudentClasses();
        else if (userProfile.role === 'teacher') renderTeacherClasses();

        // ربط زر الإرسال
        const sendBtn = document.getElementById("send-btn");
        const input = document.getElementById("message-input");
        if (sendBtn) {
            sendBtn.onclick = () => {
                if (window.currentActiveChatClassId) window.sendMessage(window.currentActiveChatClassId);
            };
            input.addEventListener("keypress", (e) => { if (e.key === "Enter") sendBtn.click(); });
        }
    } else {
        alert("يرجى تسجيل الدخول!");
        window.location.href = "login.html";
    }
});

// 3. وظائف الدردشة
window.loadMessages = function(classId) {
    window.currentActiveChatClassId = classId;
    document.getElementById('chatSection').style.display = 'block';
    document.getElementById('currentChatTitle').innerText = "غرفة دردشة الصف: " + classId;
    const chatBox = document.getElementById("chat-messages");
    chatBox.innerHTML = "جاري التحميل...";

    onValue(ref(db, 'chat/' + classId), (snapshot) => {
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
    push(ref(db, 'chat/' + classId), {
        sender: user.name,
        text: input.value.trim(),
        timestamp: serverTimestamp()
    }).then(() => input.value = "");
};

// 4. وظائف الصفوف (الطلاب)
window.joinClass = function() {
    const classId = prompt("أدخل رمز الصف (4 أرقام):");
    if (!classId || !/^\d{4}$/.test(classId)) return alert("يجب إدخال 4 أرقام!");

    const userProfile = JSON.parse(localStorage.getItem("currentUser"));
    get(ref(db, 'classes/' + classId)).then((snapshot) => {
        if (!snapshot.exists()) return alert("الرمز غير موجود.");
        if (userProfile.joinedClasses?.includes(classId)) return alert("منضم مسبقاً!");

        const updatedClasses = [...(userProfile.joinedClasses || []), classId];
        update(ref(db, 'users/' + userProfile.phone), { joinedClasses: updatedClasses }).then(() => {
            userProfile.joinedClasses = updatedClasses;
            localStorage.setItem("currentUser", JSON.stringify(userProfile));
            renderStudentClasses();
        });
    });
};

function renderStudentClasses() {
    const container = document.getElementById("classesContainer");
    container.innerHTML = `<button onclick="window.joinClass()">+ انضمام لصف جديد</button>`;
    onValue(ref(db, 'classes/'), (snapshot) => {
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

// 5. وظائف الأستاذ
function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    onValue(ref(db, 'classes/'), (snapshot) => {
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
    const id = Math.floor(1000 + Math.random() * 9000).toString(); // رمز 4 أرقام
    set(ref(db, 'classes/' + id), { id, name, section, teacher: "أ. عقيل السعد", lessons: [{ title: "مقدمة" }] })
    .then(() => alert("تم الحفظ!"));
};

window.deleteClass = function(classId) {
    if (confirm("حذف الصف؟")) remove(ref(db, 'classes/' + classId));
};

// 6. دوال مساعدة
window.viewClassLessons = function(classId) {
    onValue(ref(db, 'classes/' + classId), (snapshot) => {
        const c = snapshot.val();
        const container = document.getElementById("classesContainer");
        container.innerHTML = `<button onclick="location.reload()">العودة</button><h2>دروس: ${c.name}</h2><div id="lessons-list"></div>`;
        c.lessons?.forEach((l, i) => {
            document.getElementById("lessons-list").innerHTML += `<div>الدرس ${i + 1}: ${l.title}</div>`;
        });
    }, { onlyOnce: true });
};

function loadUserDataFromCloud(phone) {
    onValue(ref(db, 'users/' + phone), (s) => { if(s.val()) localStorage.setItem("currentUser", JSON.stringify(s.val())); });
}

function showUserWelcome(user) {
    const infoBox = document.createElement('div');
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3>`;
    document.body.prepend(infoBox);
}
