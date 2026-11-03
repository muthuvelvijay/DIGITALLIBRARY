
// =====================================
// ISSUE BOOK MANAGEMENT
// =====================================

// Get Books from LocalStorage
let books = [];

try {
    books = JSON.parse(localStorage.getItem("books")) || [];
} catch (error) {
    books = [];
}


// Get Members from LocalStorage
let members = [];

try {
    members = JSON.parse(localStorage.getItem("members")) || [];
} catch (error) {
    members = [];
}


// Get Issued Books from LocalStorage
let issuedBooks = [];

try {
    issuedBooks = JSON.parse(localStorage.getItem("issuedBooks")) || [];
} catch (error) {
    issuedBooks = [];
}


// Selected Issue IDs
let selectedIds = new Set();


// HTML Elements
const issueForm = document.getElementById("issueForm");
const memberSelect = document.getElementById("memberName");
const bookSelect = document.getElementById("bookName");
const bookQuantity = document.getElementById("bookQuantity");
const issueDate = document.getElementById("issueDate");
const returnDate = document.getElementById("returnDate");
const message = document.getElementById("message");
const issuedBooksTable = document.getElementById("issuedBooksTable");


// =====================================
// SAVE DATA
// =====================================

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books));
}

function saveIssuedBooks() {
    localStorage.setItem("issuedBooks", JSON.stringify(issuedBooks));
}


// =====================================
// LOAD MEMBERS
// =====================================

function loadMembers() {

    memberSelect.innerHTML =
        '<option value="">Select Member</option>';

    members.forEach(member => {

        const option = document.createElement("option");

        option.value = member.memberId;
        option.textContent = member.memberName;

        memberSelect.appendChild(option);

    });

}


// =====================================
// LOAD BOOKS
// =====================================

function loadBooks() {

    bookSelect.innerHTML =
        '<option value="">Select Book</option>';

    books.forEach(book => {

        const quantity = Number(book.quantity);

        if (quantity > 0) {

            const option = document.createElement("option");

            option.value = book.bookId;
            option.textContent = book.bookName +
                " (Available: " + quantity + ")";

            bookSelect.appendChild(option);

        }

    });

    updateQuantityLimit();
}

function updateQuantityLimit() {
    const selectedBook = books.find(book =>
        book.bookId === bookSelect.value
    );
    const availableQuantity = selectedBook
        ? Number(selectedBook.quantity)
        : 0;

    bookQuantity.max = availableQuantity > 0
        ? availableQuantity
        : "";

    if (availableQuantity > 0 && Number(bookQuantity.value) > availableQuantity) {
        bookQuantity.value = availableQuantity;
    }

}


// =====================================
// DISPLAY ISSUED BOOKS
// =====================================

function displayIssuedBooks() {

    issuedBooksTable.innerHTML = "";

    if (issuedBooks.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.className = "empty-row";
        cell.textContent = "No books issued yet.";

        row.appendChild(cell);
        issuedBooksTable.appendChild(row);

    } else {

        issuedBooks.forEach(book => {

            const row = document.createElement("tr");

            // Checkbox
            const checkboxCell = document.createElement("td");

            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "issue-checkbox";
            checkbox.value = book.issueId;
            checkbox.checked = selectedIds.has(book.issueId);

            checkbox.addEventListener("change", function() {

                if (this.checked) {
                    selectedIds.add(book.issueId);
                } else {
                    selectedIds.delete(book.issueId);
                }

                updateSelectedCount();

            });

            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);


            // Issue Details
            const fields = [
                book.issueId,
                book.memberName,
                book.bookName,
                book.quantity || 1,
                book.issueDate,
                book.returnDate
            ];

            fields.forEach(value => {

                const cell = document.createElement("td");

                cell.textContent = value || "-";

                row.appendChild(cell);

            });


            // Status
            const statusCell = document.createElement("td");

            const status = document.createElement("span");

            status.className =
                book.status === "Returned"
                    ? "status returned"
                    : "status issued";

            status.textContent = book.status || "Issued";

            statusCell.appendChild(status);

            row.appendChild(statusCell);


            // Single Delete Button
            const actionCell = document.createElement("td");

            const deleteButton = document.createElement("button");

            deleteButton.textContent = "🗑 Delete";

            deleteButton.className = "single-delete-btn";

            deleteButton.addEventListener("click", function() {

                deleteSingleIssue(book.issueId);

            });

            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            issuedBooksTable.appendChild(row);

        });

    }

    updateSelectedCount();

}


// =====================================
// UPDATE SELECTED COUNT
// =====================================

function updateSelectedCount() {

    document.getElementById("selectedCount").textContent =
        selectedIds.size + " Books Selected";

    const checkboxes =
        document.querySelectorAll(".issue-checkbox");

    const selectAllCheckbox =
        document.getElementById("selectAllCheckbox");

    const allCheckboxes = Array.from(checkboxes);

    selectAllCheckbox.checked =
        allCheckboxes.length > 0 &&
        allCheckboxes.every(item => item.checked);

    selectAllCheckbox.indeterminate =
        allCheckboxes.some(item => item.checked) &&
        !selectAllCheckbox.checked;

}


// =====================================
// SELECT ALL / UNSELECT ALL
// =====================================

