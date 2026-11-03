
// Get Register Form
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {

    // Prevent Page Refresh
    event.preventDefault();

    // Get Entered Values
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Get Error Elements
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmError = document.getElementById("confirmError");

    // Clear Errors
    nameError.textContent = "";
    emailError.textContent = "";
    passwordError.textContent = "";
    confirmError.textContent = "";

    let isValid = true;

    // Username Validation
    if (username === "") {
        nameError.textContent = "Please Enter Username";
        isValid = false;
    }

    // Email Validation
    if (email === "") {
        emailError.textContent = "Please Enter Email";
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailError.textContent = "Please Enter Valid Email";
        isValid = false;
    }

    // Password Validation
    if (password === "") {
        passwordError.textContent = "Please Enter Password";
        isValid = false;
    } else if (password.length < 6) {
        passwordError.textContent = "Password must contain 6 characters";
        isValid = false;
    }

    // Confirm Password Validation
    if (confirmPassword === "") {
        confirmError.textContent = "Please Confirm Password";
        isValid = false;
    } else if (password !== confirmPassword) {
        confirmError.textContent = "Password Does Not Match";
        isValid = false;
    }

    // Stop if Validation Fails
    if (!isValid) {
        return;
    }

    // Store User Details
    const user = {
        username: username,
        email: email,
        password: password
    };

    localStorage.setItem("registeredUser", JSON.stringify(user));

    // Registration Success
    alert("Registration Successful!");

    // Redirect to Login Page
    window.location.href = "../login page/login.html";

});
