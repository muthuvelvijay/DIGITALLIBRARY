
// Get data from Local Storage
let books = JSON.parse(localStorage.getItem("books")) || [];
let members = JSON.parse(localStorage.getItem("members")) || [];
let issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];

// Display message
function showMessage(text, type) {
    const message = document.getElementById("message");
    message.textContent = text;
    message.className = type;
}

// Display issued books
function displayReturnBooks() {
    const table = document.getElementById("returnTable");
    table.innerHTML = "";

    if (issuedBooks.length === 0) {
        table.innerHTML =
            '<tr><td colspan="8">No issued books found.</td></tr>';
        return;
    }

    issuedBooks.forEach(function(issue, index) {
        const row = document.createElement("tr");

        const values = [
            issue.issueId || "-",
            issue.memberName || "-",
            issue.bookName || "-",
            issue.quantity || 1,
            issue.issueDate || "-",
            issue.returnDate || "-",
            issue.status || "Issued"
        ];

        values.forEach(function(value) {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const button = document.createElement("button");

        if (issue.status === "Returned") {
            button.textContent = "Returned";
            button.disabled = true;
        } else {
            button.textContent = "Return";

            button.addEventListener("click", function() {
                returnBook(index);
            });
        }

        actionCell.appendChild(button);
        row.appendChild(actionCell);
        table.appendChild(row);
    });
}

// Return a book
function returnBook(index) {
    const issue = issuedBooks[index];

    if (!issue || issue.status === "Returned") {
        showMessage("This book has already been returned.", "error");
        return;
    }

    // Find the matching book
    const book = books.find(function(item) {
        return item.bookId === issue.bookId;
    }) || books.find(function(item) {
        return (item.bookName || item.name) === issue.bookName;
    });

    if (!book) {
        showMessage(
            "Book not found. Please check the book records.",
            "error"
        );
        return;
    }

    // Store old values in case saving fails
    const oldQuantity = Number(book.quantity);
    const oldStatus = issue.status;

    if (!Number.isFinite(oldQuantity)) {
        showMessage("Invalid book quantity.", "error");
        return;
    }

    // Increase quantity and close issue record
    book.quantity = oldQuantity + (Number(issue.quantity) || 1);
    issue.status = "Returned";

    try {
        localStorage.setItem("books", JSON.stringify(books));
        localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
    } catch (error) {
        // Undo changes if Local Storage saving fails
        book.quantity = oldQuantity;
        issue.status = oldStatus;

        showMessage("Unable to save. Please try again.", "error");
        return;
    }

    showMessage(
        issue.bookName + " returned successfully!",
        "success"
    );

    displayReturnBooks();
    displayReports();
}

// Display library reports
function displayReports() {
    let totalAvailable = 0;
    let totalIssued = 0;

    // Count available book copies
    for (let i = 0; i < books.length; i++) {
        const quantity = Number(books[i].quantity);

        if (Number.isFinite(quantity) && quantity > 0) {
            totalAvailable += quantity;
        }
    }

    // Count books currently issued
    for (let i = 0; i < issuedBooks.length; i++) {
        if (issuedBooks[i].status !== "Returned") {
            totalIssued++;
        }
    }

    document.getElementById("totalBooks").textContent =
        books.length;

    document.getElementById("totalMembers").textContent =
        members.length;

    document.getElementById("availableBooks").textContent =
        totalAvailable;

    document.getElementById("issuedCount").textContent =
        totalIssued;
}

// Load page data
displayReturnBooks();
displayReports();