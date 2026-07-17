// استيراد الدوال من مكتبة Firebase v9
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ربط الدوال بـ window لتعمل مباشرة من ملفات الـ HTML
window.showPage = (id) => {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) pages[i].style.display = 'none';
    const target = document.getElementById(id);
    if(target) target.style.display = 'block';
};

window.openNav = () => {
    const sidebar = document.getElementById("mySidebar");
    const openBtn = document.getElementById("openBtn");
    if(sidebar) sidebar.style.width = "280px";
    const page = document.querySelector(".page");
    if(page) page.style.marginRight = "280px";
    if(openBtn) openBtn.style.display = "none";
};

window.closeNav = () => {
    const sidebar = document.getElementById("mySidebar");
    const openBtn = document.getElementById("openBtn");
    if(sidebar) sidebar.style.width = "0";
    const page = document.querySelector(".page");
    if(page) page.style.marginRight = "0";
    if(openBtn) openBtn.style.display = "block";
};

window.updateDateTime = () => {
    const el = document.getElementById("date-time");
    if (el) el.innerText = new Date().toLocaleString('ar-IQ');
};

window.handleAuth = () => {
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
};

window.deleteAnnouncement = (id) => {
    remove(ref(db, 'announcements/' + id));
};

window.addAnnouncement = () => {
    if (!localStorage.getItem("admin")) return alert("غير مصرح لك!");
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    if (!title || !text) return alert("يرجى ملء الحقول");
    push(ref(db, 'announcements'), { 
        title, text, date: new Date().toLocaleDateString('ar-IQ') 
    });
};

// تشغيل الوظائف عند تحميل الصفحة
window.onload = () => {
    window.updateDateTime();
    setInterval(window.updateDateTime, 1000);

    // عداد الزوار
    const visitorsRef = ref(db, 'visitors');
    runTransaction(visitorsRef, (current) => (current || 0) + 1);

    // جلب الإعلانات
    onValue(ref(db, 'announcements'), (snap) => {
        const list = document.getElementById('announcements-list');
        if(!list) return;
        list.innerHTML = "";
        const isAdmin = localStorage.getItem("admin");
        snap.forEach(c => {
            const data = c.val();
            const id = c.key;
            list.innerHTML += `
                <div class="card" style="border-right-color: #27ae60;">
                    <small>${data.date || ''}</small>
                    <h3>${data.title}</h3>
                    <p>${data.text}</p>
                    ${isAdmin ? `<button onclick="deleteAnnouncement('${id}')" style="background:#e74c3c; color:white;">حذف الإعلان</button>` : ''}
                </div>`;
        });
    });
};
