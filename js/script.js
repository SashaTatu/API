// Завантаження JSON-даних з full_table_data.json
fetch('js/full_table_data.json')
    .then(response => response.json())
    .then(data => {
        if (!data || !Array.isArray(data.records)) {
            throw new Error('Невірний формат JSON');
        }
        createTable(data.records);
    })
    .catch(error => console.error('Помилка завантаження JSON:', error));

// Функція для створення таблиці з даних full_table_data.json
function createTable(data) {
    const table = document.createElement('table');
    table.border = "1";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Створюємо заголовок таблиці
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const headers = ['Номер', 'Назва', 'Відділ', 'Регіон'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Створюємо тіло таблиці
    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');

        const td1 = document.createElement('td');
        td1.textContent = item.id;
        td1.style.textAlign = "center";

        const td2 = document.createElement('td');
        td2.textContent = item.title;

        const td3 = document.createElement('td');
        td3.textContent = item.department;

        const td4 = document.createElement('td');
        td4.textContent = item.region;

        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        row.appendChild(td4);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Додаємо таблицю до DOM
    const container = document.getElementById('table-container');
    if (container) {
        container.appendChild(table);
    } else {
        document.body.appendChild(table);
    }
    table.className = 'my-table';
}

