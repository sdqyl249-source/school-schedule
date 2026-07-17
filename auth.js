// auth.js
function checkAuth() {
    const userString = localStorage.getItem("currentUser");
    console.log("قيمة المستخدم في التخزين:", userString); // هذا سيظهر في الـ Console
    
    const isLoginPage = window.location.href.includes("login.html");

    if (!userString && !isLoginPage) {
        console.log("لم يتم العثور على مستخدم، سيتم التحويل لصفحة الدخول.");
        window.location.href = "login.html";
    } 
    else if (userString && isLoginPage) {
        console.log("المستخدم مسجل، سيتم تحويله للرئيسية.");
        window.location.href = "index.html";
    }
}

checkAuth();
