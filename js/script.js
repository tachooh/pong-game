// Get the canvas element and its context
const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Constants for game elements
const paddleSpeed = 7;
const paddleHeight = 100;
const paddleWidth = 10;
const netWidth = 2;
const netHeight = 10;
const initialBallSpeed = 7;

// Game state variables
let isPaused = true;

// Paddle class definition
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

// Ball class definition
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

// Initialize game elements
const user = new Paddle(0, "white");
const com = new Paddle(canvas.width - paddleWidth, "white");
const ball = new Ball();

// Draw the net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 15) {
        ctx.fillStyle = "white";
        ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);
    }
}

// Draw text on the canvas
function drawText(text, x, y) {
    ctx.fillStyle = "#FFF";
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

// Detect collision between ball and paddle
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

// Update game logic
function update() {
    // Handle scoring and ball reset when it goes out of bounds
    if (ball.x - ball.radius < 0) {
        com.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        user.score++;
        resetBall();
    }

    // Update ball position
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // Bounce the ball off the top and bottom edges
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.velocityY = -ball.velocityY;
    }

    // Determine which player the ball collided with
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : com;

    // Handle ball-paddle collision
    if (collision(ball, player)) {
        let collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
    }

    // Update paddle positions based on user input
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

    // Ensure paddles stay within canvas boundaries
    user.y = Math.min(Math.max(user.y, 0), canvas.height - user.height);
    com.y = Math.min(Math.max(com.y, 0), canvas.height - com.height);
}

// Render game elements on the canvas
function render() {
    // Clear the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player scores
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);

    // Draw net, paddles, and ball
    drawNet();
    user.draw();
    com.draw();
    ball.draw();
}

// Main game loop
function game() {
    if (!isPaused) {
        update();
        render();
        requestAnimationFrame(game);
    }
}

// Event listeners for user input
let upPressed = false;
let downPressed = false;
let arrowUpPressed = false;
let arrowDownPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
document.addEventListener("keydown", togglePause);

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

function togglePause(event) {
    if (event.key === "Enter") {
        isPaused = !isPaused;

        // Get references to the canvas and message elements
        const canvas = document.getElementById("pong");
        const message = document.getElementById("message");

        if (isPaused) {
            drawPreview(); // Render the preview
            message.innerText = "Press Enter to Continue"; // Change the message
            message.style.display = "block"; // Show the message

            // Apply the blur effect to the canvas and add the blur-effect class
            canvas.classList.add("blur-effect");

        } else {
            message.style.display = "none"; // Hide the message
            canvas.style.display = "block"; // Show the canvas

            // Remove the blur effect by removing the blur-effect class
            canvas.classList.remove("blur-effect");

            game(); // Start the game loop
        }
    }
}

// Reset the ball to its initial state
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Alternating ball's starting direction
    ball.velocityX = (ball.velocityX > 0) ? -initialBallSpeed : initialBallSpeed;
    ball.velocityY = initialBallSpeed;
}

// Draw the preview
function drawPreview() {
    // Clear the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the net, paddles, and ball (static snapshot)
    drawNet();
    user.draw();
    com.draw();
    ball.draw();

    // Draw player scores
    drawText(user.score, canvas.width / 4, canvas.height / 5);
    drawText(com.score, 3 * canvas.width / 4, canvas.height / 5);
}

// Start the game loop
game();
