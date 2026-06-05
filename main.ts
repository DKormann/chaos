
import { body, canvas } from "./lib";

body.style({
  backgroundColor: "gray",
})
let can = canvas()
body.append(can);
const WIDTH = 500;
const HEIGHT = 700;
can.el.width = WIDTH;
can.el.height = HEIGHT;
can.style({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white"
})
let ctx = can.el.getContext("2d")!;


type Link = {
  x: number,
  v: number,
}

ctx.textAlign = "center";

let chain = [] as Link[];
let addBall = (x: number) => chain.push({x, v: 0});

let freeBall: {x: number, y: number};

let dot = (x:number, y:number, color:string) => {
  ctx.beginPath();
  ctx.arc(x + WIDTH /2, HEIGHT - y, 20, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

let gameover = false;
let score = 0;
let highscore = Number(localStorage.getItem("highscore") || "0");

let restart = () => {
  gameover = false;
  chain = [];
  freeBall = {x: 0, y: 1};
  addBall(0);
  score = 0;
}

restart();

let lerp = (a:number, b:number, t:number) => a + (b - a) * t;

let ballcolor = (i: number) => `hsl(${i*15}, 100%, 50%)`;
let ballheight = (i: number) => i * 50 + 50;

let draw = () => {

  if (gameover) return requestAnimationFrame(draw);
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  chain.forEach((link, i) => dot(link.x, ballheight(i), ballcolor(i)));

  dot(freeBall.x, lerp(ballheight(chain.length), HEIGHT, freeBall.y ), ballcolor(chain.length));

  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, WIDTH / 2, 50);
  ctx.fillText(`Highscore: ${highscore}`, WIDTH / 2, 80);

  requestAnimationFrame(draw);
}

let inputMap = new Set<string>();
window.addEventListener("keydown", (e) => inputMap.add(e.key))
window.addEventListener("keyup", (e) => inputMap.delete(e.key))

// window.addEventListener("click", (e) => {
//   inputMap.clear();
//   if (e.clientX < WIDTH / 2) inputMap.add("ArrowLeft")
//   else inputMap.add("ArrowRight");
//   console.log(e.clientX)
// })

window.addEventListener("touchstart", (e) => {
  inputMap.clear();
  if (e.touches[0].clientX < WIDTH / 2) inputMap.add("ArrowLeft")
  else inputMap.add("ArrowRight");
})

window.addEventListener("touchend", (e) => {
  inputMap.clear();
})

draw();

let FPS = 60;

const endGame = () => {

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

  setTimeout(()=>{
    if (gameover) restart();
  }, 2000);
}

let x = 0 as any as boolean;

setInterval(() => {

  if (gameover) return;

  score += 1;
  let speed = 3;
  if (inputMap.has("ArrowLeft")) chain[0].x -= speed;
  if (inputMap.has("ArrowRight")) chain[0].x += speed;

  freeBall.y -= 0.001;
  if (freeBall.y < 0) {
    addBall(freeBall.x);
    freeBall.y = 1;
    freeBall.x = (Math.random() - 0.5) * 200;
  }

  chain.slice(1).forEach((link, i) => {
    let prev = chain[i];
    let dx = prev.x - link.x;
    if (Math.abs(link.x) > WIDTH / 2 - 20) {endGame();}
    let force = (-dx) * 0.0006;
    link.v += force;
    link.v *= 0.9;
    link.x += link.v;
  })




}, 1000/FPS);



