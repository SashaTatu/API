let records = [];

// Завантаження нового формату JSON (масив об'єктів)
fetch('js/full_table_data.json')
    .then(response => response.json())
    .then(data => {
        records = data.filter(item => item["назва"]);
        renderCards(records); // Показати всі роботи одразу
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
            <div class="work-id">${item["номер"] || ''}</div>
            <div class="work-title">${item["назва"] || ''}</div>
            <div class="work-author"><b>Автор: </b>${item["автор"] || ''}</div>
            <div class="work-department"><b>Відділ:</b> ${item["відділення"] || ''}</div>
            <div class="work-section"><b>Секція: </b>${item["секція"] || ''}</div>
            <div class="work-region"><b>Регіон:</b> ${item["область"] || ''}</div>
            <button class="results-btn">Результати</button>
        `;
        // Додаємо обробник для відкриття модального вікна з постером
        card.addEventListener('click', function (e) {
            // Не відкривати модалку при натисканні на кнопку
            if (e.target.classList.contains('results-btn')) return;
            showPosterModal(item["постер"]);
        });
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
}

// Модальне вікно для постера
function showPosterModal(posterUrl) {
    let oldModal = document.getElementById('poster-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'poster-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'rgba(0,0,0,0.7)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '9999';

    modal.innerHTML = `
        <div style="position:relative;max-width:90vw;max-height:90vh;">
            <img id="modal-poster-img" src="${posterUrl}" alt="Постер" style="max-width:100%;max-height:80vh;display:block;">
            <button id="close-modal-btn" style="position:absolute;top:-18px;right:-18px;background:#e8491d;color:#fff;border:none;border-radius:50%;width:36px;height:36px;font-size:22px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);display:none;">×</button>
        </div>
    `;

    document.body.appendChild(modal);

    // Плавне появлення постера після завантаження
    const img = document.getElementById('modal-poster-img');
    const closeBtn = document.getElementById('close-modal-btn');
    img.addEventListener('load', () => {
        img.classList.add('loaded');
        closeBtn.style.display = 'block';
    });

    closeBtn.onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
}

function filterRecords(query) {
    query = query.trim().toLowerCase();
    return records.filter(item =>
        (item["назва"] && item["назва"].toLowerCase().includes(query)) ||
        (item["автор"] && item["автор"].toLowerCase().includes(query)) ||
        (item["відділення"] && item["відділення"].toLowerCase().includes(query)) ||
        (item["секція"] && item["секція"].toLowerCase().includes(query)) ||
        (item["область"] && item["область"].toLowerCase().includes(query))
    );
}

// При натисканні кнопки показуємо картки з результатами
document.getElementById('search-btn').addEventListener('click', function () {
    const query = document.getElementById('search').value;
    if (query === '') {
        renderCards(records); // Якщо поле порожнє — показати всі
    } else {
        const filtered = filterRecords(query);
        renderCards(filtered);
    }
});