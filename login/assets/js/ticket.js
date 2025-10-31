/* START OF Global Variables */
const form = document.getElementById("ticket-form");
const ticketModal = document.getElementById("ticket-modal");
const ticketDetailModal = document.getElementById("ticket-detail-modal");
const editDeleteModal = document.getElementById("edit-delete-modal");
const deleteSelectedModal = document.getElementById("delete-selected-modal");
const deleteAllModal = document.getElementById("delete-all-modal");
const closeTicketModalButton = document.querySelector(".close-ticket-modal");
const closeEditModalButtons = document.querySelectorAll(".close-edit-modal");
const closeSelectedDeleteModalButtons = document.querySelectorAll(
  ".close-selected-delete-modal"
);
const closeAllDeleteModalButtons = document.querySelectorAll(
  ".close-all-delete-modal"
);
const ticketNumberDisplay = document.getElementById("modal-ticket-number");
const qrcodeContainer = document.getElementById("qrcode-container");
const ticketListBody = document.getElementById("ticket-list-body");
const messageTextarea = document.getElementById("message");
const charCountDisplay = document.getElementById("char-count");
const editMessageTextarea = document.getElementById("edit-message");
const editCharCountDisplay = document.getElementById("edit-char-count");
const generateButton = document.getElementById("generate-button");
const editTicketForm = document.getElementById("edit-ticket-form");
const confirmDeleteButton = document.getElementById("confirm-delete-button");
const filterToggleButton = document.getElementById("filter-toggle-button");
const filterControlsContainer = document.getElementById(
  "filter-controls-container"
);
const ticketSearchInput = document.getElementById("ticket-search");
const filterDepartmentHiddenInput = document.getElementById(
  "filter-department-hidden"
);
const filterPriorityHiddenInput = document.getElementById(
  "filter-priority-hidden"
);
const filterStatusHiddenInput = document.getElementById("filter-status-hidden");
const deleteAllButton = document.getElementById("delete-all-button");
const confirmDeleteAllButton = document.getElementById(
  "confirm-delete-all-button"
);
const deleteSelectedButton = document.getElementById("delete-selected-button");
const confirmDeleteSelectedButton = document.getElementById(
  "confirm-delete-selected-button"
);
const selectedTicketCountDisplay = document.getElementById(
  "selected-ticket-count"
);
const notificationBox = document.getElementById("notification-box");
const prevPageButton = document.getElementById("prev-page");
const nextPageButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const maxChar = 500;
let currentTicketIdForDeletion = null;
let currentPage = 1;
const itemsPerPage = 5;
/* END OF Global Variables */

function generateRandomTicketID() {
  const existingTickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const existingIds = new Set(existingTickets.map((t) => t.id));
  let newId;
  do {
    newId = Math.floor(100000 + Math.random() * 900000).toString();
  } while (existingIds.has(newId));
  return newId;
}

function saveTicket(ticket) {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
}

function updateTicket(updatedTicket) {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets = tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t));
  localStorage.setItem("tickets", JSON.stringify(tickets));
  renderTickets();
  showNotification("تیکت ویرایش شد.", "edit");
}

function deleteTicket(id) {
  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets = tickets.filter((t) => t.id !== id);
  localStorage.setItem("tickets", JSON.stringify(tickets));
  editDeleteModal.classList.remove("show");
  renderTickets();
  showNotification("تیکت حذف شد.", "delete");
}

function deleteAllTicketsAction() {
  localStorage.removeItem("tickets");
  deleteAllModal.classList.remove("show");
  renderTickets();
  showNotification("همه تیکت‌ها حذف شدند.", "delete");
}

function deleteSelectedTickets() {
  const selectedCheckboxes = document.querySelectorAll(
    ".ticket-checkbox:checked"
  );
  const selectedIds = Array.from(selectedCheckboxes).map((cb) =>
    cb.getAttribute("data-id")
  );

  if (selectedIds.length === 0) {
    alert("هیچ تیکتی انتخاب نشده است.");
    return;
  }

  selectedTicketCountDisplay.textContent = selectedIds.length;
  deleteSelectedModal.classList.add("show");
}

function confirmDeleteSelectedTickets() {
  const selectedCheckboxes = document.querySelectorAll(
    ".ticket-checkbox:checked"
  );
  const selectedIds = Array.from(selectedCheckboxes).map((cb) =>
    cb.getAttribute("data-id")
  );

  let tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets = tickets.filter((t) => !selectedIds.includes(t.id));
  localStorage.setItem("tickets", JSON.stringify(tickets));

  deleteSelectedModal.classList.remove("show");
  renderTickets();
  showNotification(`${selectedIds.length} تیکت حذف شدند.`, "delete");
}

