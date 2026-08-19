(function() {
    const SUBJECTS = [
        'Русский язык',
        'Литература',
        'Алгебра',
        'Геометрия',
        'Вероятность',
        'Информатика',
        'Английский',
        'История',
        'Обществознание',
        'География',
        'Физика',
        'Химия',
        'Биология',
        'Физра',
        'ОБЗР',
        'Технология'
    ];

    const TOTAL_CELLS = 15;
    const STORAGE_KEY = 'subjects_data';

    const container = document.getElementById('subjectsContainer');
    let allInputs = {}; // { subjectIndex: [inputs] }

    function buildSubjectRow(subject, index) {
        const row = document.createElement('div');
        row.className = 'subject-row';

        // Название предмета
        const nameDiv = document.createElement('div');
        nameDiv.className = 'subject-name';
        nameDiv.textContent = subject;
        row.appendChild(nameDiv);

        // Контейнер для ячеек
        const scrollWrapper = document.createElement('div');
        scrollWrapper.className = 'scroll-wrapper';

        const grid = document.createElement('div');
        grid.className = 'grid';

        // Левая ячейка "Среднее"
        const labelCell = document.createElement('div');
        labelCell.className = 'cell label-cell';
        const labelText = document.createElement('div');
        labelText.className = 'label-text';
        labelText.textContent = 'Посчитать';
        labelCell.appendChild(labelText);
        grid.appendChild(labelCell);

        // 15 ячеек для ввода
        const inputs = [];
        for (let i = 0; i < TOTAL_CELLS; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            const input = document.createElement('input');
            input.type = 'number';
            input.id = `subj_${index}_${i}`;
            input.placeholder = '';
            input.step = 'any';

            cell.appendChild(input);
            grid.appendChild(cell);
            inputs.push(input);
        }

        // Правая ячейка с результатом
        const resultCell = document.createElement('div');
        resultCell.className = 'cell result-cell';
        const resultValue = document.createElement('div');
        resultValue.className = 'result-value';
        resultValue.id = `result_${index}`;
        resultValue.textContent = '—';
        resultCell.appendChild(resultValue);
        grid.appendChild(resultCell);

        scrollWrapper.appendChild(grid);
        row.appendChild(scrollWrapper);

        return { row, inputs, resultValue, scrollWrapper };
    }

    function loadFromStorage() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (!stored) return null;
            return JSON.parse(stored);
        } catch (_) {
            return null;
        }
    }

    function saveToStorage(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (_) {}
    }

    function getCurrentValues(inputs) {
        return inputs.map(inp => inp.value.trim());
    }

    function updateResult(inputs, resultElement) {
        const values = getCurrentValues(inputs);
        const numbers = values
            .map(v => parseFloat(v))
            .filter((n, index) => !isNaN(n) && values[index] !== '');

        if (numbers.length === 0) {
            resultElement.textContent = '—';
            return;
        }

        const sum = numbers.reduce((acc, cur) => acc + cur, 0);
        const avg = sum / numbers.length;
        resultElement.textContent = parseFloat(avg.toFixed(10));
    }

    function saveAllData() {
        const allData = {};
        for (const [index, inputs] of Object.entries(allInputs)) {
            allData[index] = getCurrentValues(inputs);
        }
        saveToStorage(allData);
    }

    function setupDragScroll(scrollWrapper) {
        let isDown = false;
        let startX;
        let scrollLeft;

        scrollWrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            startX = e.pageX - scrollWrapper.offsetLeft;
            scrollLeft = scrollWrapper.scrollLeft;
        });

        scrollWrapper.addEventListener('mouseleave', () => {
            isDown = false;
        });

        scrollWrapper.addEventListener('mouseup', () => {
            isDown = false;
        });

        scrollWrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scrollWrapper.offsetLeft;
            const walk = (x - startX) * 1.5;
            scrollWrapper.scrollLeft = scrollLeft - walk;
        });
    }

    function init() {
        const storedData = loadFromStorage();

        SUBJECTS.forEach((subject, index) => {
            const { row, inputs, resultValue, scrollWrapper } = buildSubjectRow(subject, index);
            container.appendChild(row);
            allInputs[index] = inputs;

            // Загрузка сохранённых данных
            if (storedData && storedData[index]) {
                const data = storedData[index];
                inputs.forEach((input, i) => {
                    if (data[i] !== undefined && data[i] !== null && data[i] !== '') {
                        input.value = data[i];
                    }
                });
            } else {
            }

            // Обновляем результат
            updateResult(inputs, resultValue);

            // Обработчики для каждого input
            inputs.forEach(input => {
                input.addEventListener('input', function() {
                    updateResult(inputs, resultValue);
                    saveAllData();
                });
            });

            // Настройка drag scroll
            setupDragScroll(scrollWrapper);
        });

        // Сохраняем при уходе со страницы
        window.addEventListener('beforeunload', function() {
            saveAllData();
        });
    }

    init();
})();