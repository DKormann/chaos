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
var html = (tag) => (...children) => fromHTML(document.createElement(tag)).append(...children);
var div = html("div");
var span = html("span");
var p = html("p");
var body = fromHTML(document.body);
var h1 = html("h1");
var h2 = html("h2");
var h3 = html("h3");
var h4 = html("h4");
var button = html("button");

// main.ts
body.style({
  backgroundColor: "#000",
  padding: "20px",
  color: "white",
  fontFamily: "sans-serif"
});
var S = 500;
var R = S / 2;
var L = R * 0.8;
var canvas = document.createElement("canvas");
canvas.width = S;
canvas.height = S;
document.body.appendChild(canvas);
var ctx = canvas.getContext("2d");
var draw = (P1, P2) => {
  let dot = (x, y, color) => {
    ctx.beginPath();
    ctx.rect(x, y, 5, 5);
    ctx.fillStyle = color;
    ctx.fill();
  };
  let snake = (H, c) => H.forEach((h, i) => {
    dot(R + h, R * 2 - i, `hsl(${c}, 100%, 50%)`);
  });
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  snake(H1, 0.1);
  snake(H2, 200);
};
var H1 = [];
var H2 = [];
var f1 = R / 2;
var f2 = Math.PI / 2;
var a1 = 0;
var a2 = 0;
var increment = (d) => {
  a1 -= (f1 - 0) * d;
  a1 -= (f1 - f2) * d;
  a2 -= (f2 - f1) * d;
  a2 -= (f2 - 0) * d;
  f1 += a1 * d;
  f2 += a2 * d;
  H1 = [...H1, f1].slice(-S);
  H2 = [...H2, f2].slice(-S);
};
var update = () => {
  draw({ x: R + f1, y: L }, { x: R + f1 + f2, y: L });
  requestAnimationFrame(update);
};
update();
var D = 400;
setInterval(() => {
  increment(2 / D);
}, 1000 / D);