function updateDeleteSelectedButtonVisibility() {
  const selectedCheckboxes = document.querySelectorAll(
    ".ticket-checkbox:checked"
  );
  const count = selectedCheckboxes.length;
  if (count > 0) {
    deleteSelectedButton.style.display = "flex";
    deleteSelectedButton.innerHTML = `<i class="fas fa-trash-alt"></i> حذف ${count} تیکت انتخاب شده`;
  } else {
    deleteSelectedButton.style.display = "none";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "open":
      return "status-open";
    case "closed":
      return "status-closed";
    case "answered":
      return "status-answered";
    default:
      return "";
  }
}

function getPriorityClass(priority) {
  switch (priority) {
    case "high":
      return "priority-high";
    case "medium":
      return "priority-medium";
    case "low":
      return "priority-low";
    default:
      return "";
  }
}

function getTickets() {
  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  const searchQuery = ticketSearchInput.value.toLowerCase();
  const statusFilter = filterStatusHiddenInput.value;
  const departmentFilter = filterDepartmentHiddenInput.value;
  const priorityFilter = filterPriorityHiddenInput.value;

  return tickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.includes(searchQuery) ||
      ticket.subject.toLowerCase().includes(searchQuery) ||
      ticket.message.toLowerCase().includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || ticket.department === departmentFilter;
    const matchesPriority =
      priorityFilter === "all" || ticket.priority === priorityFilter;
    return (
      matchesSearch && matchesStatus && matchesDepartment && matchesPriority
    );
  });
}

