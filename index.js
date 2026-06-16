const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const points = [0, 0];

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function generateRndVelocity(){
  return (getRndInteger(-1, 0) == -1) ? -1 : 1;
}

class pongClass {
  constructor(isLeft){
    this.Properties = {};
    
    this.Properties.isLeft = isLeft;
    this.Properties.Position = canvas.height/2;
    this.Properties.Velocity = 0;
  }
}

class ballClass {
  constructor(positionX, positionY, velocityX, velocityY){
    this.Properties = {};
    
    this.Properties.Velocity = {
      X: velocityX, Y: velocityY
    };
    this.Properties.Position = {
      X: positionX, Y: positionY
    };
  }
  InverseX(){ this.Properties.Velocity.X *= -1 }
  InverseY(){ this.Properties.Velocity.Y *= -1 }
}

const ball = new ballClass(canvas.width/2, canvas.height/2, generateRndVelocity(), generateRndVelocity());
const pongs = [new pongClass(true), new pongClass(false)];

function bounce(ball){
  if (ball.Properties.Position.Y == 0 || ball.Properties.Position.Y == canvas.height){
    ball.InverseY();
  }
  
  for (i = 0; i < pongs.length; i++){
    let pong = pongs[i];
    
    let x = (pong.Properties.isLeft) ? (4 + 5) : (canvas.width - 8 - 5);
    
    //if (x == ball.Properties.Position.X){
    if (Math.abs(x - ball.Properties.Position.X) < 2){
      if (Math.abs(ball.Properties.Position.Y - pong.Properties.Position) < (15 + 2)){
        ball.InverseX();
        
        ball.Properties.Velocity.X *= 1.05
        ball.Properties.Velocity.Y *= 1.05
      }
    }
  }
}

function calculate(){
  for (i = 0; i < pongs.length; i++){
    let pong = pongs[i];
    let v = pong.Properties.Velocity;
    
    pong.Properties.Position = Math.min(Math.max(pong.Properties.Position + v, 15), (canvas.height - 15));
  }
  
  let v = ball.Properties.Velocity.X;
  ball.Properties.Position.X = Math.min(Math.max(ball.Properties.Position.X + v, 0), (canvas.width - 0));
  
  v = ball.Properties.Velocity.Y;
  ball.Properties.Position.Y = Math.min(Math.max(ball.Properties.Position.Y + v, 0), (canvas.height - 0));
}

function drawBall(ball){
  ctx.fillRect(ball.Properties.Position.X - 5, ball.Properties.Position.Y - 5, 10, 10);
}

function drawPong(pong){
  let x = (pong.Properties.isLeft) ? (4) : (canvas.width - 8);
  ctx.fillRect(x, pong.Properties.Position - 15, 4, 30);
}

function checkWin(ball){
  if (ball.Properties.Position.X == 0){
    points[1] += 1;
  } else if (ball.Properties.Position.X == canvas.width){
    points[0] += 1;
  } else {
    return;
  }
  
  ball.Properties.Velocity.X = 0;
  ball.Properties.Velocity.Y = 0;
  
  ball.Properties.Position.X = canvas.width/2;
  ball.Properties.Position.Y = canvas.height/2;
  for (i = 0; i < pongs.length; i++){
    let pong = pongs[i];
    pong.Properties.Position = canvas.height/2;
  }
  
  setTimeout(function(){
    ball.Properties.Velocity.X = generateRndVelocity();
    ball.Properties.Velocity.Y = generateRndVelocity();
  }, 1000)
}

setInterval(function(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  
  ctx.font = "48px serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  ctx.strokeText(points[0], canvas.width/4, canvas.height/2);
  ctx.strokeText(points[1], canvas.width * 3/4, canvas.height/2);
  
  bounce(ball);
  calculate();
  
  drawBall(ball);
  
  drawPong(pongs[0]);
  drawPong(pongs[1]);
  
  checkWin(ball);
}, 10);

window.addEventListener("keydown", e=> {
  if (e.key == "w"){
    pongs[0].Properties.Velocity = -1;
  } else if (e.key == "s"){
    pongs[0].Properties.Velocity = 1;
  } else if (e.key == "ArrowUp"){
    pongs[1].Properties.Velocity = -1;
  } else if (e.key == "ArrowDown"){
    pongs[1].Properties.Velocity = 1;
  }
});

window.addEventListener("keyup", e=> {
  if (e.key == "w" && pongs[0].Properties.Velocity == -1){
    pongs[0].Properties.Velocity = 0;
  } else if (e.key == "s" && pongs[0].Properties.Velocity == 1){
    pongs[0].Properties.Velocity = 0;
  } else if (e.key == "ArrowUp" && pongs[1].Properties.Velocity == -1){
    pongs[1].Properties.Velocity = 0;
  } else if (e.key == "ArrowDown" && pongs[1].Properties.Velocity == 1){
    pongs[1].Properties.Velocity = 0;
  }
});
