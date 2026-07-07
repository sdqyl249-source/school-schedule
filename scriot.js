// 1. إعدادات الاتصال المباشر بقاعدة البيانات السحابية
const firebaseConfig = {
    databaseURL: "https://roya-platform-26860-default-rtdb.firebaseio.com/" 
};

// تهيئة Firebase بأمان
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// متغير عالمي لحفظ حالة صلاحيات العضو (Admin)
let isCurrentMemberAdmin = false;

// تحويل الواجهة لنمط لوحة التحكم للعضو المصرح له
function setUIAzAdmin() {
    const loginNavBtn = document.getElementById('login-nav-btn');
    if (loginNavBtn) {
        loginNavBtn.innerHTML = `👋 أهلاً بك (لوحة التحكم)`;
        loginNavBtn.style.backgroundColor = '#ffe4c4';
        loginNavBtn.style.color = '#4a3b32';
    }
    const loginMenuForm = document.getElementById('login-menu-form');
    if (loginMenuForm) {
        loginMenuForm.style.display = 'none';
    }
}

// 2. فحص الجلسة المحفوظة تلقائياً عند فتح الصفحة
function checkSavedSession() {
    const sessionToken = localStorage.getItem('roya_session_active');
    if (sessionToken === "true") {
        isCurrentMemberAdmin = true;
        setUIAzAdmin();
    }
    // جلب البيانات فوراً من السحاب وعرضها للزوار والأعضاء
    loadBooksFromFirebase();
    loadNotificationsFromFirebase();
}

// 3. نظام الأكواد المطور والمضمون لحماية تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    // تشغيل الفحص فور جاهزية عناصر الصفحة
    checkSavedSession();

    const loginForm = document.getElementById('firebase-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const phoneInput = document.getElementById('login-phone').value.trim();
            const codeInput = document.getElementById('login-code').value.trim();

            if (!phoneInput || !codeInput) {
                alert('الرجاء إدخال رقم الهاتف والكود السري.');
                return;
            }

            // الفحص المباشر من جدول الأعضاء (members)
            database.ref('members/' + phoneInput).once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    
                    // تحويل القيمتين لنصوص (String) لضمان المطابقة الكاملة ومعالجة نوع البيانات
                    if (String(userData.code) === String(codeInput)) {
                        alert('مرحباً بك! تم التحقق من الكود بنجاح وتفعيل صلاحيات التحكم.');
                        localStorage.setItem('roya_session_active', 'true');
                        isCurrentMemberAdmin = true;
                        setUIAzAdmin();
                        // تحديث القوائم لإظهار أزرار الإضافة والحذف فوراً
                        loadBooksFromFirebase();
                        loadNotificationsFromFirebase();
                    } else {
                        alert('عذراً! الكود السري غير صحيح.');
                    }
                } else {
                    alert('عذراً! رقم الهاتف هذا غير مسجل في نظام المنصة.');
                }
            }).catch((error) => {
                alert('خطأ في الاتصال بالخادم: ' + error.message);
                console.error("خطأ في الاتصال بالخادم السحابي:", error);
            });
        });
    }
});

// 4. جلب وعرض الكتب ديناميكياً من السحاب
function loadBooksFromFirebase() {
    database.ref('classes_books').on('value', (snapshot) => {
        const menu = document.getElementById('books-dropdown-menu');
        if (!menu) return;
        menu.innerHTML = ''; // تنظيف القائمة قبل العرض
        
        const classes = ["الصف الاول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"];
        const data = snapshot.val() || {};

        classes.forEach((className) => {
            const subDropLi = document.createElement('li');
            subDropLi.className = 'sub-dropdown';
            subDropLi.innerHTML = `<a href="#">${className} &raquo;</a>`;
            
            const submenuUl = document.createElement('ul');
            submenuUl.className = 'submenu';

            // عرض الملفات المتوفرة داخل الصف
            if (data[className]) {
                Object.keys(data[className]).forEach((bookId) => {
                    const book = data[className][bookId];
                    const bookLi = document.createElement('li');
                    
                    // إظهار زر الحذف للأدمن فقط
                    const deleteBtn = isCurrentMemberAdmin ? `<span onclick="deleteBook('${className}', '${bookId}')" style="color:red; cursor:pointer; font-weight:bold; margin-right:8px;">[❌]</span>` : '';
                    
                    bookLi.innerHTML = `<a href="${book.url}" download>${book.name}</a> ${deleteBtn}`;
                    submenuUl.appendChild(bookLi);
                });
            }

            // إظهار زر إضافة ملف للأدمن فقط
            if (isCurrentMemberAdmin) {
                const addLi = document.createElement('li');
                addLi.innerHTML = `<a href="#" onclick="addBookPrompt('${className}')" style="color: green; font-weight: bold;">+ إضافة ملف جديد</a>`;
                submenuUl.appendChild(addLi);
            }

            subDropLi.appendChild(submenuUl);
            menu.appendChild(subDropLi);
        });
    }, (error) => {
        console.error("خطأ أثناء جلب الكتب:", error);
    });
}

