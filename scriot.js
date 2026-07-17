// استيراد الدوال اللازمة من مكتبة Firebase v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getDatabase, ref, set, push, remove, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// إعدادات المشروع
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

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// 1. التنقل بين الصفحات
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.querySelector(".page").style.marginRight = "0";
    document.getElementById("openBtn").style.display = "block";
}

function openNav() {
    document.getElementById("mySidebar").style.width = "280px";
    document.querySelector(".page").style.marginRight = "280px";
    document.getElementById("openBtn").style.display = "none";
}

// 2. تحديث التاريخ والوقت
// 2. تحديث التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const el = document.getElementById("date-time");
    if (el) {
        // نستخدم toLocaleString لعرض التاريخ والوقت معاً بتنسيق العراق
        el.innerText = now.toLocaleString('ar-IQ');
    }
}

// استدعاء الدالة فور تحميل الصفحة
updateDateTime();

// تحديث الوقت كل ثانية (1000 ميلي ثانية)
setInterval(updateDateTime, 1000);
setInterval(updateDateTime, 1000);

// 3. نظام الصلاحيات
window.handleAuth = function() {
    if (localStorage.getItem("admin")) {
        localStorage.removeItem("admin");
        alert("تم تسجيل الخروج");
        location.reload();
    } else {
        const pass = prompt("يرجى إدخال كلمة مرور المدير:");
        if (pass === "1234") {
            localStorage.setItem("admin", "true");
            location.reload();
        } else {
            alert("كلمة مرور خاطئة!");
        }
    }
}

// 4. الرؤية والنبذة
window.updateInfo = function(field, text) {
    if (!localStorage.getItem("admin")) return;
    set(ref(db, 'settings/' + field), { content: text });
};

// 5. إدارة الإعلانات
window.addAnnouncement = function() {
    if (!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    if (!title || !text) return alert("يرجى ملء الحقول");
    push(ref(db, 'announcements'), { 
        title, text, date: new Date().toLocaleDateString('ar-IQ') 
    });
    document.getElementById('ann-title').value = "";
    document.getElementById('ann-text').value = "";
};

window.deleteAnnouncement = function(id) {
    remove(ref(db, 'announcements/' + id));
};

// 6. تحميل الصفحة
window.onload = () => {
    updateDateTime();
    
    // عداد الزوار
    const visitorsRef = ref(db, 'visitors');
    runTransaction(visitorsRef, (current) => {
        return (current || 0) + 1;
    });

    onValue(visitorsRef, (snap) => {
        const countEl = document.getElementById('visitor-count');
        if(countEl) countEl.innerText = snap.val() || 0;
    });

    const isAdmin = localStorage.getItem("admin");

    // تفعيل وضع التعديل
    const editableElements = document.querySelectorAll('.editable');
    if (isAdmin) {
        editableElements.forEach(el => {
            el.contentEditable = "true";
            el.style.border = "2px dashed #e67e22";
        });
        
        document.querySelectorAll('.admin-section').forEach(e => e.style.display = 'block');
        const authBtn = document.getElementById("authBtn");
        if(authBtn) authBtn.innerText = "🔓 تسجيل الخروج";
    }

    // جلب الرؤية
    onValue(ref(db, 'settings/vision'), (snap) => {
        if(snap.val()) document.getElementById('school-vision').innerText = snap.val().content;
    });

    // جلب الإعلانات
    onValue(ref(db, 'announcements'), (snap) => {
        const list = document.getElementById('announcements-list');
        if(!list) return;
        list.innerHTML = "";
        snap.forEach(c => {
            const data = c.val();
            const id = c.key;
            list.innerHTML += `
                <div class="card" style="border-right-color: #27ae60;">
                    <small>${data.date || ''}</small>
                    <h3>${data.title}</h3>
                    <p>${data.text}</p>
                    ${isAdmin ? `<button onclick="deleteAnnouncement('${id}')" style="background:#e74c3c;">حذف الإعلان</button>` : ''}
                </div>`;
        });
    });
};
