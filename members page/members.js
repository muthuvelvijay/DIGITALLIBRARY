
// =====================================
// MEMBER MANAGEMENT JAVASCRIPT
// =====================================

// Get members from LocalStorage
let members = [];

try {
    members = JSON.parse(localStorage.getItem("members")) || [];
} catch (error) {
    members = [];
}

// Selected member IDs
let selectedIds = new Set();

// Edit member ID
let editMemberId = null;

// HTML Elements
const memberTableBody = document.getElementById("memberTableBody");
const memberList = document.getElementById("memberList");
const addMemberForm = document.getElementById("addMemberForm");
const memberForm = document.getElementById("memberForm");
const searchInput = document.getElementById("searchMember");
const message = document.getElementById("message");


// =====================================
// SAVE MEMBERS TO LOCAL STORAGE
// =====================================

function saveMembers() {
    localStorage.setItem("members", JSON.stringify(members));
}


// =====================================
// DISPLAY MEMBERS
// =====================================

function displayMembers(list = members) {

    memberTableBody.innerHTML = "";

    if (list.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 9;
        cell.className = "empty-row";
        cell.textContent = "No members found!";

        row.appendChild(cell);
        memberTableBody.appendChild(row);

    } else {

        list.forEach(member => {

            const row = document.createElement("tr");

            // Checkbox
            const checkboxCell = document.createElement("td");
            const checkbox = document.createElement("input");

            checkbox.type = "checkbox";
            checkbox.className = "member-checkbox";
            checkbox.value = member.memberId;
            checkbox.checked = selectedIds.has(member.memberId);

            checkbox.addEventListener("change", function () {

                if (this.checked) {
                    selectedIds.add(member.memberId);
                } else {
                    selectedIds.delete(member.memberId);
                }

                updateSelectedCount();

            });

            checkboxCell.appendChild(checkbox);
            row.appendChild(checkboxCell);

            // Member Details
            const fields = [
                member.memberId,
                member.memberName,
                member.email,
                member.phone,
                member.address,
                member.membershipType,
                member.joinDate
            ];

            fields.forEach(value => {

                const cell = document.createElement("td");
                cell.textContent = value || "-";
                row.appendChild(cell);

            });

            // Action Buttons
            const actionCell = document.createElement("td");

            const editButton = document.createElement("button");
            editButton.textContent = "✏ Edit";
            editButton.className = "edit-btn";

            editButton.addEventListener("click", function () {
                editMember(member.memberId);
            });

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "🗑 Delete";
            deleteButton.className = "delete-btn";

            deleteButton.addEventListener("click", function () {
                deleteMember(member.memberId);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);

            row.appendChild(actionCell);

            memberTableBody.appendChild(row);

        });

    }

    updateSelectedCount();

}


// =====================================
// UPDATE SELECTED COUNT
// =====================================

function updateSelectedCount() {

    document.getElementById("selectedCount").textContent =
        selectedIds.size + " Members Selected";

    const checkboxes = document.querySelectorAll(".member-checkbox");
    const selectAllCheckbox = document.getElementById("selectAllCheckbox");

    const visibleCheckboxes = Array.from(checkboxes);

    selectAllCheckbox.checked =
        visibleCheckboxes.length > 0 &&
        visibleCheckboxes.every(checkbox => checkbox.checked);

    selectAllCheckbox.indeterminate =
        visibleCheckboxes.some(checkbox => checkbox.checked) &&
        !selectAllCheckbox.checked;

}


// =====================================
// SELECT ALL / UNSELECT ALL
// =====================================

function selectAllMembers() {

    const checkboxes = document.querySelectorAll(".member-checkbox");

    const allSelected =
        checkboxes.length > 0 &&
        Array.from(checkboxes).every(checkbox => checkbox.checked);

    checkboxes.forEach(checkbox => {

        checkbox.checked = !allSelected;

        if (checkbox.checked) {
            selectedIds.add(checkbox.value);
        } else {
            selectedIds.delete(checkbox.value);
        }

    });

    updateSelectedCount();

}


// Header Checkbox
function toggleSelectAll(checkbox) {

    const checkboxes = document.querySelectorAll(".member-checkbox");

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
// DELETE SELECTED MEMBERS
// =====================================

function deleteSelectedMembers() {

    if (selectedIds.size === 0) {
        alert("Please select at least one member!");
        return;
    }

    const confirmDelete = confirm(
        "Are you sure you want to delete " +
        selectedIds.size + " selected members?"
    );

    if (confirmDelete) {

        members = members.filter(member =>
            !selectedIds.has(member.memberId)
        );

        selectedIds.clear();

        saveMembers();

        displayMembers();

        alert("Selected members deleted successfully!");

    }

}


// =====================================
// DELETE SINGLE MEMBER
// =====================================

function deleteMember(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this member?"
    );

    if (confirmDelete) {

        members = members.filter(member =>
            member.memberId !== id
        );

        selectedIds.delete(id);

        saveMembers();

        displayMembers();

        alert("Member deleted successfully!");

    }

}


// =====================================
// SHOW ADD MEMBER FORM
// =====================================

function showAddMember() {

    memberList.style.display = "none";
    document.querySelector(".search-section").style.display = "none";

    addMemberForm.style.display = "block";

    memberForm.reset();

    editMemberId = null;

    document.getElementById("memberId").disabled = false;

    document.getElementById("formTitle").textContent =
        "👤 Add New Member";

    message.textContent = "";

}


// =====================================
// SHOW MEMBER LIST
// =====================================

function showMemberList() {

    memberList.style.display = "block";
    document.querySelector(".search-section").style.display = "block";

    addMemberForm.style.display = "none";

    memberForm.reset();

    editMemberId = null;

    document.getElementById("memberId").disabled = false;

    message.textContent = "";

    displayMembers();

}


// =====================================
// ADD / UPDATE MEMBER
// =====================================

memberForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const member = {

        memberId: document.getElementById("memberId").value.trim(),

        memberName: document.getElementById("memberName").value.trim(),

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        address: document.getElementById("address").value.trim(),

        membershipType: document.getElementById("membershipType").value,

        joinDate: document.getElementById("joinDate").value

    };


    // Check empty fields
    if (
        !member.memberId ||
        !member.memberName ||
        !member.email ||
        !member.phone ||
        !member.address ||
        !member.membershipType ||
        !member.joinDate
    ) {

        message.style.color = "red";
        message.textContent = "Please fill all fields!";
        return;

    }


    // Edit Member
    if (editMemberId !== null) {

        const index = members.findIndex(
            item => item.memberId === editMemberId
        );

        if (index !== -1) {

            members[index] = member;

            message.style.color = "green";
            message.textContent = "Member updated successfully!";

        }

    }

    // Add Member
    else {

        const exists = members.some(
            item => item.memberId.toLowerCase() ===
            member.memberId.toLowerCase()
        );

        if (exists) {

            message.style.color = "red";
            message.textContent = "Member ID already exists!";
            return;

        }

        members.push(member);

        message.style.color = "green";
        message.textContent = "Member added successfully!";

    }

    saveMembers();

    selectedIds.clear();

    displayMembers();

    setTimeout(() => {
        showMemberList();
    }, 800);

});


