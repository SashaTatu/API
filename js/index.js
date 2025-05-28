let records = [];

// Завантаження нового формату JSON (масив об'єктів)
fetch('js/full_table_data.json')
    .then(response => response.json())
    .then(data => {
        records = data.filter(item => item["назва"]);
        renderCards(records); // Показати всі роботи одразу
        fillSelects(records); // Заповнити селекти авторами та секціями
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
            <div class="work-id">${item["номер"] || item["№"] || ''}</div>
            <div class="work-title">${item["назва"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || ''}</div>
            <div class="work-author"><b>Автор:</b> ${item["автор"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || ''}</div>
            <div class="work-department"><b>Відділ:</b> ${item["відділення"] || item["Відділення"] || ''}</div>
            <div class="work-section"><b>Секція:</b> ${item["секція"] || item._section || item["Секція"] || ''}</div>
            <div class="work-region"><b>Регіон:</b> ${item["область"] || item["Область"] || ''}</div>
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
            showResultsModal(
                item["автор"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || '',
                item["секція"] || item._section || item["Секція"] || ''
            );
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

// Оновіть функцію fillSelects:
function fillSelects(records) {
    const authorSelect = document.getElementById('author-select');
    const departmentSelect = document.getElementById('department-select');
    const sectionSelect = document.getElementById('section-select');
    const regionSelect = document.getElementById('region-select');

    // Унікальні значення + сортування за алфавітом (з урахуванням української мови)
    const authors = Array.from(new Set(records.map(r => r["автор"]).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'uk'));
    const departments = Array.from(new Set(records.map(r => r["відділення"]).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'uk'));
    const sections = Array.from(new Set(records.map(r => r["секція"]).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'uk'));
    const regions = Array.from(new Set(records.map(r => r["область"]).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'uk'));

    authorSelect.innerHTML = '<option value="">Виберіть автора</option>' +
        authors.map(a => `<option value="${a}">${a}</option>`).join('');
    departmentSelect.innerHTML = '<option value="">Виберіть відділ</option>' +
        departments.map(d => `<option value="${d}">${d}</option>`).join('');
    sectionSelect.innerHTML = '<option value="">Виберіть секцію</option>' +
        sections.map(s => `<option value="${s}">${s}</option>`).join('');
    regionSelect.innerHTML = '<option value="">Виберіть область</option>' +
        regions.map(r => `<option value="${r}">${r}</option>`).join('');
}

// Додайте цей код у ваш JS після fillSelects та renderCards

document.getElementById('author-select').addEventListener('change', filterBySelects);
document.getElementById('department-select').addEventListener('change', filterBySelects);
document.getElementById('section-select').addEventListener('change', filterBySelects);
document.getElementById('region-select').addEventListener('change', filterBySelects);
document.getElementById('place-select').addEventListener('change', filterBySelects);

function filterBySelects() {
    const author = document.getElementById('author-select').value;
    const department = document.getElementById('department-select').value;
    const section = document.getElementById('section-select').value;
    const region = document.getElementById('region-select').value;
    const place = document.getElementById('place-select').value;
    let filtered = records;
    if (author) filtered = filtered.filter(r => r["автор"] === author);
    if (department) filtered = filtered.filter(r => r["відділення"] === department);
    if (section) filtered = filtered.filter(r => r["секція"] === section);
    if (region) filtered = filtered.filter(r => r["область"] === region);
    if (place) filtered = filtered.filter(r => r["Місце"] === place); // ← ось тут!
    renderCards(filtered);
}

// Додайте цю функцію для отримання унікальних місць з усіх результатних JSON (окрім full_table_data)
let allWorks = [];

async function loadData() {
    const files = [
        'js/math.json',
        'js/economy.json',
        'js/physics_and_astronomy.json',
        'js/philosophy_and_social_sciences.json',
        'js/earth_sciences.json',
        'js/agricultural_sciences.json',
        'js/literary_studies.json',
        'js/chemistry_biology.json'
    ];

    try {
        const allData = await Promise.all(
            files.map(async (file) => {
                try {
                    const response = await fetch(file);
                    return response.ok ? response.json() : {};
                } catch (error) {
                    console.error(`Помилка завантаження ${file}:`, error);
                    return {};
                }
            })
        );

        allData.forEach(data => {
            Object.values(data).forEach(stage => {
                if (typeof stage !== 'object') return;
                Object.values(stage).forEach(department => {
                    if (typeof department !== 'object') return;
                    Object.values(department).forEach(works => {
                        if (Array.isArray(works)) {
                            allWorks.push(...works.filter(w => ["І", "ІІ", "ІІІ"].includes((w["Місце"] || '').trim())));
                        }
                    });
                });
            });
        });

        if (typeof renderWorks === "function") {
            renderWorks(allWorks); // Показати всі на початку
        } else {
            console.error("Функція renderWorks не знайдена!");
        }
    } catch (error) {
        console.error("Помилка обробки даних:", error);
    }
}

// Додаємо функцію для рендеру карток з призовими місцями
function renderPrizeCards(works) {
    const container = document.getElementById('table-container');
    container.innerHTML = '';
    if (!works.length) {
        container.innerHTML = '<div style="text-align:center;padding:30px 0;">Немає робіт з обраним місцем.</div>';
        return;
    }

    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';

    works.forEach(item => {
        const card = document.createElement('div');
        card.className = 'work-card';
        card.innerHTML = `
            <div class="work-id">${item["номер"] || item["№"] || ''}</div>
            <div class="work-title">${item["назва"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || ''}</div>
            <div class="work-author"><b>Автор:</b> ${item["автор"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || ''}</div>
            <div class="work-department"><b>Відділ:</b> ${item["відділення"] || item["Відділення"] || ''}</div>
            <div class="work-section"><b>Секція:</b> ${item["секція"] || item._section || item["Секція"] || ''}</div>
            <div class="work-region"><b>Регіон:</b> ${item["область"] || item["Область"] || ''}</div>
            <div class="work-class"><b>Клас:</b> ${item["клас"] || item["Клас"] || ''}</div>
            <div class="work-place">
                <span class="place-icon">${
                    item["Місце"] === "І" ? "🥇" :
                    item["Місце"] === "ІІ" ? "🥈" :
                    item["Місце"] === "ІІІ" ? "🥉" : ""
                }</span>
                <b>Місце:</b> <span style="color:#e8491d;font-weight:700">${item["Місце"] || ''}</span>
            </div>
            <button class="results-btn">Результати</button>
        `;
        // Модалка з постером при кліку на картку (як у renderCards)
        card.addEventListener('click', function (e) {
            if (e.target.classList.contains('results-btn')) return;
            showPosterModal(item["постер"]);
        });
        // Модалка з результатами при кліку на кнопку
        card.querySelector('.results-btn').addEventListener('click', function (e) {
            e.stopPropagation();
            showResultsModal(
                item["автор"] || item["Прізвище, ім’я, по батькові"] || item["Прізвище"] || '',
                item["секція"] || item._section || item["Секція"] || ''
            );
        });
        cardsContainer.appendChild(card);
    });

    container.appendChild(cardsContainer);
}

// Замість renderWorks(filtered) використовуйте renderPrizeCards(filtered)
document.getElementById('place-select')?.addEventListener('change', function () {
    const selectedPlace = this.value;
    const filtered = selectedPlace
        ? allWorks.filter(w => (w["Місце"] || '').trim() === selectedPlace)
        : allWorks;

    renderPrizeCards(filtered);
});

// Викликайте renderPrizeCards(allWorks) після loadData, якщо потрібно показати всі призові роботи одразу

loadData();

