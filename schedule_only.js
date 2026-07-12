// هذا الكود فقط لصفحة الجدول
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID"
    // ... باقي الإعدادات
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

database.ref('lessons_schedule').on('value', (snapshot) => {
    const data = snapshot.val();
    const tableBody = document.getElementById('table-body-id');
    if (tableBody && data) {
        tableBody.innerHTML = '';
        Object.keys(data).forEach(key => {
            const lesson = data[key];
            tableBody.innerHTML += `<tr><td>${lesson.subject}</td><td>${lesson.teacher}</td><td>${lesson.time}</td></tr>`;
        });
    }
});