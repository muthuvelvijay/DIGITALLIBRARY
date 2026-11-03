(function () {
    const loginPage = "../login page/login.html";

    function logoutUser() {
        sessionStorage.removeItem("libraryAuthenticated");
        window.location.replace(loginPage);
    }

    window.logoutUser = logoutUser;

    document.addEventListener("click", function (event) {
        if (!(event.target instanceof Element)) {
            return;
        }

        const logoutLink = event.target.closest(".logout-link");
        if (logoutLink) {
            event.preventDefault();
            logoutUser();
        }
    });
})();
