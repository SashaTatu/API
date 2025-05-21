let records = [];

fetch('js/full_table_data.json')
    .then(response => response.json())
    .then(data => {
        records = data.records.filter(item => item.title);
        // Не показуємо картки одразу
    });

function renderCards(data) {
    const container = document.getElementById('table-container');
    container.innerHTML = '';
    if (data.length === 0) return;

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.innerHTML = `
            <div class="work-id">${item.id || ''}</div>
            <div class="work-title">${item.title || ''}</div>
            <div class="work-department"><b>Відділ:</b> ${item.department || ''}</div>
            <div class="work-region"><b>Регіон:</b> ${item.region || ''}</div>
            <button class="results-btn">Результати</button>
        `;
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
}

function filterRecords(query) {
    query = query.trim().toLowerCase();
    return records.filter(item =>
        (item.title && item.title.toLowerCase().includes(query)) ||
        (item.department && item.department.toLowerCase().includes(query)) ||
        (item.region && item.region.toLowerCase().includes(query))
    );
}

// При натисканні кнопки показуємо картки з результатами
document.getElementById('search-btn').addEventListener('click', function () {
    const query = document.getElementById('search').value;
    const filtered = filterRecords(query);
    renderCards(filtered);
});

// При вводі не показуємо картки
document.getElementById('search').addEventListener('input', function () {
    document.getElementById('table-container').innerHTML = '';
});