function selectAllBooks() {

    const checkboxes =
        document.querySelectorAll(".issue-checkbox");

    const allSelected =
        checkboxes.length > 0 &&
        Array.from(checkboxes).every(item => item.checked);

    checkboxes.forEach(item => {

        item.checked = !allSelected;

        if (item.checked) {
            selectedIds.add(item.value);
        } else {
            selectedIds.delete(item.value);
        }

    });

    updateSelectedCount();

}


// Header Checkbox
function toggleSelectAll(checkbox) {

    const checkboxes =
        document.querySelectorAll(".issue-checkbox");

    checkboxes.forEach(item => {

        item.checked = checkbox.checked;

        if (item.checked) {
            selectedIds.add(item.value);
        } else {
            selectedIds.delete(item.value);
        }

    });

    updateSelectedCount();

}


// =====================================
// RESTORE BOOK QUANTITY
// =====================================

function restoreBookQuantity(issue) {

    // Returned books should not be restored twice.
    if (issue.status === "Returned") {
        return;
    }

    const book = books.find(item =>
        item.bookId === issue.bookId
    );

    if (book) {

        book.quantity =
            Number(book.quantity || 0) + (Number(issue.quantity) || 1);

    }

}


// =====================================
// DELETE SELECTED ISSUES
// =====================================

function deleteSelectedBooks() {

    if (selectedIds.size === 0) {

        alert("Please select at least one issued book!");

        return;

    }

    const confirmDelete = confirm(
        "Are you sure you want to delete " +
        selectedIds.size + " selected issue records?"
    );

    if (confirmDelete) {

        const selectedIssues = issuedBooks.filter(book =>
            selectedIds.has(book.issueId)
        );

        // Restore quantity for active issues
        selectedIssues.forEach(issue => {
            restoreBookQuantity(issue);
        });

        // Remove selected records
        issuedBooks = issuedBooks.filter(book =>
            !selectedIds.has(book.issueId)
        );

        selectedIds.clear();

        saveBooks();
        saveIssuedBooks();

        loadBooks();
        displayIssuedBooks();

        alert("Selected issue records deleted successfully!");

    }

}


// =====================================
// DELETE SINGLE ISSUE
// =====================================

function deleteSingleIssue(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this issue record?"
    );

    if (confirmDelete) {

        const issue = issuedBooks.find(item =>
            item.issueId === id
        );

        if (issue) {

            restoreBookQuantity(issue);

            issuedBooks = issuedBooks.filter(item =>
                item.issueId !== id
            );

            selectedIds.delete(id);

            saveBooks();
            saveIssuedBooks();

            loadBooks();
            displayIssuedBooks();

            alert("Issue record deleted successfully!");

        }

    }

}


// =====================================
// ISSUE BOOK
// =====================================

issueForm.addEventListener("submit", function(event) {

    event.preventDefault();

    message.textContent = "";
    message.style.color = "red";

    const selectedMember = members.find(member =>
        member.memberId === memberSelect.value
    );

    const selectedBook = books.find(book =>
        book.bookId === bookSelect.value
    );

    const issueDateValue = issueDate.value;
    const returnDateValue = returnDate.value;


    // Validate Member
    if (!selectedMember) {

        message.textContent = "Please select a valid member!";
        return;

    }


    // Validate Book
    if (!selectedBook) {

        message.textContent = "Please select a valid book!";
        return;

    }


    // Validate Quantity
    if (Number(selectedBook.quantity) <= 0) {

        message.textContent = "Book is not available!";
        return;

    }

    const requestedQuantity = Number(bookQuantity.value);

    if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
        message.textContent = "Enter a whole number of at least 1.";
        return;
    }

    if (requestedQuantity > Number(selectedBook.quantity)) {
        message.textContent =
            "Only " + selectedBook.quantity + " copies are available.";
        return;
    }


    // Validate Dates
    if (returnDateValue <= issueDateValue) {

        message.textContent =
            "Return date must be after issue date!";

        return;

    }


    // Create Issue Record
    const newIssue = {

        issueId: "ISS" + Date.now(),

        memberId: selectedMember.memberId,

        memberName: selectedMember.memberName,

        bookId: selectedBook.bookId,

        bookName: selectedBook.bookName,

        quantity: requestedQuantity,

        issueDate: issueDateValue,

        returnDate: returnDateValue,

        status: "Issued"

    };


    // Decrease Available Quantity
    selectedBook.quantity =
        Number(selectedBook.quantity) - requestedQuantity;


    // Save Issue
    issuedBooks.push(newIssue);

    saveBooks();
    saveIssuedBooks();

    selectedIds.clear();

    // Update Display
    loadBooks();
    displayIssuedBooks();

    // Success Message
    message.style.color = "green";

    message.textContent =
        "Book issued successfully!";

    // Clear Form
    issueForm.reset();

    setTimeout(() => {
        message.textContent = "";
    }, 3000);

});


// =====================================
// RESET FORM
// =====================================

issueForm.addEventListener("reset", function() {

    message.textContent = "";

});


// =====================================
// INITIAL LOAD
// =====================================

loadMembers();

loadBooks();

displayIssuedBooks();

bookSelect.addEventListener("change", updateQuantityLimit);
