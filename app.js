const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Variables

// Speed on X
speedX = 10;
// Speed on Y
speedY = 0;
// Apple
let appleX = 0;
let appleY = 0;
// Score
let score = 0;
// Bug Direction
let bugDirection = false;
// Stop Game
let stopGame = false;
// Speed travel
let speedTravel = 100;

let snake = [
	{ x: 140, y: 150 },
	{ x: 130, y: 150 },
	{ x: 120, y: 150 },
	{ x: 110, y: 150 },
];

const animation = () => {
	if (stopGame === true) {
		return;
	} else {
		setTimeout(() => {
			bugDirection = false;
			cleanCanvas();
			drawApple();
			doAdvanceSnake();
			if (endGame()) {
				restart();
				return;
			}
			drawSnake();
			// Recursive
			animation();
		}, speedTravel);
	}
};

const changeDirection = (event) => {
	// Avoid bug
	if (bugDirection) return;
	bugDirection = true;

	const ARROW_LEFT = 37;
	const ARROW_RIGHT = 39;
	const ARROW_UP = 38;
	const ARROW_DOWN = 40;

	const direction = event.keyCode;

	const toUp = speedY === -10;
	const toDown = speedY === 10;
	const toRight = speedX === 10;
	const toLeft = speedX === -10;

	// If you go right, it's forbidden to go left (no turning over)
	if (direction === ARROW_LEFT && !toRight) {
		speedX = -10;
		speedY = 0;
	}
	// If you go down, it's forbidden to go up (no turning over)
	if (direction === ARROW_UP && !toDown) {
		speedX = 0;
		speedY = -10;
	}
	// If you go left, it's forbidden to go right (no turning over)
	if (direction === ARROW_RIGHT && !toLeft) {
		speedX = 10;
		speedY = 0;
	}
	// If you go up, it's forbidden to go down (no turning over)
	if (direction === ARROW_DOWN && !toUp) {
		speedX = 0;
		speedY = 10;
	}
};

const cleanCanvas = () => {
	ctx.fillStyle = "white";
	ctx.strokeStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeRect(0, 0, canvas.width, canvas.height);
};

const createApple = () => {
	appleX = random();
	appleY = random();

	snake.forEach((piece) => {
		const snakeOnApple = piece.x === appleX && piece.y === appleY;
		if (snakeOnApple) {
			createApple();
		}
	});
};

const drawApple = () => {
	ctx.fillStyle = "red";
	ctx.strokeStyle = "darkred";
	ctx.beginPath();
	ctx.arc(appleX + 5, appleY + 5, 5, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
};

const drawPiecesSnake = (piece) => {
	ctx.fillStyle = "#00fe14";
	ctx.strokeStyle = "black";
	ctx.fillRect(piece.x, piece.y, 10, 10);
	ctx.strokeRect(piece.x, piece.y, 10, 10);
};

const drawSnake = () => {
	snake.forEach((piece) => {
		drawPiecesSnake(piece);
	});
};

const doAdvanceSnake = () => {
	const head = { x: snake[0].x + speedX, y: snake[0].y + speedY };
	snake.unshift(head);

	if (endGame()) {
		snake.shift(head);
		restart();
		stopGame = true;
		return;
	}

	const snakeEatApple = snake[0].x === appleX && snake[0].y === appleY;

	if (snakeEatApple) {
		score += 10;
		document.getElementById("score").innerHTML = score;
		speedTravel -= 1;
		createApple();
	} else {
		snake.pop();
	}
};

const endGame = () => {
	let snakeWithoutHead = snake.slice(1, -1);
	let bitten = false;
	snakeWithoutHead.forEach((piece) => {
		if (piece.x === snake[0].x && piece.y === snake[0].y) {
			bitten = true;
		}
	});

	const touchWallLeft = snake[0].x < -1;
	const touchWallRight = snake[0].x > canvas.width - 10;
	const touchWallTop = snake[0].y < -1;
	const touchWallBottom = snake[0].y > canvas.height - 10;

	let gameOver = false;

	if (bitten || touchWallLeft || touchWallRight || touchWallTop || touchWallBottom) {
		gameOver = true;
	}

	return gameOver;
};

const random = () => {
	return Math.round((Math.random() * 290) / 10) * 10;
};

const restart = () => {
	const restartEl = document.getElementById("restart");
	restartEl.style.display = "block";
	document.addEventListener("keydown", (e) => {
		if (e.keyCode === 32) {
			document.location.reload();
		}
	});
};

animation();
createApple();
drawSnake();
document.addEventListener("keydown", changeDirection);
