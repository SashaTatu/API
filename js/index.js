let records = [];

fetch('js/full_table_data.json')
    .then(response => response.json())
    .then(data => {
        records = data.records.filter(item => item.title);
        // Не показуємо таблицю одразу
    });

function renderTable(data) {
    const container = document.getElementById('table-container');
    container.innerHTML = '';
    if (data.length === 0) return; // Не показуємо таблицю, якщо немає результатів

    const table = document.createElement('table');
    table.className = 'my-table';
    table.style.width = "100%";
    table.border = "1";
    table.style.borderCollapse = "collapse";

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Номер', 'Назва', 'Відділ', 'Регіон'].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    data.forEach(item => {
        const row = document.createElement('tr');
        ['id', 'title', 'department', 'region'].forEach(key => {
            const td = document.createElement('td');
            td.textContent = item[key] || '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    container.appendChild(table);

    // Явно показуємо таблицю
    table.style.display = 'table';
}

function filterRecords(query) {
    query = query.trim().toLowerCase();
    return records.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.department && item.department.toLowerCase().includes(query)) ||
        (item.region && item.region.toLowerCase().includes(query))
    );
}

// При натисканні кнопки показуємо таблицю з результатами
document.getElementById('search-btn').addEventListener('click', function () {
    const query = document.getElementById('search').value;
    const filtered = filterRecords(query);
    renderTable(filtered);
});

// При вводі не показуємо таблицю
document.getElementById('search').addEventListener('input', function () {
    document.getElementById('table-container').innerHTML = '';
});