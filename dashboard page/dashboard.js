function showPage(pageName) {

    let pageTitle = document.getElementById("pageTitle");
    let pageDescription = document.getElementById("pageDescription");
    let content = document.getElementById("content");
    let dashboardCards = document.getElementById("dashboardCards");

    pageTitle.innerText = pageName;

    if (pageName === "Dashboard") {

        pageDescription.innerText =
            "Welcome to the Digital Library Management System.";

        dashboardCards.style.display = "grid";

        content.innerHTML = `
            <h2>Dashboard Overview</h2>
            <p>Select a module from the navigation menu.</p>
        `;

    }

    else if (pageName === "Books") {

        pageDescription.innerText =
            "Manage all library books.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>Books</h2>
            <p>Books management page will be added here.</p>
        `;

    }

    else if (pageName === "Members") {

        pageDescription.innerText =
            "Manage library members.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>Members</h2>
            <p>Members management page will be added here.</p>
        `;

    }

    else if (pageName === "Issue Book") {

        pageDescription.innerText =
            "Issue books to library members.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>Issue Book</h2>
            <p>Book issuing section will be added here.</p>
        `;

    }

    else if (pageName === "Return Book") {

        pageDescription.innerText =
            "Return issued books.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>Return Book</h2>
            <p>Book return section will be added here.</p>
        `;

    }

    else if (pageName === "Reports") {

        pageDescription.innerText =
            "View library reports.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>Reports</h2>
            <p>Library reports will be displayed here.</p>
        `;

    }

    else if (pageName === "About") {

        pageDescription.innerText =
            "Information about the Digital Library.";

        dashboardCards.style.display = "none";

        content.innerHTML = `
            <h2>About</h2>
            <p>
                Digital Library Management System helps manage
                books, members, issue and return activities.
            </p>
        `;
    }
}


function logout() {

    alert("Logout successful!");

    window.location.href = "login.html";
}