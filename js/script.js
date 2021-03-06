const $goPlay = document.getElementById('goPlay');
const $formContainer = document.getElementById('formContainer');
const $gameContainer = document.getElementById('gameContainer');
const $returnButton = document.getElementById('return');
const $username = document.getElementById('username');
const $numberRounds = document.getElementById('rounds');
const $startRound = document.getElementById('startRound');
const $repeatRound = document.getElementById('repeatRound');
const $timer = document.getElementById('timer');
const $optionsContainer = document.getElementById('gameChoose');
const $leftHand = document.getElementById('leftHand');
const $rightHand = document.getElementById('rightHand');
const $options = document.querySelectorAll('.game-choose__item');

let numberOfClicks = 0; //Numero de veces que se ha dado click a start!

const $userPoints = document.getElementById('userPoints');
const $machinePoints = document.getElementById('machinePoints');

const $currentRound = document.getElementById('currentRound');

const $ties = document.getElementById('tiesPoints');
const $totalRounds = document.getElementById('totalRounds');
const $finalMessage = document.getElementById('finalMessage');

const $showRulesButton = document.getElementById('rulesInfo');
const $frontCard = document.getElementById('frontCard');
const $backCard = document.getElementById('backCard');
const $returnGame = document.getElementById('returnGame');

//Esta lógica se aplica en la funciona drawPoints()
const rulesGame = {
    rock: {
        'scissors': 'user', //rock vs scissors = userPoint
        'papper': 'machine',//rock vs papper = machinePoint
        'rock': 'ties'//rock vs rock = tie
    }
    ,
    papper: {
        'rock': 'user',
        'scissors': 'machine',
        'papper': 'ties'
    },
    scissors: {
        'papper': 'user',
        'rock': 'machine',
        'scissors': 'ties'
    }
}


$goPlay.addEventListener('click', e => {//Submit form.
    e.preventDefault();

    if ($username.value && $username.value.trim('') !== '' && $username.value.length < 13) {

        $formContainer.classList.add('form-container--move');
        setTotalRounds();
    } else {
        alert('Type a username and do not exceed 12 characters.')
    }
});


const setTotalRounds = () => $totalRounds.textContent = $numberRounds.value;//Cambia el número total de rondas


const setCurrentRound = () => {//Cambia el número de la ronda actual
    const currentRound = parseInt($currentRound.textContent);
    const totalRounds = parseInt($totalRounds.textContent);
    if (currentRound < totalRounds) $currentRound.textContent = parseInt($currentRound.textContent) + 1;

};

const selectRockPapperScissors = $selected => {//Diseño para seleccionar piedra papel o tijera

    for (const $option of $options) {
        $option.classList.remove('game-choose__item--selected');
    }

    if ($selected)
        $selected.classList.add('game-choose__item--selected');
};

$optionsContainer.addEventListener('click', e => {
    if (e.target.classList.contains('game-choose__item') || e.target.classList.contains('game-choose__img')) {
        const selected = e.target.src ? e.target.parentElement : e.target
        selectRockPapperScissors(selected);
    }
});


const isGameOver = () => parseInt($totalRounds.textContent) === numberOfClicks;

let totalTime = 3;
const countDown = () => { //Cuenta atras
    $timer.textContent = totalTime;
    if (totalTime == 0) {
        if (!isGameOver()) $startRound.classList.remove('disabled');
        totalTime = 3;
    } else {
        totalTime--;
        setTimeout(countDown, 1000);
    }
}

const addAnimation = () => { //Agrega una clase para animar las manos

    $leftHand.classList.add('game-hands__img--left');
    $rightHand.classList.add('game-hands__img--right');

};

const removeAnimation = () => {//Remueve la clase de la animación.
    $leftHand.classList.remove('game-hands__img--left');
    $rightHand.classList.remove('game-hands__img--right');
};

const randomNumber = () => Math.round(Math.random() * 2); //Retorna un número del 1 al 3 aleatoriamente.

const randomSelection = () => ['rock', 'papper', 'scissors'][randomNumber()]; //Retorna el un string del array aleatoriamente.

const userSelection = () =>//Retorna el elemento html que el usuario haya seleccionado.
    [...$options].find($option => $option.classList.contains('game-choose__item--selected'));

