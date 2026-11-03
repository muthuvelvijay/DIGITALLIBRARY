
// 1. Local Storage
let books = [];

try {
    let savedBooks = JSON.parse(localStorage.getItem("books") || "[]");
    books = Array.isArray(savedBooks) ? savedBooks : [];
} catch (error) {
    books = [];
}

let editIndex = -1;


// 2. Book details safe display 
function safeText(value) {
    let text = String(value ?? "");

    return text.replace(/[&<>"']/g, function (char) {
        let symbols = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return symbols[char];
    });
}


// 3. Books table-la display pannum
function displayBooks(list = books) {
    let table = document.getElementById("bookTableBody");

    table.innerHTML = "";

    if (list.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="9" class="empty-message">
                    No books found!
                </td>
            </tr>
        `;

        updateSelectedCount();
        return;
    }

    list.forEach(function (book) {
        let index = books.indexOf(book);

        table.innerHTML += `
            <tr>
                <td>
                    <input
                        type="checkbox"
                        class="book-checkbox"
                        value="${index}"
                        onchange="updateSelectedCount()"
                    >
                </td>

                <td>${safeText(book.bookId)}</td>
                <td>${safeText(book.bookName)}</td>
                <td>${safeText(book.author)}</td>
                <td>${safeText(book.category)}</td>
                <td>${safeText(book.publisher)}</td>
                <td>${safeText(book.year)}</td>
                <td>${safeText(book.quantity)}</td>

                <td>
                    <button class="edit-btn"
                        onclick="editBook(${index})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteBook(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    updateSelectedCount();
}


// 4. Add Book popup open pannum
function showAddBook() {
    editIndex = -1;

    document.getElementById("bookForm").reset();

    document.getElementById("formTitle").innerText =
        "Add New Book";

    document.getElementById("saveBtn").innerText =
        "Save Book";

    document.getElementById("bookPopup").style.display =
        "flex";
}


// 5. Popup close pannum
function closePopup() {
    document.getElementById("bookPopup").style.display =
        "none";

    document.getElementById("bookForm").reset();

    editIndex = -1;
}


// 6. Add and Update Book
function addBook(event) {
    event.preventDefault();

    let book = {
        bookId: document.getElementById("bookId").value.trim(),
        bookName: document.getElementById("bookName").value.trim(),
        author: document.getElementById("author").value.trim(),
        category: document.getElementById("category").value.trim(),
        publisher: document.getElementById("publisher").value.trim(),
        year: document.getElementById("year").value,
        quantity: document.getElementById("quantity").value
    };

    // Duplicate ID check
    let duplicate = books.some(function (item, index) {
        return (
            String(item.bookId).toLowerCase() ===
            book.bookId.toLowerCase() &&
            index !== editIndex
        );
    });

    if (duplicate) {
        alert("This Book ID already exists!");
        return;
    }

    // Year validation
    let currentYear = new Date().getFullYear();

    if (
        Number(book.year) < 1 ||
        Number(book.year) > currentYear
    ) {
        alert("Enter a valid publication year!");
        return;
    }

    // Quantity validation
    if (
        !Number.isInteger(Number(book.quantity)) ||
        Number(book.quantity) < 1
    ) {
        alert("Quantity must be at least 1!");
        return;
    }

    // New book add pannum
    if (editIndex === -1) {
        books.push(book);
        alert("Book Added Successfully!");
    } else {
        // Existing book update pannum
        books[editIndex] = book;
        alert("Book Updated Successfully!");
    }

    localStorage.setItem("books", JSON.stringify(books));

    closePopup();
    clearSearch();
}


// 7. Edit Book popup
function editBook(index) {
    let book = books[index];

    if (!book) {
        return;
    }

    editIndex = index;

    document.getElementById("bookId").value = book.bookId;
    document.getElementById("bookName").value = book.bookName;
    document.getElementById("author").value = book.author;
    document.getElementById("category").value = book.category;
    document.getElementById("publisher").value = book.publisher;
    document.getElementById("year").value = book.year;
    document.getElementById("quantity").value = book.quantity;

    document.getElementById("formTitle").innerText =
        "Edit Book Details";

    document.getElementById("saveBtn").innerText =
        "Update Book";

    document.getElementById("bookPopup").style.display =
        "flex";
}


// 8. Oru book delete pannum
function deleteBook(index) {
    if (!confirm("Do you want to delete this book?")) {
        return;
    }

    books.splice(index, 1);

    localStorage.setItem("books", JSON.stringify(books));

    clearSearch();

    alert("Book Deleted Successfully!");
}


// 9. Select All / Unselect All
function selectAllBooks(checked) {
    document.querySelectorAll(".book-checkbox").forEach(
        function (box) {
            box.checked = checked;
        }
    );

    updateSelectedCount();
}


// 10. Selected count update pannum
function updateSelectedCount() {
    let checkboxes = document.querySelectorAll(".book-checkbox");
    let checkedBoxes = document.querySelectorAll(
        ".book-checkbox:checked"
    );

    document.getElementById("selectedCount").innerText =
        checkedBoxes.length + " books selected";

    let selectAll = document.getElementById("selectAll");

    selectAll.checked =
        checkboxes.length > 0 &&
        checkedBoxes.length === checkboxes.length;

    selectAll.indeterminate =
        checkedBoxes.length > 0 &&
        checkedBoxes.length < checkboxes.length;
}


// 11. Selected books mattum delete pannum
function deleteSelectedBooks() {
    let selected = document.querySelectorAll(
        ".book-checkbox:checked"
    );

    if (selected.length === 0) {
        alert("Please select at least one book!");
        return;
    }

    if (!confirm("Delete the selected books?")) {
        return;
    }

    let indexes = [];

    selected.forEach(function (box) {
        indexes.push(Number(box.value));
    });

    // Periya index-la irundhu delete pannum
    indexes.sort(function (a, b) {
        return b - a;
    });

    indexes.forEach(function (index) {
        books.splice(index, 1);
    });

    localStorage.setItem("books", JSON.stringify(books));

    clearSearch();

    alert("Selected books deleted successfully!");
}


// 12. Ella books-um delete pannum
function deleteAllBooks() {
    if (books.length === 0) {
        alert("No books to delete!");
        return;
    }

    if (!confirm("Do you want to delete ALL books?")) {
        return;
    }

    books = [];

    localStorage.setItem("books", JSON.stringify(books));

    clearSearch();

    alert("All books deleted successfully!");
}


// 13. Search books
function searchBooks() {
    let search = document.getElementById("searchBook")
        .value.toLowerCase().trim();

    let result = books.filter(function (book) {
        return (
            String(book.bookId).toLowerCase().includes(search) ||
            String(book.bookName).toLowerCase().includes(search) ||
            String(book.author).toLowerCase().includes(search) ||
            String(book.category).toLowerCase().includes(search) ||
            String(book.publisher).toLowerCase().includes(search)
        );
    });

    displayBooks(result);
}


// 14. Search clear pannum
function clearSearch() {
    document.getElementById("searchBook").value = "";

    document.getElementById("selectAll").checked = false;
    document.getElementById("selectAll").indeterminate = false;

    displayBooks();
}


// 15. Page open aagumbodhu display pannum
displayBooks();
