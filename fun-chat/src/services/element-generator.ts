import { HtmlElementOptions } from "../types/types";

export function createElement(options: HtmlElementOptions): HTMLElement {
  const {
    tag = "div",
    text = "",
    parent,
    classes = [],
    src = "",
    style = {},
    id = "",
    type = "",
    attributes = {}
  } = options;

  const element = document.createElement(tag);

  element.textContent = String(text);

  Object.assign(element.style, style);

  if (tag === "img") {
    (element as HTMLImageElement).src = src as string;
  }

  if( id !== "") {
    element.id = id;
  }

  if (tag === "input") {
    (element as HTMLInputElement).type = type;
  }

  if (classes.length > 0) {
    element.classList.add(...classes);
  }

  if (parent != null) {
    parent.appendChild(element);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value as string);
  }

  return element;
}
