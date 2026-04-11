//  ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ
const media = window.matchMedia('(max-width: 768px)');

function Class(e) {
    const el = document.getElementById('pol1');
    if (e.matches) {
        el.classList.remove('pol1');
    } else {
        el.classList.add('pol1');
    }
}
Class(media);
media.addEventListener('change', Class);

//  ПЕРЕМЕННЫЕ ИГРЫ
let score = 0;
let level = 1;
let timeLeft = 60;
let gameInterval;
let colorInterval;
let isGameRunning = false;
let isClickBlocked = false;
const totalCells = 30; // 5x6 = 30 ячеек для десктопа
let cellsCount = totalCells;

// Элементы интерфейса
const gameScoreElement = document.getElementById('gameScore');
const gameLevelElement = document.getElementById('gameLevel');
const gameTimerElement = document.getElementById('gameTimer');

// Цвета для ячеек
const colors = [
    { class: 'bg-success', points: 1, text: '✅' },    // Зеленый - +1
    { class: 'bg-danger', points: -1, text: '❌' },    // Красный - -1
    { class: 'bg-warning', points: 0, text: '⚡' }     // Желтый - 0
];

//  СОЗДАНИЕ ИГРОВОГО ПОЛЯ
function createGameGrid() {
    const container = document.getElementById('gameCellsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    
    if (isMobile) {
        // Мобильная версия: 3x3 = 9 ячеек
        cellsCount = 15;
        for (let i = 0; i < cellsCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell bg-secondary text-white';
            cell.dataset.index = i;
            cell.dataset.points = 0;
            
            const span = document.createElement('span');
            span.id = `cell-content-${i}`;
            span.textContent = '⚡';
            span.style.fontSize = '1rem';
            
            cell.appendChild(span);
            container.appendChild(cell);
        }
    } else {
        // Десктоп версия: 5x6 = 30 ячеек
        cellsCount = 30;
        for (let i = 0; i < cellsCount; i++) {
            const cell = document.createElement('div');
            cell.className = 'game-cell bg-secondary text-white';
            cell.dataset.index = i;
            cell.dataset.points = 0;
            
            const span = document.createElement('span');
            span.id = `cell-content-${i}`;
            span.textContent = '⚡';
            
            cell.appendChild(span);
            container.appendChild(cell);
        }
    }
    
    addCellClickHandlers();
}

function addCellClickHandlers() {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach((cell, index) => {
        // Удаляем старый обработчик через клон
        const newCell = cell.cloneNode(true);
        cell.parentNode.replaceChild(newCell, cell);
        
        // Добавляем новый обработчик
        newCell.addEventListener('click', () => handleCellClick(index));
    });
}

//  ОБРАБОТКА КЛИКА
function handleCellClick(cellIndex) {
    if (!isGameRunning || isClickBlocked) return;
    
    isClickBlocked = true;
    
    const cells = document.querySelectorAll('.game-cell');
    const cell = cells[cellIndex];
    const currentColorClass = getCurrentColorClass(cell);
    
    // Проверяем цвет ячейки
    if (currentColorClass === 'bg-success') {
        // Зеленая - правильный клик
        score += 1;
        cell.classList.add('correct');
        setTimeout(() => cell.classList.remove('correct'), 300);
    } else if (currentColorClass === 'bg-danger') {
        // Красная - неправильный клик
        score -= 1;
        cell.classList.add('incorrect');
        setTimeout(() => cell.classList.remove('incorrect'), 300);
    }
    // Желтую игнорируем
    
    updateScore();
    
    setTimeout(() => {
        isClickBlocked = false;
    }, 300);
}

function getCurrentColorClass(cell) {
    if (cell.classList.contains('bg-success')) return 'bg-success';
    if (cell.classList.contains('bg-danger')) return 'bg-danger';
    if (cell.classList.contains('bg-warning')) return 'bg-warning';
    return '';
}

// ОБНОВЛЕНИЕ СЧЕТА
function updateScore() {
    if (gameScoreElement) gameScoreElement.textContent = score;
    

    const newLevel = Math.floor(score / 5) + 1;
    if (newLevel !== level) {
        level = newLevel;
        if (gameLevelElement) gameLevelElement.textContent = level;
    }
}

//  СМЕНА ЦВЕТОВ ЯЧЕЕК
function changeColors() {
    const cells = document.querySelectorAll('.game-cell');
    cells.forEach(cell => {
        cell.classList.remove('bg-success', 'bg-danger', 'bg-warning', 'correct', 'incorrect');
        
        const random = Math.random();
        let color;
        
        if (random < 0.4) {
            color = colors[1]; // Красный 40%
        } else if (random < 0.8) {
            color = colors[2]; // Желтый 40%
        } else {
            color = colors[0]; // Зеленый 20%
        }
        
        cell.classList.add(color.class);
        const span = cell.querySelector('span');
        if (span) span.textContent = color.text;
    });
}

//  ТАЙМЕР
function updateTimer() {
    timeLeft--;
    if (gameTimerElement) gameTimerElement.textContent = timeLeft;
    
    if (timeLeft <= 0) {
        endGame();
    }
}

// НАЧАЛО ИГРЫ
function startGame() {
    score = 0;
    level = 1;
    timeLeft = 60;
    isGameRunning = true;
    isClickBlocked = false;
    
    // Создаем поле
    createGameGrid();
    updateScore();
    
    // Запускаем интервалы
    clearIntervals();
    
    gameInterval = setInterval(updateTimer, 1000);
    colorInterval = setInterval(changeColors, 2000);
    
    // Первая смена цветов
    setTimeout(() => changeColors(), 100);
}

function clearIntervals() {
    if (gameInterval) clearInterval(gameInterval);
    if (colorInterval) clearInterval(colorInterval);
}

//  СБРОС ИГРЫ
function resetGame() {
    clearIntervals();
    startGame();
}

//  ОКОНЧАНИЕ ИГРЫ
function endGame() {
    isGameRunning = false;
    clearIntervals();
    
    let rating = '';
    if (score <= 10) rating = 'Низкий';
    else if (score <= 20) rating = 'Средний';
    else rating = 'Высокий';
    
    alert(`Игра окончена!\n\n Ваш счет: ${score}\n Уровень: ${level}\n Оценка: ${rating}\n\n Зеленые: +1 балл\n Красные: -1 балл\n Желтые: 0 баллов`);
}

//  ОСТАНОВКА ИГРЫ (выход)
function stopGame() {
    isGameRunning = false;
    clearIntervals();
}

//ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ЭКРАНАМИ
document.getElementById('playBtn').addEventListener('click', function() {
    const pol1 = document.getElementById('pol1');
    const pol2 = document.getElementById('pol2');
    pol1.classList.add('nowid');
    pol2.classList.remove('nowid');
    startGame();
});

document.getElementById('exitBtn').addEventListener('click', function() {
    const pol1 = document.getElementById('pol1');
    const pol2 = document.getElementById('pol2');
    pol2.classList.add('nowid');
    pol1.classList.remove('nowid');
    stopGame();
});

document.getElementById('resetGameBtn').addEventListener('click', function() {
    if (isGameRunning) {
        resetGame();
    } else {
        startGame();
    }
});

//  АДАПТАЦИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА
function handleResize() {
    if (isGameRunning) {
        const currentScore = score;
        const currentLevel = level;
        const currentTime = timeLeft;
        
        createGameGrid();
        changeColors();
        
        score = currentScore;
        level = currentLevel;
        timeLeft = currentTime;
        updateScore();
        if (gameTimerElement) gameTimerElement.textContent = timeLeft;
    } else {
        createGameGrid();
    }
}

window.addEventListener('resize', handleResize);

//  ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    createGameGrid();
});