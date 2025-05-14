// Завантаження JSON-даних
fetch('js/titles.json')
    .then(response => response.json())
    .then(data => {
        if (!data || !Array.isArray(data.titles)) {
            throw new Error('Невірний формат JSON');
        }
        const titles = data.titles; // Отримуємо масив об'єктів з JSON
        createTable(titles); // Викликаємо функцію для створення таблиці
    })
    .catch(error => console.error('Помилка завантаження JSON:', error));

// Функція для створення таблиці
function createTable(data) {
    // Створюємо елемент таблиці
    const table = document.createElement('table');
    table.border = "1";
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";

    // Створюємо заголовок таблиці
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const th1 = document.createElement('th');
    th1.textContent = 'Номер';
    const th2 = document.createElement('th');
    th2.textContent = 'Назва';

    headerRow.appendChild(th1);
    headerRow.appendChild(th2);
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

        row.appendChild(td1);
        row.appendChild(td2);
        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    // Додаємо таблицю до DOM
    const container = document.getElementById('table-container');
    if (container) {
        container.appendChild(table); // Додаємо таблицю до контейнера, якщо він існує
    } else {
        document.body.appendChild(table); // Якщо контейнера немає, додаємо до body
    }
    table.className = 'my-table';
}