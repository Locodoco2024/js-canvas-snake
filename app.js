const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContxt() 會回傳canvas的drawing context
// drawing context可用來在canvas內畫圖
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = []; // array中的每個元素都是一個物件
// 物件的作用是儲存身體的(x,y)座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 使用class製作果實
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }
  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  fruitsNewLocation() {
    let overLapping = false;
    let new_x;
    let new_y;

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverLap(new_x, new_y);
    } while (overLapping);

    this.x = new_x;
    this.y = new_y;

    function checkOverLap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overLapping = true;
          return;
        } else {
          overLapping = false;
        }
      }
    }
  }
}
// game初始設定
createSnake();
let Fruits = new Fruit();
let myGame = setInterval(draw, 100);
let d = "Right";
window.addEventListener("keydown", changeDirection);
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
let highestScore;
loadHighestScore();
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;

function draw() {
  // 每次畫圖之前，檢查蛇是否碰到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
      clearInterval(myGame);
      alert("遊戲結束!");
      return;
    }
  }
  // 每次執行draw都將canvas整張範圍用black覆蓋
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 畫果實
  Fruits.drawFruit();
  // 畫蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    ctx.strokeStyle = "white";
    // 蛇碰到邊界時，讓蛇頭從x或y的0開始
    if (snake[i].x >= canvas.width) {
      // x=canvas.width時已經在畫布外
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      // y=canvas.height時已經在畫布外
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); // 填滿矩形，參數為x, y, width, height
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); // 填滿矩形外框
  }

  // 以當前變數d的方向，來決定蛇的下一秒放在哪個座標
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;
  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }
  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  if (snake[0].x == Fruits.x && snake[0].y == Fruits.y) {
    Fruits.fruitsNewLocation(); // method更新果實位置 且 不與蛇重複
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}
// 事件監聽Fn改變方向 + 不能回頭
function changeDirection(e) {
  if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  }
  // 在下一秒更新畫布前，不接受任何keydown事件，防止快速按鍵產生違反邏輯的操作
  window.removeEventListener("keydown", changeDirection);
}

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