// دالة إضافة كتاب جديد
function addBookPrompt(className) {
    const bookName = prompt(`إضافة ملف جديد لـ (${className}). أدخل اسم المادة/الكتاب:`);
    if (!bookName) return;
    const fileUrl = prompt('أدخل اسم ملف الـ PDF كاملاً مع الامتداد (مثال: math.pdf):');
    if (!fileUrl) return;

    const fullPath = "رؤية/الكتب والملفات/" + fileUrl;
    
    database.ref('classes_books/' + className).push({
        name: bookName,
        url: fullPath
    }).then(() => {
        alert('تم إضافة الملف بنجاح إلى السحاب!');
    }).catch((err) => {
        alert('فشلت الإضافة: ' + err.message);
    });
}

// دالة حذف كتاب
function deleteBook(className, bookId) {
    if (confirm('هل أنت متأكد من رغبتك في حذف هذا الملف نهائياً من المنصة؟')) {
        database.ref('classes_books/' + className + '/' + bookId).remove();
    }
}

// 5. جلب وعرض التبليغات ديناميكياً
function loadNotificationsFromFirebase() {
    database.ref('notifications').on('value', (snapshot) => {
        const menu = document.getElementById('notifications-dropdown-menu');
        if (!menu) return;
        menu.innerHTML = '';
        
        const subDropLi = document.createElement('li');
        subDropLi.className = 'sub-dropdown';
        subDropLi.innerHTML = `<a href="#">الصف الخامس &raquo;</a>`;
        
        const submenuUl = document.createElement('ul');
        submenuUl.className = 'submenu';

        const data = snapshot.val() || {};
        Object.keys(data).forEach((notifId) => {
            const notif = data[notifId];
            const notifLi = document.createElement('li');
            
            // زر الحذف للأدمن فقط
            const deleteBtn = isCurrentMemberAdmin ? `<span onclick="deleteNotification('${notifId}')" style="color:red; cursor:pointer; font-weight:bold; margin-right:8px;">[❌]</span>` : '';
            
            notifLi.innerHTML = `<a href="#">${notif.text}</a> ${deleteBtn}`;
            submenuUl.appendChild(notifLi);
        });

        // زر نشر تبليغ للأدمن فقط
        if (isCurrentMemberAdmin) {
            const addNotifLi = document.createElement('li');
            addNotifLi.innerHTML = `<a href="#" onclick="addNotificationPrompt()" style="color: green; font-weight: bold;">+ نشر تبليغ جديد</a>`;
            submenuUl.appendChild(addNotifLi);
        }

        subDropLi.appendChild(submenuUl);
        menu.appendChild(subDropLi);
    }, (error) => {
        console.error("خطأ أثناء جلب التبليغات:", error);
    });
}

// دالة نشر تبليغ جديد
function addNotificationPrompt() {
    const notifText = prompt('اكتب نص التبليغ أو الإشعار الجديد (مثال: شعبة أ: امتحان الاثنين القادم):');
    if (notifText && notifText.trim() !== "") {
        database.ref('notifications').push({
            text: notifText.trim()
        }).then(() => {
            alert('تم نشر التبليغ بنجاح!');
        }).catch((err) => {
            alert('فشل النشر: ' + err.message);
        });
    }
}

// دالة حذف تبليغ
function deleteNotification(notifId) {
    if (confirm('هل تريد حذف هذا التبليغ؟')) {
        database.ref('notifications/' + notifId).remove();
    }
}