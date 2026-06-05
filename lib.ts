

export type NODE <H extends HTMLElement = HTMLElement> =  {
  $ : "NODE",
  el: H,
  append: (...children: (NODE | string)[]) => NODE,
  style: (styles: Partial<CSSStyleDeclaration>) => NODE
  onclick: (handler: (event: MouseEvent) => void) => NODE
}

export const fromHTML  = <H extends HTMLElement>  (el:H): NODE <H> => ({
  $: "NODE",
  el,
  append: (...children:(NODE| string)[]) => {
    children.forEach(child => {
      if (typeof child === "string") el.appendChild(document.createTextNode(child));
      else el.appendChild(child.el);

    });
    return fromHTML(el);
  },
  style: (styles: Partial<CSSStyleDeclaration>) => {
    Object.assign(el.style, styles);
    return fromHTML(el);
  },
  onclick: (handler: (event: MouseEvent) => void) => {
    el.addEventListener("click", handler);
    return fromHTML(el);
  }
})

document.createElement

const html = <K extends keyof HTMLElementTagNameMap> (tag:K) => (...children:(NODE|string)[]): NODE <HTMLElementTagNameMap[K]> => fromHTML (document.createElement(tag)).append(...children) as NODE <HTMLElementTagNameMap[K]>;

export const div = html("div");
export const span = html("span");
export const p = html("p");
export const body = fromHTML(document.body);
export const h1 = html("h1");
export const h2 = html("h2");
export const h3 = html("h3");
export const h4 = html("h4");

export const canvas = html("canvas");

export const button = html("button");
