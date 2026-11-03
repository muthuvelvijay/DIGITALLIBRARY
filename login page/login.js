
// Get Login Form
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function(event) {

    // Prevent Page Refresh
    event.preventDefault();

    // Get Entered Values
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const errorMessage = document.getElementById("errorMessage");

    errorMessage.textContent = "";

    // Check Email
    if (email === "") {
        errorMessage.textContent = "Please Enter Email";
        return;
    }

    // Check Password
    if (password === "") {
        errorMessage.textContent = "Please Enter Password";
        return;
    }

    // Get Registered User
    const registeredUser = JSON.parse(
        localStorage.getItem("registeredUser")
    );

    // Check Registration
    if (registeredUser === null) {
        errorMessage.textContent = "Please Register First";
        return;
    }

    // Check Email and Password
    if (
        email === registeredUser.email &&
        password === registeredUser.password
    ) {

        alert("Login Successful!");

        sessionStorage.setItem("libraryAuthenticated", "true");

        window.location.href = "../dashboard page/dashboard.html";

    } else {

        errorMessage.textContent = "Invalid Email or Password";

    }

});

// Reset Error Message
loginForm.addEventListener("reset", function() {
    errorMessage.textContent = "";
});
