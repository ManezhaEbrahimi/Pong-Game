const canvas = document.getElementById("pong");
    const ctx = canvas.getContext("2d");

    // Ball
    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 10,
      speed: 5,
      velocityX: 5,
      velocityY: 5,
      color: "#00ff99",
    };

    // Players
    const player1 = {
      x: 0,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      color: "#ff5555",
      score: 0,
      dy: 0,
    };

    const player2 = {
      x: canvas.width - 10,
      y: canvas.height / 2 - 50,
      width: 10,
      height: 100,
      color: "#5555ff",
      score: 0,
      dy: 0,
    };

    function drawRect(x, y, w, h, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }

    function drawBall(x, y, r, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.fill();
    }

    function drawScore(text, x, y) {
      ctx.fillStyle = "#fff";
      ctx.font = "30px Arial";
      ctx.fillText(text, x, y);
    }

    function moveBall() {
      ball.x += ball.velocityX;
      ball.y += ball.velocityY;

      // Ball collision with top/bottom
      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
      }

      // Paddle collision
      let player = ball.x < canvas.width / 2 ? player1 : player2;
      if (
        ball.x + ball.radius > player.x &&
        ball.x - ball.radius < player.x + player.width &&
        ball.y + ball.radius > player.y &&
        ball.y - ball.radius < player.y + player.height
      ) {
        // Calculate hit position
        let collidePoint = (ball.y - (player.y + player.height / 2));
        collidePoint = collidePoint / (player.height / 2);
        // Calculate angle in Radian (max 45deg)
        let angleRad = collidePoint * (Math.PI / 4);
        // Direction
        let direction = ball.x < canvas.width / 2 ? 1 : -1;
        // Change velocity
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        // Slightly increase speed
        ball.speed += 0.2;
      }

      // Scoring
      if (ball.x - ball.radius < 0) {
        player2.score++;
        resetBall(-1);
      } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        resetBall(1);
      }
    }

    function resetBall(direction = 1) {
      ball.x = canvas.width / 2;
      ball.y = canvas.height / 2;
      ball.speed = 5;
      // Randomize initial angle
      let angle = (Math.random() * Math.PI / 2) - (Math.PI / 4);
      ball.velocityX = direction * ball.speed * Math.cos(angle);
      ball.velocityY = ball.speed * Math.sin(angle);
    }

    function movePlayers() {
      player1.y += player1.dy;
      player2.y += player2.dy;

      // Keep paddles inside canvas
      if (player1.y < 0) player1.y = 0;
      if (player1.y + player1.height > canvas.height) player1.y = canvas.height - player1.height;
      if (player2.y < 0) player2.y = 0;
      if (player2.y + player2.height > canvas.height) player2.y = canvas.height - player2.height;
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "w") player1.dy = -7;
      if (e.key === "s") player1.dy = 7;
      if (e.key === "ArrowUp") player2.dy = -7;
      if (e.key === "ArrowDown") player2.dy = 7;
    });

    document.addEventListener("keyup", (e) => {
      if (e.key === "w" || e.key === "s") player1.dy = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowDown") player2.dy = 0;
    });

    function draw() {
      drawRect(0, 0, canvas.width, canvas.height, "#222");
      // Middle line
      for (let i = 0; i < canvas.height; i += 20) {
        drawRect(canvas.width / 2 - 1, i, 2, 10, "#fff");
      }
      // Scores
      drawScore(player1.score, canvas.width / 4, 50);
      drawScore(player2.score, (3 * canvas.width) / 4, 50);
      // Paddles and ball
      drawRect(player1.x, player1.y, player1.width, player1.height, player1.color);
      drawRect(player2.x, player2.y, player2.width, player2.height, player2.color);
      drawBall(ball.x, ball.y, ball.radius, ball.color);
    }

    function update() {
      moveBall();
      movePlayers();
    }

    function gameLoop() {
      draw();
      update();
      requestAnimationFrame(gameLoop);
    }

    // Start game
    gameLoop();