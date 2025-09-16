export function select(selector, scope = document) {
  return scope.querySelector(selector);
}

export function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}

export function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}

export function create(element, scope = document) {
  return scope.createElement(element);
}

export function addChild(element, child) {
  return element.appendChild(child);
}

export function addFirstChild(element, child) {
  return element.insertBefore(child, element.firstChild);
}

export function addClass(element, text) {
  return element.classList.add(text);
}

export function removeClass(element, text) {
  return element.classList.remove(text);
}

export function replaceClass(element, current, update) {
  return element.classList.replace(current, update);
}

export function toggleClass(element, text) {
  return element.classList.toggle(text);
}

export function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function sleep(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, duration)
  });
}