const drawOptionSelected = (userMove = 'rock', machineMove = 'rock') => {//Cambia la imagen de las manos de acuerdo a la elección del usuario y la maquina.
    $leftHand.src = `assets/img/${userMove}Left.svg`;
    $rightHand.src = `assets/img/${machineMove}Right.svg`;
};

const drawPoints = (userMove, machineMove) => {//Actualiza los puntos de acuerdo a los resultados.
    if (!userMove) {//Si el usuario no selecciona ninguna opcion.
        $machinePoints.textContent = parseInt($machinePoints.textContent) + 1;
        document.getElementById('machineHandContainer').classList.add('game-hands__hand--winner');
    } else {
        const winnerElementScore = document.getElementById(`${rulesGame[userMove][machineMove]}Points`);
        const winnerHand = document.getElementById(`${rulesGame[userMove][machineMove]}HandContainer`);
        winnerElementScore.textContent = parseInt(winnerElementScore.textContent) + 1;
        if (winnerHand) winnerHand.classList.add('game-hands__hand--winner');
    }
};

const resetGame = () => {//Resetea todos los valores cambiados.

    numberOfClicks = 0;
    $currentRound.textContent = 1;
    $userPoints.textContent = 0;
    $ties.textContent = 0;
    $machinePoints.textContent = 0;
    $finalMessage.textContent = '';
    $startRound.classList.remove('disabled');
    $repeatRound.classList.add('disabled');
    $leftHand.src = 'assets/img/rockLeft.svg';
    $rightHand.src = 'assets/img/rockRight.svg'

    for (const handContainer of document.querySelectorAll('.game-hands__hand')) handContainer.classList.remove('game-hands__hand--winner');
};

$returnButton.addEventListener('click', () => {//Flecha para volver al form.
    $formContainer.classList.remove('form-container--move');

    resetGame();
});

const finalMessage = (message, color) => {
    $finalMessage.style.color = color;
    $finalMessage.textContent = message;
};

const finishGame = () => {//Muestra al usuario cuando ha ganado o perdido la partida.

    const userPoints = parseInt($userPoints.textContent);
    const machinePoints = parseInt($machinePoints.textContent);

    if (parseInt($currentRound.textContent) === parseInt($totalRounds.textContent)) {

        switch (true) {
            case userPoints < machinePoints:
                finalMessage(`¡The machine has won!`, '#ff1b1b')
                break;
            case userPoints > machinePoints:
                finalMessage(`¡You have won, ${$username.value}!`, '#0bab64')
                break;
            default:
                finalMessage(`¡You have Tied!`, '#fefeff')
                break;
        }

        $repeatRound.classList.remove('disabled');
        $startRound.classList.add('disabled');
    }
};



const disabledOptions = () => {//Deshabilita las manos a elegir
    for (const option of $options) option.classList.add('disabled');
};

const enabledOptions = () => {//Habilita las manos a elegir
    for (const option of $options) option.classList.remove('disabled');
};

const disabledReturn = () => $returnButton.classList.add('disabled'); //Deshabilita el boton para regresar al form.

const enabledReturn = () => $returnButton.classList.remove('disabled');//Habilita el boton para regresar al form.

//Rotar el contenedor.
$showRulesButton.addEventListener('click', () => $gameContainer.classList.add('rotate'));
$returnGame.addEventListener('click', () => $gameContainer.classList.remove('rotate'));

const initGame = () => {

    enabledOptions();
    drawOptionSelected();
    countDown();
    addAnimation();
    disabledReturn();

    for (const handContainer of document.querySelectorAll('.game-hands__hand')) handContainer.classList.remove('game-hands__hand--winner');

    setTimeout(() => {

        const userMove = userSelection() ? userSelection().dataset.option : undefined;
        const machineMove = randomSelection();

        removeAnimation();
        drawOptionSelected(userMove, machineMove);
        selectRockPapperScissors();
        drawPoints(userMove, machineMove);
        finishGame();
        setCurrentRound();
        disabledOptions();
        enabledReturn();
    }, 3000);
}

$startRound.addEventListener('click', e => {
    numberOfClicks++;
    $startRound.classList.add('disabled');
    initGame();
});

$repeatRound.addEventListener('click', () => {
    resetGame();
    initGame();
    numberOfClicks++;
    $startRound.classList.add('disabled');
});
