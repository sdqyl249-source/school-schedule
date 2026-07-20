window.currentActiveChatClassId = "";

// دالة مركزية للانتظار، تضمن تشغيل الكود فقط عند وجود قاعدة البيانات
function runWhenDatabaseReady(callback) {
    if (typeof window.database !== 'undefined' && window.database !== null) {
        callback(window.database);
    } else {
        console.log("قاعدة البيانات غير جاهزة، في انتظارها...");
        setTimeout(() => runWhenDatabaseReady(callback), 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("تم تحميل ملف classes.js بنجاح");
    
    let userString = localStorage.getItem("currentUser");
    if (!userString) return;

    try {
        const userProfile = JSON.parse(userString);
        showUserWelcome(userProfile);

        // البدء بالعمل فقط عند جاهزية القاعدة
        runWhenDatabaseReady((db) => {
            loadUserDataFromCloud(userProfile.phone);
            
            const role = userProfile.role ? userProfile.role.trim().toLowerCase() : "";
            if (role === 'student') {
                if (typeof renderStudentClasses === 'function') renderStudentClasses();
            } else if (role === 'teacher') {
                renderTeacherClasses();
            }
        });

    } catch (e) {
        console.error("خطأ في تحليل بيانات المستخدم:", e);
    }

    // ربط أزرار الدردشة
    const sendBtn = document.getElementById("send-btn");
    const input = document.getElementById("message-input");
    if (sendBtn && input) {
        sendBtn.onclick = () => {
            if (window.currentActiveChatClassId && typeof window.sendMessage === 'function') {
                window.sendMessage(window.currentActiveChatClassId);
            }
        };
        input.addEventListener("keypress", (e) => { 
            if (e.key === "Enter") sendBtn.click(); 
        });
    }

    // ربط زر حفظ الصف مباشرة هنا لمنع أي تضارب
    const saveBtn = document.getElementById("saveClassBtn");
    if (saveBtn) {
        saveBtn.onclick = function() {
            const name = document.getElementById("className")?.value;
            const section = document.getElementById("classSection")?.value;
            
            runWhenDatabaseReady((db) => {
                if (!name || !section) {
                    alert("يرجى إدخال كافة البيانات");
                    return;
                }
                const id = Math.floor(1000 + Math.random() * 9000).toString();
                db.ref('classes/' + id).set({ 
                    id: id, 
                    name: name, 
                    section: section, 
                    lessons: [{ title: "مقدمة" }] 
                })
                .then(() => {
                    alert("تم حفظ الصف بنجاح!");
                })
                .catch((err) => {
                    alert("حدث خطأ أثناء الحفظ: " + err.message);
                });
            });
        };
    }
});

function renderTeacherClasses() {
    runWhenDatabaseReady((db) => {
        const container = document.getElementById("classesContainer");
        if (!container) return;

        db.ref('classes/').on('value', (snapshot) => {
            container.innerHTML = "<h2>صفوفي كأستاذ:</h2>";
            const data = snapshot.val();
            if (data) {
                Object.values(data).forEach(cls => {
                    const card = document.createElement("div");
                    card.className = "class-card";
                    card.innerHTML = `<h3>${cls.name} - شعبة ${cls.section}</h3><small>الرمز: ${cls.id}</small><br>
                                      <button onclick="window.viewClassLessons('${cls.id}')">عرض</button>
                                      <button onclick="window.deleteClass('${cls.id}')" style="background:#8b0000; color:white;">حذف</button>`;
                    container.appendChild(card);
                });
            }
        });
    });
}

function loadUserDataFromCloud(phone) {
    runWhenDatabaseReady((db) => {
        db.ref('users/' + phone).on('value', (s) => { 
            if(s.val()) localStorage.setItem("currentUser", JSON.stringify(s.val())); 
        });
    });
}

function showUserWelcome(user) {
    const header = document.querySelector('h2') || document.querySelector('h1') || document.body;
    if (!header) return;
    const infoBox = document.createElement('div');
    infoBox.innerHTML = `<h3>مرحباً بك يا ${user.name}</h3>`;
    header.parentNode.insertBefore(infoBox, header.nextSibling);
}

// تعريف الدوال المساعدة عالمياً
window.viewClassLessons = (id) => {
    alert("عرض دروس الصف: " + id);
};

window.deleteClass = (id) => { 
    runWhenDatabaseReady((db) => {
        if(confirm("هل أنت متأكد من حذف هذا الصف؟")) {
            db.ref('classes/' + id).remove()
              .then(() => alert("تم الحذف بنجاح"))
              .catch((err) => alert("خطأ في الحذف: " + err.message));
        }
    });
};
