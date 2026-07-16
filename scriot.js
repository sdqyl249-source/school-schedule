// =========================================================
// ملف scriot.js - المنصة التعليمية "رؤية" (محاكاة محلية كاملة)
// =========================================================

// 1. نظام التنقل والتحكم بالصفحات
function showPage(id) {
    const pages = document.getElementsByClassName('page');
    for (let i = 0; i < pages.length; i++) {
        pages[i].style.display = 'none';
    }
    document.getElementById(id).style.display = 'block';
}

// 2. تحديث التاريخ والوقت الحي (بالتوقيت العراقي)
function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    
    const dateEl = document.getElementById('date-display');
    const timeEl = document.getElementById('time-display');
    
    if (dateEl) dateEl.innerText = now.toLocaleDateString('ar-IQ', options);
    if (timeEl) timeEl.innerText = now.toLocaleTimeString('ar-IQ');
}
setInterval(updateDateTime, 1000);

// 3. إدارة نظام الصلاحيات وتسجيل الدخول
function handleAuth() {
    const currentLevel = localStorage.getItem("userLevel");
    
    if (currentLevel === "admin") {
        localStorage.removeItem("userLevel");
        alert("تم تسجيل الخروج، لقد عدت الآن بصفة زائر.");
    } else {
        const password = prompt("يرجى إدخال رمز دخول المدير:");
        if (password === "ahmed") {
            localStorage.setItem("userLevel", "admin");
            alert("مرحباً بك أيها المدير! تم تفعيل صلاحيات الكتابة والتعديل بالكامل.");
        } else {
            alert("رمز الدخول غير صحيح! تم رفض الوصول.");
        }
    }
    location.reload(); // إعادة تحميل الصفحة لتطبيق التغييرات
}

// 4. تحميل وعرض بيانات الصفحة الرئيسية والتحقق من صلاحية تعديل المدير
function loadHomeData() {
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    
    // جلب الرؤية والنبذة المخزنة أو تعيين قيم افتراضية
    const savedVision = localStorage.getItem("school_vision") || "رؤيتنا هي تقديم مستوى تعليمي متميز يواكب العصر، وبناء شخصية طلابية قيادية متكاملة قادرة على الإبداع والريادة.";
    const savedAbout = localStorage.getItem("school_about") || "تأسست مدرستنا بهدف تقديم رعاية تعليمية شاملة، وتضم نخبة من الكوادر التدريسية المبدعة في كافة الاختصاصات العلمية والإنسانية.";
    
    const visionEl = document.getElementById('school-vision');
    const aboutEl = document.getElementById('school-about');
    
    if (visionEl) {
        visionEl.innerText = savedVision;
        visionEl.contentEditable = isAdmin; // تفعيل الكتابة فقط للأدمن
        if (isAdmin) {
            visionEl.style.border = "1px dashed #e67e22";
            document.getElementById('vision-tip').style.display = 'block';
        }
    }
    
    if (aboutEl) {
        aboutEl.innerText = savedAbout;
        aboutEl.contentEditable = isAdmin; // تفعيل الكتابة فقط للأدمن
        if (isAdmin) {
            aboutEl.style.border = "1px dashed #e67e22";
            document.getElementById('about-tip').style.display = 'block';
        }
    }

    // إدارة عداد الزوار (يزداد مرة واحدة مع كل فتح أو إعادة تحميل للصفحة)
    let visitors = parseInt(localStorage.getItem("visitor_count")) || 120; // يبدأ من 120 كقيمة أولية افتراضية
    visitors += 1;
    localStorage.setItem("visitor_count", visitors);
    
    const countEl = document.getElementById('visitor-count');
    if (countEl) {
        countEl.innerText = visitors;
    }
}

// دالة لحفظ تعديل الرؤية والنبذة في المتصفح تلقائياً عند نقر الفأرة خارجها (onblur)
function updateInfo(field, text) {
    if (localStorage.getItem("userLevel") !== "admin") return;
    
    if (field === 'vision') {
        localStorage.setItem("school_vision", text);
    } else if (field === 'about') {
        localStorage.setItem("school_about", text);
    }
    console.log("تم تحديث " + field + " بنجاح محلياً.");
}

// 5. إدارة لوحة الإعلانات
function renderAnnouncements() {
    const listEl = document.getElementById('announcements-list');
    if (!listEl) return;
    
    const savedAnn = JSON.parse(localStorage.getItem("announcements")) || [
        { id: 1, title: "ترحيب بالعام الدراسي الجديد", text: "ترحب إدارة المدرسة بكافة أبنائها الطلبة وتتمنى لهم عاماً مليئاً بالتفوق والنجاح." }
    ];
    
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    listEl.innerHTML = "";
    
    savedAnn.forEach(ann => {
        listEl.innerHTML += `
            <div class="card" style="border-right-color: #3498db;">
                <h3 style="color: #2980b9; margin-top: 0;">📢 ${ann.title}</h3>
                <p style="line-height: 1.6; color: #34495e;">${ann.text}</p>
                ${isAdmin ? `<button class="delete-btn" onclick="deleteAnnouncement(${ann.id})">🗑️ حذف الإعلان</button>` : ''}
            </div>
        `;
    });
}

