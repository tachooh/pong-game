const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

const ballSpeedIncrement = 0.1;
const paddleSpeed = 7;
const paddleHeight = 100;
const paddleWidth = 10;
const netWidth = 2;
const netHeight = 10;
const initialBallSpeed = 7;

class Paddle {
    constructor(x, color) {
        this.x = x;
        this.y = (canvas.height - paddleHeight) / 2;
        this.width = paddleWidth;
        this.height = paddleHeight;
        this.score = 0;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Ball {
    constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 10;
        this.velocityX = initialBallSpeed;
        this.velocityY = initialBallSpeed;
        this.speed = initialBallSpeed;
        this.color = "white";
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

const user = new Paddle(0, "white");
const com = new Paddle(canvas.width - paddleWidth, "white");
const ball = new Ball();

function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);
    }
}

function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function update() {
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        ball.speed += ballSpeedIncrement;
    }

    if (upPressed) {
        user.y -= paddleSpeed;
    } else if (downPressed) {
        user.y += paddleSpeed;
    }

    if (arrowUpPressed) {
        com.y -= paddleSpeed;
    } else if (arrowDownPressed) {
        com.y += paddleSpeed;
    }

    user.y = Math.min(Math.max(user.y, 0), canvas.height - user.height);
    com.y = Math.min(Math.max(com.y, 0), canvas.height - com.height);
}

function render() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
    drawNet();
    user.draw();
    com.draw();
    ball.draw();
}

function game() {
    update();
    render();
    requestAnimationFrame(game);
}

let upPressed = false;
let downPressed = false;
let arrowUpPressed = false;
let arrowDownPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === "w") upPressed = true;
    else if (event.key === "s") downPressed = true;
    if (event.key === "ArrowUp") arrowUpPressed = true;
    else if (event.key === "ArrowDown") arrowDownPressed = true;
}

function keyUpHandler(event) {
    if (event.key === "w") upPressed = false;
    else if (event.key === "s") downPressed = false;
    if (event.key === "ArrowUp") arrowUpPressed = false;
    else if (event.key === "ArrowDown") arrowDownPressed = false;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}

game();