const media = window.matchMedia('(max-width: 768px)');

// ИСПРАВЛЕНО: функция должна принимать элемент и применять класс к pol1
function Class(e) {
    const el = document.getElementById('pol1'); // Находим конкретный элемент
    if (e.matches) {
        el.classList.remove('pol1');
    } else {
        el.classList.add('pol1');
    }
}
Class(media);
media.addEventListener('change', Class);

document.getElementById('play').addEventListener('click', function(){
    const pol1 = document.getElementById('pol1');
    const pol2 = document.getElementById('pol2');
    pol1.classList.add('nowid');
    pol2.classList.remove('nowid');
    resetGame();
});

document.getElementById('esc').addEventListener('click', function(){
    const pol1 = document.getElementById('pol1');
    const pol2 = document.getElementById('pol2');
    pol2.classList.add('nowid');
    pol1.classList.remove('nowid');
    stopGame(); // Останавливаем игру при выходе
});

// ========== ИГРА "ЗАПОМНИ КОМБИНАЦИЮ" ==========

const grid = document.getElementById('myGrid');
let cells = [];
let sequence = [];      // Последовательность для запоминания
let playerSequence = []; // Что нажал игрок
let level = 1;          // Уровень (длина последовательности)
let score = 0;          // Счёт
let isPlaying = false;  // Идёт ли игра
let isShowingSequence = false; // Показывается ли последовательность
let canClick = false;   // Можно ли кликать

// Создаём ячейки 3x3
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.addEventListener('click', () => onCellClick(i));
    grid.appendChild(cell);
    cells.push(cell);
}

// Элементы UI
const numberEl = document.getElementById('number');
const shetEl = document.getElementById('shet');
const startBtn = document.getElementById('start');
const restartBtn = document.getElementById('restart');

// Функция подсветки ячейки
function highlightCell(index, color = '#4CAF50') {
    const cell = cells[index];
    const originalBg = cell.style.backgroundColor;
    cell.style.backgroundColor = color;
    cell.style.transition = '0.2s';
    setTimeout(() => {
        cell.style.backgroundColor = '';
    }, 400);
}

// Показать последовательность
async function showSequence() {
    if (!isPlaying) return; // Если игра остановлена, не показываем

    isShowingSequence = true;
    canClick = false;

    for (let i = 0; i < sequence.length; i++) {
        // Проверка, не остановлена ли игра во время показа
        if (!isPlaying) return;
        const cellIndex = sequence[i];
        highlightCell(cellIndex, '#4CAF50');
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    isShowingSequence = false;
    canClick = true;
}

// Генерация следующего шага последовательности
function addToSequence() {
    const randomIndex = Math.floor(Math.random() * 9);
    sequence.push(randomIndex);
}

// Проверка ответа игрока
function checkPlayerMove(index) {
    if (!canClick || isShowingSequence) return false;

    const expectedIndex = sequence[playerSequence.length];

    if (index === expectedIndex) {
        // Правильный ход
        highlightCell(index, '#4CAF50');
        playerSequence.push(index);

        // Если последовательность полностью повторена
        if (playerSequence.length === sequence.length) {
            // Правильно! + очки
            score += 10 * level;
            updateUI();

            // Переход на следующий уровень
            level++;
            playerSequence = [];
            addToSequence();
            updateUI();

            // Показываем новую последовательность
            setTimeout(() => {
                // Проверка, не остановлена ли игра
                if (isPlaying) {
                    showSequence();
                }
            }, 500);
        }
        return true;
    } else {
        // Неправильный ход - штраф и конец игры
        highlightCell(index, '#f44336');
        score = Math.max(0, score - 5);
        updateUI();

        // Игра окончена
        gameOver();
        return false;
    }
}

// Клик по ячейке
function onCellClick(index) {
    if (!isPlaying || isShowingSequence || !canClick) return;
    checkPlayerMove(index);
}

// Конец игры
function gameOver() {
    isPlaying = false;
    canClick = false;

    // Подсветка всех ячеек красным
    cells.forEach((_, i) => {
        highlightCell(i, '#f44336');
    });

    setTimeout(() => {
        alert(`Игра окончена!\nВаш счёт: ${score}\nУровень: ${level}`);
    }, 300);
}

// Обновление UI
function updateUI() {
    numberEl.textContent = `Уровень: ${level}`;
    shetEl.textContent = `Счёт: ${score}`;
}

// Сброс игры (полный)
function resetGame() {
    sequence = [];
    playerSequence = [];
    level = 1;
    score = 0;
    isPlaying = false;
    isShowingSequence = false;
    canClick = false;

    updateUI();

    // Очистка подсветки ячеек
    cells.forEach(cell => {
        cell.style.backgroundColor = '';
    });
}

// Старт игры
function startGame() {
    if (isPlaying) return;

    resetGame();        // Полностью сбрасываем всё
    addToSequence();    // Генерируем первую последовательность
    updateUI();

    isPlaying = true;

    // Показываем последовательность
    setTimeout(() => {
        if (isPlaying) {
            showSequence();
        }
    }, 500);
}

// ========== НОВАЯ ФУНКЦИЯ: ПОВТОРИТЬ ПОСЛЕДНЮЮ КОМБИНАЦИЮ ==========
function repeatLastCombination() {
    if (!isPlaying) return; // Игра не активна

    // Останавливаем текущие процессы (показ последовательности или ожидание клика)
    isShowingSequence = false;
    canClick = false;
    playerSequence = []; // Сбрасываем введённую игроком последовательность

    // Показываем текущую последовательность (последнюю комбинацию) заново
    setTimeout(() => {
        if (isPlaying) {
            showSequence();
        }
    }, 100);
}

// Остановка игры
function stopGame() {
    isPlaying = false;
    isShowingSequence = false;
    canClick = false;
}

// Обработчики кнопок
startBtn.addEventListener('click', startGame);

// ИСПРАВЛЕНА КНОПКА "ЗАНОВО": повторяет последнюю комбинацию
restartBtn.addEventListener('click', () => {
    if (isPlaying) {
        repeatLastCombination(); // Повторяем комбинацию
    } else {
        // Если игра не активна, можно просто сбросить (или ничего не делать)
        resetGame();
    }
});