function addAnnouncement() {
    const title = document.getElementById('ann-title').value;
    const text = document.getElementById('ann-text').value;
    
    if (!title || !text) return alert("يرجى ملء جميع الحقول لكتابة الإعلان.");
    
    const savedAnn = JSON.parse(localStorage.getItem("announcements")) || [];
    const newAnn = {
        id: Date.now(),
        title: title,
        text: text
    };
    
    savedAnn.push(newAnn);
    localStorage.setItem("announcements", JSON.stringify(savedAnn));
    
    document.getElementById('ann-title').value = "";
    document.getElementById('ann-text').value = "";
    
    renderAnnouncements();
    alert("تم نشر الإعلان بنجاح!");
}

function deleteAnnouncement(id) {
    let savedAnn = JSON.parse(localStorage.getItem("announcements")) || [];
    savedAnn = savedAnn.filter(item => item.id !== id);
    localStorage.setItem("announcements", JSON.stringify(savedAnn));
    renderAnnouncements();
}

// 6. إدارة الصفوف والشعب
function renderClasses() {
    const listEl = document.getElementById('classes-list');
    const selectEl = document.getElementById('schedule-class-select');
    if (!listEl) return;
    
    const savedClasses = JSON.parse(localStorage.getItem("classes")) || [
        { id: 1, name: "الأول المتوسط", section: "أ" },
        { id: 2, name: "الأول المتوسط", section: "ب" }
    ];
    
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    
    listEl.innerHTML = "";
    if (selectEl) selectEl.innerHTML = "";
    
    savedClasses.forEach(cls => {
        // عرض القائمة بالصفحة
        listEl.innerHTML += `
            <div class="card" style="border-right-color: #27ae60; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong style="font-size: 1.2em;">${cls.name}</strong> - شعبة (${cls.section})
                </div>
                ${isAdmin ? `<button class="delete-btn" style="margin-top:0;" onclick="deleteClass(${cls.id})">🗑️ حذف</button>` : ''}
            </div>
        `;
        
        // تعبئة قائمة الخيارات لجدول الدروس
        if (selectEl) {
            selectEl.innerHTML += `<option value="${cls.name} - شعبة ${cls.section}">${cls.name} (${cls.section})</option>`;
        }
    });
}

function addClass() {
    const name = document.getElementById('class-name').value;
    const section = document.getElementById('section-name').value;
    
    if (!name || !section) return alert("يرجى كتابة اسم الصف والشعبة.");
    
    const savedClasses = JSON.parse(localStorage.getItem("classes")) || [];
    const newClass = {
        id: Date.now(),
        name: name,
        section: section
    };
    
    savedClasses.push(newClass);
    localStorage.setItem("classes", JSON.stringify(savedClasses));
    
    document.getElementById('class-name').value = "";
    document.getElementById('section-name').value = "";
    
    renderClasses();
    alert("تم حفظ الصف الجديد بنجاح!");
}

function deleteClass(id) {
    let savedClasses = JSON.parse(localStorage.getItem("classes")) || [];
    savedClasses = savedClasses.filter(cls => cls.id !== id);
    localStorage.setItem("classes", JSON.stringify(savedClasses));
    renderClasses();
}

// 7. إدارة جدول الدروس الأسبوعي
function renderSchedule() {
    const listEl = document.getElementById('schedule-list');
    if (!listEl) return;
    
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [
        { id: 1, classInfo: "الأول المتوسط - شعبة أ", day: "الأحد", subject: "اللغة العربية", teacher: "أ. علي سعد", time: "الحصة الأولى (8:00 ص)" }
    ];
    
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    listEl.innerHTML = "";
    
    savedSchedule.forEach(sch => {
        listEl.innerHTML += `
            <div class="card" style="border-right-color: #f1c40f;">
                <h3 style="color: #d35400; margin-top:0;">📅 يوم ${sch.day} - ${sch.classInfo}</h3>
                <p style="margin: 5px 0;"><strong>المادة:</strong> ${sch.subject}</p>
                <p style="margin: 5px 0;"><strong>المدرس:</strong> ${sch.teacher}</p>
                <p style="margin: 5px 0;"><strong>التوقيت:</strong> ${sch.time}</p>
                ${isAdmin ? `<button class="delete-btn" onclick="deleteSchedule(${sch.id})">🗑️ إزالة الحصة</button>` : ''}
            </div>
        `;
    });
}