function showTicketDetailModal(ticket) {
  document.getElementById("detail-ticket-number").textContent = `#${ticket.id}`;
  document.getElementById(
    "detail-ticket-name"
  ).textContent = `${ticket.firstName} ${ticket.lastName}`;
  document.getElementById("detail-ticket-email").textContent =
    ticket.email || "ندارد";
  document.getElementById("detail-ticket-phone").textContent =
    ticket.phone || "ندارد";
  document.getElementById("detail-ticket-subject").textContent = ticket.subject;

  const priorityMap = { high: "بالا", medium: "متوسط", low: "کم" };
  document.getElementById("detail-ticket-priority").textContent =
    priorityMap[ticket.priority] || ticket.priority;

  const statusMap = {
    open: "باز",
    closed: "بسته شده",
    answered: "پاسخ داده شده",
  };
  document.getElementById("detail-ticket-status").textContent =
    statusMap[ticket.status] || ticket.status;

  const departmentMap = {
    billing: "مالی و صورتحساب",
    technical: "فنی و هاستینگ",
    sales: "فروش و مشاوره",
  };
  document.getElementById("detail-ticket-department").textContent =
    departmentMap[ticket.department] || ticket.department;

  document.getElementById("detail-ticket-update").textContent =
    ticket.lastUpdate;
  document.getElementById("detail-ticket-message").textContent = ticket.message;

  const detailQrcodeDiv = document.getElementById("detail-qrcode-container");
  detailQrcodeDiv.innerHTML = "";
  if (ticket.qrCode) {
    const qrImg = document.createElement("img");
    qrImg.src = ticket.qrCode;
    qrImg.alt = "QR Code";
    qrImg.style.width = "128px";
    qrImg.style.height = "128px";
    detailQrcodeDiv.appendChild(qrImg);
  } else {
    new QRCode(detailQrcodeDiv, {
      text: `ticket-id:${ticket.id}`,
      width: 128,
      height: 128,
      colorDark: "#0f3360",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
  }
  ticketDetailModal.classList.add("show");
}

function renderTickets() {
  const tickets = getTickets();
  const totalPages = Math.ceil(tickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = tickets.slice(startIndex, endIndex);

  ticketListBody.innerHTML = "";

  updateDeleteSelectedButtonVisibility();

  const departmentMap = {
    billing: "مالی و صورتحساب",
    technical: "فنی و هاستینگ",
    sales: "فروش و مشاوره",
    all: "همه دپارتمان‌ها",
  };

  const statusMap = {
    open: { text: "باز", class: "status-open" },
    closed: { text: "بسته شده", class: "status-closed" },
    answered: { text: "پاسخ داده شده", class: "status-answered" },
  };

  const priorityMap = {
    high: "بالا",
    medium: "متوسط",
    low: "کم",
  };

  if (tickets.length === 0) {
    ticketListBody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #aaa;">تیکتی یافت نشد.</td></tr>`;
    pageInfo.textContent = "";
    prevPageButton.disabled = true;
    nextPageButton.disabled = true;
    return;
  }

  paginatedTickets.forEach((ticket) => {
    const statusInfo = statusMap[ticket.status] || {
      text: "نامشخص",
      class: "status-unknown",
    };
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td><input type="checkbox" class="ticket-checkbox" data-id="${
                      ticket.id
                    }"></td>
                    <td>#${ticket.id}</td>
                    <td>${ticket.subject}</td>
                    <td>${departmentMap[ticket.department] || "نامشخص"}</td>
                    <td><span class="${getPriorityClass(ticket.priority)}">${
      priorityMap[ticket.priority]
    }</span></td>
                    <td>${ticket.lastUpdate}</td>
                    <td><span class="status-badge ${statusInfo.class}">${
      statusInfo.text
    }</span></td>
                    <td>
                        <button class="action-button edit-button" data-id="${
                          ticket.id
                        }"><i class="fas fa-edit"></i></button>
                        <button class="action-button delete-button" data-id="${
                          ticket.id
                        }"><i class="fas fa-trash"></i></button>
                    </td>
                `;

    // کلیک روی ردیف برای باز کردن modal جزئیات
    row.style.cursor = "pointer";
    row.addEventListener("click", function (e) {
      // جلوگیری از باز شدن modal هنگام کلیک روی چک‌باکس یا دکمه‌های عملیات
      if (
        !e.target.closest(".ticket-checkbox") &&
        !e.target.closest(".edit-button") &&
        !e.target.closest(".delete-button")
      ) {
        showTicketDetailModal(ticket);
      }
    });

    ticketListBody.appendChild(row);
  });

  document.querySelectorAll(".edit-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ticketId = e.target.closest(".edit-button").getAttribute("data-id");
      openEditModal(ticketId);
    });
  });
  document.querySelectorAll(".delete-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const ticketId = e.target
        .closest(".delete-button")
        .getAttribute("data-id");
      openDeleteModal(ticketId);
    });
  });

  pageInfo.textContent = `صفحه ${currentPage} از ${totalPages}`;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage === totalPages;
}

function openEditModal(ticketId) {
  const ticket = getTickets().find((t) => t.id === ticketId);
  if (!ticket) return;

  document.getElementById("edit-ticket-id").value = ticket.id;
  document.getElementById("current-ticket-id").textContent = `#${ticket.id}`;
  document.getElementById("edit-firstName").value = ticket.firstName;
  document.getElementById("edit-lastName").value = ticket.lastName;

  const depDisplay = document.getElementById("edit-department-select-display");
  const depInput = document.getElementById("edit-department");
  const depMenu = document
    .getElementById("edit-department-container")
    .querySelector(".dropdown-menu-custom");
  depInput.value = ticket.department || "";
  const depItem = depMenu.querySelector(`a[data-value="${ticket.department}"]`);
  if (depItem && ticket.department) {
    depDisplay.textContent = depItem.textContent;
    depDisplay.classList.remove("placeholder-text");
    depMenu
      .querySelectorAll("a")
      .forEach((a) => a.classList.remove("selected"));
    depItem.classList.add("selected");
  } else {
    depDisplay.textContent = "انتخاب کنید...";
    depDisplay.classList.add("placeholder-text");
    depMenu
      .querySelectorAll("a")
      .forEach((a) => a.classList.remove("selected"));
  }

  const priDisplay = document.getElementById("edit-priority-select-display");
  const priInput = document.getElementById("edit-priority");
  const priMenu = document
    .getElementById("edit-priority-container")
    .querySelector(".dropdown-menu-custom");
  priInput.value = ticket.priority;
  const priItem = priMenu.querySelector(`a[data-value="${ticket.priority}"]`);
  if (priItem) {
    priDisplay.textContent = priItem.textContent;
    priDisplay.classList.remove("placeholder-text");
    priMenu
      .querySelectorAll("a")
      .forEach((a) => a.classList.remove("selected"));
    priItem.classList.add("selected");
  }

  document.getElementById("edit-subject").value = ticket.subject;
  editMessageTextarea.value = ticket.message;

  const initialRemaining = maxChar - editMessageTextarea.value.length;
  editCharCountDisplay.textContent = `حداکثر ${initialRemaining} کاراکتر باقی مانده `;
  editCharCountDisplay.classList.remove("alert");

  document.getElementById("edit-ticket-section").style.display = "block";
  document.getElementById("delete-ticket-section").style.display = "none";
  editDeleteModal.classList.add("show");
}

function openDeleteModal(ticketId) {
  currentTicketIdForDeletion = ticketId;
  document.getElementById("delete-confirm-id").textContent = `#${ticketId}`;
  document.getElementById("edit-ticket-section").style.display = "none";
  document.getElementById("delete-ticket-section").style.display = "block";
  editDeleteModal.classList.add("show");
}

function showNotification(message, type) {
  if (!notificationBox) {
    console.error("notificationBox element not found!");
    return;
  }
  const box = document.createElement("div");
  box.className = `notification ${type}`;
  const iconMap = {
    add: "check-circle",
    delete: "trash-alt",
    edit: "edit",
    update: "sync-alt",
    error: "exclamation-circle",
  };
  box.innerHTML = `
                <i class="fas fa-${iconMap[type] || "info-circle"}"></i>
                <span>${message}</span>
            `;
  notificationBox.appendChild(box);

  setTimeout(() => {
    box.classList.add("fade-out");
    setTimeout(() => box.remove(), 400);
  }, 2500);
}
/* END OF Utility Functions */

/* START OF Custom Dropdown Logic */
function setupCustomDropdown(
  containerId,
  displayId,
  inputId,
  isFilter = false,
  isPlaceholder = false
) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found!`);
    return;
  }

  const toggle = container.querySelector(".dropdown-toggle-custom");
  const menu = container.querySelector(".dropdown-menu-custom");
  const selectedTextSpan = document.getElementById(displayId);
  const hiddenInput = document.getElementById(inputId);
  const menuItems = menu.querySelectorAll("li a");

  if (!toggle || !menu || !selectedTextSpan || !hiddenInput) {
    console.error("Dropdown elements not found!");
    return;
  }

  toggle.addEventListener("click", function (e) {
    e.stopPropagation();
    const isActive = menu.classList.contains("active");
    document
      .querySelectorAll(".dropdown-menu-custom.active")
      .forEach((openMenu) => {
        if (openMenu !== menu) {
          openMenu.classList.remove("active");
          openMenu.previousElementSibling.classList.remove("open");
        }
      });

    menu.classList.toggle("active");
    toggle.classList.toggle("open");
  });

  menuItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const value = item.getAttribute("data-value");
      selectedTextSpan.textContent = item.textContent;
      selectedTextSpan.classList.remove("placeholder-text");
      hiddenInput.value = value;
      menuItems.forEach((i) => i.classList.remove("selected"));
      item.classList.add("selected");
      menu.classList.remove("active");
      toggle.classList.remove("open");
      if (isFilter) {
        currentPage = 1;
        renderTickets();
      }
    });
  });

  const initialValue = hiddenInput.value;
  const placeholderText =
    selectedTextSpan.getAttribute("data-placeholder") || "انتخاب کنید...";

  if (isPlaceholder && (!initialValue || initialValue === "")) {
    selectedTextSpan.textContent = placeholderText;
    selectedTextSpan.classList.add("placeholder-text");
    menuItems.forEach((item) => item.classList.remove("selected"));
  } else if (initialValue) {
    const initialItem = menu.querySelector(
      `li a[data-value="${initialValue}"]`
    );
    if (initialItem) {
      selectedTextSpan.textContent = initialItem.textContent;
      selectedTextSpan.classList.remove("placeholder-text");
      menuItems.forEach((item) => item.classList.remove("selected"));
      initialItem.classList.add("selected");
    } else {
      selectedTextSpan.textContent = placeholderText;
      selectedTextSpan.classList.add("placeholder-text");
      hiddenInput.value = "";
    }
  }

  document.addEventListener("click", function (e) {
    if (menu.classList.contains("active") && !container.contains(e.target)) {
      menu.classList.remove("active");
      toggle.classList.remove("open");
    }
  });
}
/* END OF Custom Dropdown Logic */

/* START OF Event Listeners */
document.addEventListener("DOMContentLoaded", function () {
  setupCustomDropdown(
    "new-ticket-department-container",
    "department-select-display",
    "department",
    false,
    true
  );
  setupCustomDropdown(
    "new-ticket-priority-container",
    "priority-select-display",
    "priority"
  );
  setupCustomDropdown(
    "filter-department-container",
    "filter-department-select-display",
    "filter-department-hidden",
    true
  );
  setupCustomDropdown(
    "filter-priority-container",
    "filter-priority-select-display",
    "filter-priority-hidden",
    true
  );
  setupCustomDropdown(
    "filter-status-container",
    "filter-status-select-display",
    "filter-status-hidden",
    true
  );
  setupCustomDropdown(
    "edit-department-container",
    "edit-department-select-display",
    "edit-department",
    false,
    true
  );
  setupCustomDropdown(
    "edit-priority-container",
    "edit-priority-select-display",
    "edit-priority"
  );

  renderTickets();
  const initialRemaining = maxChar - messageTextarea.value.length;
  charCountDisplay.textContent = `حداکثر ${initialRemaining} کاراکتر باقی مانده `;
});

messageTextarea.addEventListener("input", function () {
  const remaining = maxChar - this.value.length;
  charCountDisplay.textContent = `حداکثر ${remaining} کاراکتر باقی مانده `;
  if (remaining < 20) {
    charCountDisplay.classList.add("alert");
  } else {
    charCountDisplay.classList.remove("alert");
  }
});

editMessageTextarea.addEventListener("input", function () {
  const remaining = maxChar - this.value.length;
  editCharCountDisplay.textContent = `حداکثر ${remaining} کاراکتر باقی مانده`;
  if (remaining < 20) {
    editCharCountDisplay.classList.add("alert");
  } else {
    editCharCountDisplay.classList.remove("alert");
  }
});

filterToggleButton.addEventListener("click", function () {
  filterControlsContainer.classList.toggle("hidden");
});

ticketSearchInput.addEventListener("input", () => {
  currentPage = 1;
  renderTickets();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!document.getElementById("department").value) {
    showNotification("لطفاً دپارتمان را انتخاب کنید.", "error");
    return;
  }
  const newTicket = {
    id: generateRandomTicketID(),
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    department: document.getElementById("department").value,
    priority: document.getElementById("priority").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
    lastUpdate: new Date().toLocaleDateString("fa-IR"),
    status: "open",
  };
  saveTicket(newTicket);
  showNotification("تیکت جدید ثبت شد.", "add");

  form.reset();
  messageTextarea.value = "";
  const departmentDisplay = document.getElementById(
    "department-select-display"
  );
  departmentDisplay.textContent = "انتخاب کنید...";
  departmentDisplay.classList.add("placeholder-text");
  document.getElementById("department").value = "";
  document.getElementById("priority-select-display").textContent = "متوسط";
  document.getElementById("priority").value = "medium";
  document
    .getElementById("new-ticket-priority-container")
    .querySelectorAll(".dropdown-menu-custom a")
    .forEach((a) => a.classList.remove("selected"));
  document
    .querySelector('#new-ticket-priority-container a[data-value="medium"]')
    .classList.add("selected");
  document
    .getElementById("new-ticket-department-container")
    .querySelectorAll(".dropdown-menu-custom a")
    .forEach((a) => a.classList.remove("selected"));
  charCountDisplay.textContent = `حداکثر ${maxChar} کاراکتر باقی مانده`;
  charCountDisplay.classList.remove("alert");

  ticketNumberDisplay.textContent = `شماره پیگیری: #${newTicket.id}`;
  qrcodeContainer.innerHTML = "";
  new QRCode(qrcodeContainer, {
    text: `ticket-id:${newTicket.id}`,
    width: 128,
    height: 128,
    colorDark: "#0f3360",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });

  ticketModal.classList.add("show");
});

