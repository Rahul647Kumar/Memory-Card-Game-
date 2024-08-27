document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.memory_card');
    let hasFlippedCard = false;
    let firstCard, secondCard;
    let lockBoard = false;
    let moves = 0;
    let timerStarted = false;
    let startTime, timerInterval;

    function flipCard() {
        if (lockBoard || this === firstCard) return;
        this.classList.add('flip');
        moves++;
        document.getElementById('move-count').textContent = moves;

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.name === secondCard.dataset.name;
        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
        if (document.querySelectorAll('.memory_card:not(.flip)').length === 0) {
            endGame();
        }
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function startTimer() {
        if (!timerStarted) {
            timerStarted = true;
            startTime = Date.now();
            timerInterval = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor(elapsedTime / 1000) % 60;
        let minutes = Math.floor(elapsedTime / (1000 * 60));
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    function endGame() {
        clearInterval(timerInterval);
        document.getElementById('final-moves').textContent = moves;
        document.getElementById('final-time').textContent = document.getElementById('timer').textContent;
        document.getElementById('congratulations').classList.add('show');
    }

    function shuffle() {
        cards.forEach(card => {
            let randPos = Math.floor(Math.random() * cards.length);
            card.style.order = randPos;
        });
    }

    function resetGame() {
        cards.forEach(card => card.classList.remove('flip'));
        shuffle();
        moves = 0;
        document.getElementById('move-count').textContent = moves;
        startTimer();
        document.getElementById('congratulations').classList.remove('show');
    }

    cards.forEach(card => card.addEventListener('click', flipCard));
    document.getElementById('new-game').addEventListener('click', resetGame);

    shuffle();
});
