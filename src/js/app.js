'use strict';
function select(selector, scope = document) {
  return scope.querySelector(selector);
}
function selectAll(selector, scope = document) {
  return scope.querySelectorAll(selector);
}
function listen(event, element, callback) {
  return element.addEventListener(event, callback);
}
function removeClass(element, customClass) {
  element.classList.remove(customClass);
  return element;
}
function addClass(element, customClass) {
  element.classList.add(customClass);
  return element;
}

const modal = select('.card-container');

const whyContribute = select('.why-contribute');
const contributors = select('.contributors');
const projects = select('.projects');
const workshop = select('.workshop');
const documention = select('.documentation');

const contributorsButton = select('.contributors-btn');
const projectsButton = select('.projects-btn');
const workshopButton = select('.workshop-btn');
const documentionButton = select('.documention-btn');


const exitButtons = selectAll('.close-btn');


listen("click", contributorsButton, ()=> {
  contributors.showModal();
});
listen("click", projectsButton, ()=> {
  projects.showModal();
});
listen("click", workshopButton, ()=> {
  workshop.showModal();
});
listen("click", documentionButton, ()=> {
  documention.showModal();
});

exitButtons.forEach(btn => {
  listen("click", btn, ()=> {
    contributors.close();
    projects.close();
    workshop.close();
    documention.close();
  });
});