function addSchedule() {
    const classInfo = document.getElementById('schedule-class-select').value;
    const day = document.getElementById('schedule-day').value;
    const subject = document.getElementById('schedule-subject').value;
    const teacher = document.getElementById('schedule-teacher').value;
    const time = document.getElementById('schedule-time').value;
    
    if (!classInfo || !subject || !teacher || !time) {
        return alert("يرجى ملء جميع حقول تفاصيل الحصة المدرسية.");
    }
    
    const savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    const newSch = {
        id: Date.now(),
        classInfo: classInfo,
        day: day,
        subject: subject,
        teacher: teacher,
        time: time
    };
    
    savedSchedule.push(newSch);
    localStorage.setItem("schedule", JSON.stringify(savedSchedule));
    
    document.getElementById('schedule-subject').value = "";
    document.getElementById('schedule-teacher').value = "";
    document.getElementById('schedule-time').value = "";
    
    renderSchedule();
    alert("تمت إضافة الحصة إلى الجدول بنجاح!");
}

function deleteSchedule(id) {
    let savedSchedule = JSON.parse(localStorage.getItem("schedule")) || [];
    savedSchedule = savedSchedule.filter(item => item.id !== id);
    localStorage.setItem("schedule", JSON.stringify(savedSchedule));
    renderSchedule();
}

// 8. إدارة المكتبة الرقمية
function renderLibrary() {
    const listEl = document.getElementById('library-list');
    if (!listEl) return;
    
    const savedLibrary = JSON.parse(localStorage.getItem("library")) || [
        { id: 1, title: "كتاب الرياضيات - الصف الأول المتوسط", link: "#" }
    ];
    
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    listEl.innerHTML = "";
    
    savedLibrary.forEach(book => {
        listEl.innerHTML += `
            <div class="card" style="border-right-color: #9b59b6; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;">
                <div>
                    <strong style="font-size: 1.1em; color: #8e44ad;">📘 ${book.title}</strong>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <a href="${book.link}" target="_blank" style="text-decoration:none; background:#3498db; color:white; padding: 8px 15px; border-radius:6px; font-weight:bold; font-size:14px;">📥 تحميل الكتاب</a>
                    ${isAdmin ? `<button class="delete-btn" style="margin:0;" onclick="deleteBook(${book.id})">🗑️ حذف</button>` : ''}
                </div>
            </div>
        `;
    });
}

function addBook() {
    const title = document.getElementById('book-title').value;
    const link = document.getElementById('book-link').value;
    
    if (!title || !link) return alert("يرجى إدخال اسم الكتاب ورابط التحميل الخاص به.");
    
    const savedLibrary = JSON.parse(localStorage.getItem("library")) || [];
    const newBook = {
        id: Date.now(),
        title: title,
        link: link
    };
    
    savedLibrary.push(newBook);
    localStorage.setItem("library", JSON.stringify(savedLibrary));
    
    document.getElementById('book-title').value = "";
    document.getElementById('book-link').value = "";
    
    renderLibrary();
    alert("تمت إضافة الكتاب بنجاح للمكتبة الرقمية!");
}

function deleteBook(id) {
    let savedLibrary = JSON.parse(localStorage.getItem("library")) || [];
    savedLibrary = savedLibrary.filter(item => item.id !== id);
    localStorage.setItem("library", JSON.stringify(savedLibrary));
    renderLibrary();
}

// 9. تهيئة واجهة المستخدم وإظهار/إخفاء أقسام تحكم الإدارة
function checkAdminInterface() {
    const isAdmin = (localStorage.getItem("userLevel") === "admin");
    
    // تبديل ظهور كروت إضافة المحتوى الخاصة بالمدير في كل الأقسام
    const adminCards = document.getElementsByClassName('admin-section');
    for (let i = 0; i < adminCards.length; i++) {
        adminCards[i].style.display = isAdmin ? 'block' : 'none';
    }
    
    // تحديث زر تسجيل الدخول
    const btn = document.getElementById("authBtn");
    if (btn) {
        btn.innerText = isAdmin ? "🔓 تسجيل الخروج" : "🔐 تسجيل الدخول";
    }
}

// 10. التشغيل التلقائي بمجرد تحميل المتصفح
window.onload = function() {
    updateDateTime();
    loadHomeData();
    
    // رندر البيانات والواجهات من الذاكرة المحلية
    renderAnnouncements();
    renderClasses();
    renderSchedule();
    renderLibrary();
    
    // تطبيق نظام صلاحيات الإدارة
    checkAdminInterface();
};
