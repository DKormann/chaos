// lib.ts
var fromHTML = (el) => ({
  $: "NODE",
  el,
  append: (...children) => {
    children.forEach((child) => {
      if (typeof child === "string")
        el.appendChild(document.createTextNode(child));
      else
        el.appendChild(child.el);
    });
    return fromHTML(el);
  },
  style: (styles) => {
    Object.assign(el.style, styles);
    return fromHTML(el);
  },
  onclick: (handler) => {
    el.addEventListener("click", handler);
    return fromHTML(el);
  }
});
document.createElement;
var html = (tag) => (...children) => fromHTML(document.createElement(tag)).append(...children);
var div = html("div");
var span = html("span");
var p = html("p");
var body = fromHTML(document.body);
var h1 = html("h1");
var h2 = html("h2");
var h3 = html("h3");
var h4 = html("h4");
var canvas = html("canvas");
var button = html("button");

// main.ts
body.style({
  backgroundColor: "gray"
});
var can = canvas();
body.append(can);
var WIDTH = 500;
var HEIGHT = 700;
can.el.width = WIDTH;
can.el.height = HEIGHT;
can.style({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white"
});
var ctx = can.el.getContext("2d");
ctx.textAlign = "center";
var chain = [];
var addBall = (x) => chain.push({ x, v: 0 });
var freeBall;
var dot = (x, y, color) => {
  ctx.beginPath();
  ctx.arc(x + WIDTH / 2, HEIGHT - y, 20, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
};
var gameover = false;
var score = 0;
var highscore = Number(localStorage.getItem("highscore") || "0");
var coinCtr = 0;
var restart = () => {
  gameover = false;
  chain = [];
  freeBall = { x: 0, y: 1 };
  addBall(0);
  score = 0;
  coinCtr = 3;
};
restart();
var lerp = (a, b, t) => a + (b - a) * t;
var ballcolor = (i) => `hsl(${i * 15}, 100%, 50%)`;
var ballheight = (i) => i * 50 + 50;
var draw = () => {
  if (gameover)
    return requestAnimationFrame(draw);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  chain.forEach((link, i) => dot(link.x, ballheight(i), ballcolor(i)));
  if (coinCtr == 3)
    dot(freeBall.x, lerp(ballheight(chain.length), HEIGHT, freeBall.y), ballcolor(chain.length));
  else {
    ctx.beginPath();
    ctx.moveTo(freeBall.x + WIDTH / 2, HEIGHT - lerp(ballheight(chain.length), HEIGHT, freeBall.y));
    [
      { x: 0, y: 0 },
      { x: 5, y: 10 },
      { x: 15, y: 10 },
      { x: 7, y: 17 },
      { x: 8, y: 25 },
      { x: 0, y: 20 },
      { x: -8, y: 25 },
      { x: -7, y: 17 },
      { x: -15, y: 10 },
      { x: -5, y: 10 },
      { x: 0, y: 0 }
    ].forEach((offset, i) => {
      console.log(offset);
      ctx.lineTo(freeBall.x + WIDTH / 2 + offset.x, HEIGHT - lerp(ballheight(chain.length), HEIGHT, freeBall.y) + offset.y);
    });
    ctx.closePath();
    ctx.fillStyle = "#0aceff";
    ctx.fill();
  }
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, WIDTH / 2, 50);
  ctx.fillText(`Highscore: ${highscore}`, WIDTH / 2, 80);
  requestAnimationFrame(draw);
};
var inputMap = new Set;
window.addEventListener("keydown", (e) => inputMap.add(e.key));
window.addEventListener("keyup", (e) => inputMap.delete(e.key));
window.addEventListener("touchstart", (e) => {
  inputMap.clear();
  if (e.touches[0].clientX < WIDTH / 2)
    inputMap.add("ArrowLeft");
  else
    inputMap.add("ArrowRight");
});
window.addEventListener("touchend", (e) => {
  inputMap.clear();
});
draw();
var FPS = 60;
var endGame = () => {
  gameover = true;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("highscore", String(highscore));
  }
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "white";
  ctx.font = "40px sans-serif";
  ctx.fillText("Game Over", WIDTH / 2, HEIGHT / 2);
  setTimeout(() => {
    if (gameover)
      restart();
  }, 2000);
};
setInterval(() => {
  if (gameover)
    return;
  score += 1;
  let speed = 3;
  if (inputMap.has("ArrowLeft"))
    chain[0].x -= speed;
  if (inputMap.has("ArrowRight"))
    chain[0].x += speed;
  freeBall.y -= 0.001;
  if (freeBall.y < 0) {
    if (coinCtr == 3) {
      addBall(freeBall.x);
      coinCtr = 0;
    } else {
      coinCtr += 1;
      if (Math.abs(freeBall.x - chain[chain.length - 1].x) > 40) {
        endGame();
      }
    }
    freeBall.y = 1;
    freeBall.x = (Math.random() - 0.5) * 200;
  }
  chain.slice(1).forEach((link, i) => {
    let prev = chain[i];
    let dx = prev.x - link.x;
    if (Math.abs(link.x) > WIDTH / 2 - 20) {
      endGame();
    }
    let force = -dx * 0.0006;
    link.v += force;
    link.v *= 0.9;
    link.x += link.v;
  });
}, 1000 / FPS);