// =====================================
// EDIT MEMBER
// =====================================

function editMember(id) {

    const member = members.find(
        item => item.memberId === id
    );

    if (!member) return;

    memberList.style.display = "none";
    document.querySelector(".search-section").style.display = "none";

    addMemberForm.style.display = "block";

    editMemberId = id;

    document.getElementById("formTitle").textContent =
        "✏ Edit Member";

    document.getElementById("memberId").value = member.memberId;
    document.getElementById("memberId").disabled = true;

    document.getElementById("memberName").value = member.memberName;
    document.getElementById("email").value = member.email;
    document.getElementById("phone").value = member.phone;
    document.getElementById("address").value = member.address;
    document.getElementById("membershipType").value = member.membershipType;
    document.getElementById("joinDate").value = member.joinDate;

    message.textContent = "";

}


// =====================================
// SEARCH MEMBERS
// =====================================

function searchMembers() {

    const searchValue = searchInput.value.trim().toLowerCase();

    const filteredMembers = members.filter(member => {

        return (
            String(member.memberId).toLowerCase().includes(searchValue) ||
            String(member.memberName).toLowerCase().includes(searchValue)
        );

    });

    displayMembers(filteredMembers);

}


// =====================================
// CLEAR SEARCH
// =====================================

function clearSearch() {

    searchInput.value = "";

    displayMembers();

}


// Search while typing
searchInput.addEventListener("input", searchMembers);


// =====================================
// INITIAL DISPLAY
// =====================================

displayMembers();
