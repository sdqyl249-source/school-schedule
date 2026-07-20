window.currentActiveChatClassId = "";

// دالة أمان: تنتظر جاهزية قاعدة البيانات ثم تنفذ الكود المطلوب
function ensureDatabase(callbackFunction) {
    if (window.database) {
        callbackFunction();
    } else {
        console.warn("جاري الانتظار حتى تصبح قاعدة البيانات جاهزة...");
        setTimeout(function() {
            ensureDatabase(callbackFunction);
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("تم تحميل ملف classes.js بنجاح");
    
    let userString = localStorage.getItem("currentUser");
    if (!userString) return;

    try {
        const userProfile = JSON.parse(userString);
        
        // استخدام دالة الأمان لبدء العمليات
        ensureDatabase(function() {
            loadUserDataFromCloud(userProfile.phone);
            showUserWelcome(userProfile);
            
            const role = userProfile.role ? userProfile.role.trim().toLowerCase() : "";
            if (role === 'student') {
                renderStudentClasses();
            } else if (role === 'teacher') {
                renderTeacherClasses();
            }
        });

    } catch (error) {
        console.error("خطأ في تهيئة الصفحة:", error);
    }
});

function renderTeacherClasses() {
    const container = document.getElementById("classesContainer");
    if (!container) return;

    window.database.ref('classes/').on('value', function(snapshot) {
        container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
        const data = snapshot.val();
        if (data) {
            Object.values(data).forEach(function(cls) {
                const card = document.createElement("div");
                card.className = "class-card";
                card.innerHTML = `<h3>${cls.name}</h3>
                                  <small>الرمز: ${cls.id}</small><br>
                                  <button onclick="window.viewClassLessons('${cls.id}')">عرض</button>
                                  <button onclick="window.deleteClass('${cls.id}')" style="background:#8b0000; color:white;">حذف</button>`;
                container.appendChild(card);
            });
        }
    });
}

function loadUserDataFromCloud(phone) {
    window.database.ref('users/' + phone).on('value', function(snapshot) { 
        if(snapshot.val()) {
            localStorage.setItem("currentUser", JSON.stringify(snapshot.val()));
        }
    });
}

function showUserWelcome(user) {
    const header = document.querySelector('h1') || document.body;
    const infoBox = document.createElement('div');
    infoBox.innerHTML = "<h3>مرحباً بك يا " + user.name + "</h3>";
    header.parentNode.insertBefore(infoBox, header.nextSibling);
}

// تعريف الدوال المساعدة لتفادي أخطاء النقر على الأزرار
window.viewClassLessons = function(id) { alert("عرض دروس الصف: " + id); };
window.deleteClass = function(id) { 
    if(confirm("هل أنت متأكد من حذف الصف؟")) {
        window.database.ref('classes/' + id).remove();
    }
};
