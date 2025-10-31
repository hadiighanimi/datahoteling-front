const serviceData = {
  hosts: [
    {
      id: 101,
      name: "هاست 1",
      purchaseDate: "2025-10-01",
      expiryDate: "2025-11-30",
    },
    {
      id: 102,
      name: "هاست 2",
      purchaseDate: "2024-05-01",
      expiryDate: "2025-11-15",
    },
    {
      id: 103,
      name: "هاست 3",
      purchaseDate: "2023-08-10",
      expiryDate: "2024-11-01",
    }, // منقضی شده
  ],
  servers: [
    {
      id: 201,
      name: "Server 1",
      purchaseDate: "2025-10-01",
      expiryDate: "2025-11-30",
    },
    {
      id: 202,
      name: "Server 2",
      purchaseDate: "2024-05-01",
      expiryDate: "2025-11-15",
    },
    {
      id: 203,
      name: "Server 3",
      purchaseDate: "2024-09-20",
      expiryDate: "2025-03-20",
    },
  ],
  domains: [
    {
      id: 301,
      name: "hadi.com",
      purchaseDate: "2025-10-01",
      expiryDate: "2025-11-30",
    },
    {
      id: 302,
      name: "kasra.ir",
      purchaseDate: "2024-05-01",
      expiryDate: "2025-11-15",
    },
    {
      id: 303,
      name: "dataHoteling.com",
      purchaseDate: "2024-09-20",
      expiryDate: "2025-03-20",
    },
  ],
};

function handleRenewalClick(serviceId, serviceName) {
  alert(
    `درخواست تمدید برای سرویس:\nشناسه: ${serviceId}\nنام: ${serviceName}\n\nوارد صفحه پرداخت می‌شوید...`
  );
}

function getRemainingDays(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diff = expiry.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function renderServiceTable(services, tableBodyId) {
  const tableBody = document.getElementById(tableBodyId);
  if (!tableBody) return;

  let html = "";

  services.forEach((service) => {
    const remainingDays = getRemainingDays(service.expiryDate);

    let statusClass = "status-active";
    let statusText = "فعال";
    let remainingDaysClass = "remaining-days";

    if (remainingDays <= 0) {
      statusClass = "status-expired";
      statusText = "منقضی شده";
      remainingDaysClass += " expired";
    } else if (remainingDays <= 15) {
      statusClass = "status-warning";
      statusText = "نزدیک انقضا";
    }

    const displayDays = remainingDays <= 0 ? 0 : remainingDays;

    html += `
      <tr>
        <td>${service.name}</td>
        <td>${service.purchaseDate}</td>
        <td>${service.expiryDate}</td>
        <td class="${remainingDaysClass}">${displayDays}</td>
        <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        <td>
          <button
            class="action-button primary-btn"
            onclick="handleRenewalClick('${service.id}', '${service.name}')">
            تمدید
          </button>
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = html;
}

function renderAllServiceTables() {
  renderServiceTable(serviceData.hosts, "hosts-table-body");
  renderServiceTable(serviceData.servers, "servers-table-body");
  renderServiceTable(serviceData.domains, "domains-table-body");
}

function initializeToggleButtons() {
  const toggleButtons = document.querySelectorAll(".toggle-btn");
  const contentTabs = document.querySelectorAll(".service-content-tab");

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");

      if (button.classList.contains("active")) return;

      toggleButtons.forEach((b) => b.classList.remove("active"));
      contentTabs.forEach((tab) => tab.classList.remove("active-content"));

      button.classList.add("active");
      const targetContent = document.querySelector(targetId);
      if (targetContent) targetContent.classList.add("active-content");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderAllServiceTables();
  initializeToggleButtons();
});
