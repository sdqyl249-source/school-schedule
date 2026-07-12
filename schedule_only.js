// تأكد من تهيئة Firebase مرة واحدة فقط في بداية الملف
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

// دالة عرض الجدول الموحدة
database.ref('school_data/lessons').on('value', (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.getElementById('table-body-id');
    
    if (tableBody) {
        tableBody.innerHTML = ''; // تنظيف الجدول
        
        if (data && Array.isArray(data)) {
            data.forEach((row) => {
                // نستخدم الترتيب الذي اكتشفناه (0, 1, 2)
                tableBody.innerHTML += `
                    <tr>
                        <td>${row[0] || ''}</td>
                        <td>${row[1] || ''}</td>
                        <td>${row[2] || ''}</td>
                    </tr>`;
            });
        }
    }
});
