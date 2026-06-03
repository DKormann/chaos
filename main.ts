import { body,  fromHTML,  p } from "./lib";

body
.style({
  backgroundColor: "#000",
  padding: "20px",
  color: "white",
  fontFamily: "sans-serif"
})

// let svgPendul
type Pos = {
  x: number,
  y: number
}
const S = 500;
const R = S/2;
const L = R*0.8;


let canvas = document.createElement("canvas");
canvas.width = S;
canvas.height = S;
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d")!;

const draw = (P1: Pos, P2: Pos) =>{

  let dot = (x:number, y:number, color:string) => {
    ctx.beginPath();
    ctx.rect(x, y, 5, 5);
    ctx.fillStyle = color;
    ctx.fill();
  }


  let snake = (H:number[],c:number) => H.forEach((h,i) => {
    dot(R + h, R*2-i , `hsl(${c}, 100%, 50%)`)
  })

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake(H1, 0.1);
  snake(H2, 200);

}



let H1 : number[] = [];
let H2 : number[] = [];


let f1 = R /2
let f2 = Math.PI / 2;

let a1 = 0;
let a2 = 0;

let increment = (d:number)=>{
  a1 -= (f1 - 0) * d
  a1 -= (f1 - f2) * d
  a2 -= (f2 - f1) * d
  a2 -= (f2 - 0) * d
  f1 += a1 * d;
  f2 += a2 * d;

  H1 = [...H1, f1].slice(-S);
  H2 = [...H2, f2].slice(-S);
}

let update = () => {
  draw({x: R + f1,y: L},{x: R + f1 + f2,y: L})
  requestAnimationFrame(update);
}

update();

let D = 400;

setInterval(() => {
  increment(2 / D);
}, 1000 / D);