generateButton.addEventListener("click", function () {
  document.getElementById("firstName").value = "تست";
  document.getElementById("lastName").value = "کاربر";
  document.getElementById("email").value = "test.user@example.com";
  document.getElementById("phone").value = "09121234567";

  const departments = {
    billing: "مالی و صورتحساب",
    technical: "فنی و هاستینگ",
    sales: "فروش و مشاوره",
  };
  const departmentValues = Object.keys(departments);
  const randomDepartmentValue =
    departmentValues[Math.floor(Math.random() * departmentValues.length)];
  const randomDepartmentName = departments[randomDepartmentValue];

  const priorityValues = ["low", "medium", "high"];
  const randomPriorityValue =
    priorityValues[Math.floor(Math.random() * priorityValues.length)];

  document.getElementById("department").value = randomDepartmentValue;
  document.getElementById("priority").value = randomPriorityValue;
  document.getElementById("subject").value =
    "مشکل تصادفی شماره " + Math.floor(Math.random() * 100);
  const randomMessage =
    "این یک پیام تیکت آزمایشی و تصادفی برای تست عملکرد سیستم است.";
  document.getElementById("message").value = randomMessage;
  messageTextarea.dispatchEvent(new Event("input"));

  const departmentDisplay = document.getElementById(
    "department-select-display"
  );
  departmentDisplay.textContent = randomDepartmentName;
  departmentDisplay.classList.remove("placeholder-text");
  document
    .getElementById("new-ticket-department-container")
    .querySelectorAll(".dropdown-menu-custom a")
    .forEach((a) => a.classList.remove("selected"));
  const selectedDepartment = document.querySelector(
    `#new-ticket-department-container a[data-value="${randomDepartmentValue}"]`
  );
  if (selectedDepartment) selectedDepartment.classList.add("selected");

  document.getElementById("priority-select-display").textContent =
    randomPriorityValue === "high"
      ? "بالا"
      : randomPriorityValue === "medium"
      ? "متوسط"
      : "کم";
  document
    .getElementById("new-ticket-priority-container")
    .querySelectorAll(".dropdown-menu-custom a")
    .forEach((a) => a.classList.remove("selected"));
  document
    .querySelector(
      `#new-ticket-priority-container a[data-value="${randomPriorityValue}"]`
    )
    .classList.add("selected");
});

editTicketForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!document.getElementById("edit-department").value) {
    showNotification("لطفاً دپارتمان را انتخاب کنید.", "error");
    return;
  }
  const editedTicket = {
    id: document.getElementById("edit-ticket-id").value,
    firstName: document.getElementById("edit-firstName").value,
    lastName: document.getElementById("edit-lastName").value,
    department: document.getElementById("edit-department").value,
    priority: document.getElementById("edit-priority").value,
    subject: document.getElementById("edit-subject").value,
    message: editMessageTextarea.value,
    lastUpdate: new Date().toLocaleDateString("fa-IR"),
    status: "open",
  };
  updateTicket(editedTicket);
  editDeleteModal.classList.remove("show");
});

confirmDeleteButton.addEventListener("click", function () {
  if (currentTicketIdForDeletion) {
    deleteTicket(currentTicketIdForDeletion);
    currentTicketIdForDeletion = null;
  }
});

deleteAllButton.addEventListener("click", function () {
  deleteAllModal.classList.add("show");
});

confirmDeleteAllButton.addEventListener("click", function () {
  deleteAllTicketsAction();
});

deleteSelectedButton.addEventListener("click", deleteSelectedTickets);
confirmDeleteSelectedButton.addEventListener("click", function () {
  confirmDeleteSelectedTickets();
});

