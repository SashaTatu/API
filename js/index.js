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
        // Модалка з постером при кліку на картку
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('results-btn')) return;
            showPosterModal(item["постер"]);
        });
        // Модалка з результатами при кліку на кнопку
        card.querySelector('.results-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            showResultsModal(item["автор"], item["секція"]);
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

// Додаємо функцію для модального вікна з результатами
function showResultsModal(author, section) {
    // Додаємо всі потрібні файли
    Promise.all([
        fetch('js/math.json').then(r => r.json()),
        fetch('js/economy.json').then(r => r.json()),
        fetch('js/physics_and_astronomy.json').then(r => r.json()),
        fetch('js/philosophy_and_social_sciences.json').then(r => r.json()),
        fetch('js/earth_sciences.json').then(r => r.json()),
        fetch('js/agricultural_sciences.json').then(r => r.json()),
        fetch('js/literary_studies.json').then(r => r.json())
    ])
    .then(([mathData, economyData, physicsData, philosophyData, earthData, agriculturalData, literaryData]) => {
        let allWorks = [];
        [mathData, economyData, physicsData, philosophyData, earthData, agriculturalData, literaryData].forEach(data => {
            for (const stageKey in data) {
                const stage = data[stageKey];
                for (const departmentKey in stage) {
                    const department = stage[departmentKey];
                    for (const sectionKey in department) {
                        const works = department[sectionKey];
                        works.forEach(work => {
                            allWorks.push({
                                ...work,
                                _section: sectionKey
                            });
                        });
                    }
                }
            }
        });

        // Пошук за автором і секцією
        const found = allWorks.find(res =>
            res["Прізвище, ім’я, по батькові"] === author &&
            res._section.toLowerCase().includes(section.trim().toLowerCase())
        );

        let content = '';
        if (found) {
            content = `
                <div class="results-title">Результати учасника</div>
                <div class="results-info">
                    <div class="results-block">
                        <span class="label">Автор:</span><br>
                        <span class="value name">${found["Прізвище, ім’я, по батькові"]}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Секція:</span><br>
                        <span class="value">${found._section}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Область:</span><br>
                        <span class="value">${found["Область"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Клас:</span><br>
                        <span class="value">${found["Клас"] || '—'}</span>
                    </div>
                </div>
                <hr class="results-divider">
                <div class="results-scores">
                    <div class="results-block">
                        <span class="label">Заочне оцінювання:</span><br>
                        <span class="value score">${found["Заочне оцінювання"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Постерний захист:</span><br>
                        <span class="value score">${found["Постерний захист"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Наукова конференція:</span><br>
                        <span class="value score">${found["Наукова конференція"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Загальна сума балів:</span><br>
                        <span class="value score">${found["Загальна сума балів"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Рейтинг:</span><br>
                        <span class="value score">${found["Рейтинг"] || '—'}</span>
                    </div>
                    <div class="results-block">
                        <span class="label">Місце:</span><br>
                        <span class="value place">${found["Місце"] || '—'}</span>
                    </div>
                </div>
            `;
        } else {
            content = `<div style="font-size:20px;text-align:center;padding:30px 0;">Результати не знайдено.</div>`;
        }

        let oldModal = document.getElementById('results-modal');
        if (oldModal) oldModal.remove();

        const modal = document.createElement('div');
        modal.id = 'results-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '10000';

        modal.innerHTML = `
            <div style="background:#fff;padding:36px 32px 28px 32px;border-radius:20px;min-width:320px;max-width:95vw;box-shadow:0 8px 40px rgba(0,0,0,0.18);position:relative;animation:fadeIn .25s;">
                <button id="close-results-btn" style="position:absolute;top:-18px;right:-18px;background:#e8491d;color:#fff;border:none;border-radius:50%;width:38px;height:38px;font-size:24px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.2);transition:background 0.2s;">×</button>
                ${content}
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('close-results-btn').onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    })
    .catch(err => {
        alert('Помилка завантаження результатів');
        console.error(err);
    });
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