firebase.initializeApp({
    apiKey: "AIzaSyAuWDpBoR31ZjPzaUrAe4lppufSHuMLFyI",
    authDomain: "roya-platform-26860.firebaseapp.com",
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com",
    projectId: "roya-platform-26860",
    storageBucket: "roya-platform-26860.firebasestorage.app",
    messagingSenderId: "897544406776",
    appId: "1:897544406776:web:aa112013dea672fb141d0d"
});
const database = firebase.database();

// 1. التنقل بين الصفحات
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

// 2. التاريخ والوقت
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date-display').innerText = now.toLocaleDateString('ar-IQ', options);
    document.getElementById('time-display').innerText = now.toLocaleTimeString('ar-IQ');
}

// 3. نظام الصلاحيات
function handleAuth() {
    const level = localStorage.getItem("userLevel");
    if (level) { localStorage.removeItem("userLevel"); alert("تم تسجيل الخروج"); }
    else {
        const code = prompt("يرجى إدخال رمز الدخول:");
        if (code === "ahmed") localStorage.setItem("userLevel", "admin");
        else alert("رمز خاطئ");
    }
    location.reload();
}

// 4. البيانات الأساسية والزوار
function loadHomeData() {
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    database.ref('school_info').on('value', (snapshot) => {
        const info = snapshot.val() || { vision: "رؤيتنا...", about: "نبذة عن..." };
        const visionEl = document.getElementById('school-vision');
        const aboutEl = document.getElementById('school-about');
        
        visionEl.innerText = info.vision;
        aboutEl.innerText = info.about;
        visionEl.contentEditable = isAdmin;
        aboutEl.contentEditable = isAdmin;
    });

    const vRef = database.ref('visitors');
    vRef.transaction(c => (c || 0) + 1);
    vRef.on('value', s => document.getElementById('visitor-count').innerText = s.val() || 0);
}

function updateInfo(field, val) {
    if (localStorage.getItem("userLevel") !== "admin") return;
    database.ref('school_info').update({ [field]: val });
}

// 5. إدارة الصفوف
function saveClass() {
    const name = document.getElementById('class-input').value;
    const section = document.getElementById('section-input').value;
    if (!name || !section) return alert("يرجى ملء الحقول");
    database.ref('school_data/classes').push({ name, section }).then(() => {
        alert("تم الحفظ!");
        document.getElementById('class-input').value = '';
    });
}

database.ref('school_data/classes').on('value', (snapshot) => {
    const list = document.getElementById('classes-list');
    list.innerHTML = '<h3>الصفوف المضافة:</h3>';
    snapshot.forEach(child => {
        const item = child.val();
        list.innerHTML += `<div class="card">${item.name} - شعبة ${item.section}</div>`;
    });
});

// 6. التهيئة
window.onload = function() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    loadHomeData();
    const btn = document.getElementById("authBtn");
    btn.innerText = localStorage.getItem("userLevel") ? "🔓 خروج" : "🔐 تسجيل الدخول";
};