ticketListBody.addEventListener("click", function (e) {
  const editButton = e.target.closest(".edit-button");
  const deleteButton = e.target.closest(".delete-button");
  if (editButton) {
    const ticketId = editButton.getAttribute("data-id");
    openEditModal(ticketId);
  } else if (deleteButton) {
    const ticketId = deleteButton.getAttribute("data-id");
    openDeleteModal(ticketId);
  }
});

ticketListBody.addEventListener("change", function (e) {
  if (e.target.classList.contains("ticket-checkbox")) {
    updateDeleteSelectedButtonVisibility();
    const allCheckboxes = document.querySelectorAll(".ticket-checkbox");
    const checkedCheckboxes = document.querySelectorAll(
      ".ticket-checkbox:checked"
    );
  }
});

closeEditModalButtons.forEach((button) => {
  button.addEventListener("click", function () {
    editDeleteModal.classList.remove("show");
  });
});

closeSelectedDeleteModalButtons.forEach((button) => {
  button.addEventListener("click", function () {
    deleteSelectedModal.classList.remove("show");
  });
});

closeAllDeleteModalButtons.forEach((button) => {
  button.addEventListener("click", function () {
    deleteAllModal.classList.remove("show");
  });
});

window.addEventListener("click", function (event) {
  if (event.target === ticketModal) {
    ticketModal.classList.remove("show");
  }
  if (event.target === ticketDetailModal) {
    ticketDetailModal.classList.remove("show");
  }
  if (event.target === editDeleteModal) {
    editDeleteModal.classList.remove("show");
  }
  if (event.target === deleteSelectedModal) {
    deleteSelectedModal.classList.remove("show");
  }
  if (event.target === deleteAllModal) {
    deleteAllModal.classList.remove("show");
  }
});

prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTickets();
  }
});

nextPageButton.addEventListener("click", () => {
  const totalPages = Math.ceil(getTickets().length / itemsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderTickets();
  }
});

/* END OF Event Listeners */
