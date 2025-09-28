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

const tutorial = select('.tutorial');
const introVideo = select('.intro-video');
const tutorialButton = select('.tutorial-btn');
const introVideoButton = select('.intro-btn');
const exitButtons = selectAll('.close-btn');

const heroBanner = select("header");
const headerSwitch = heroBanner.offsetHeight;

/*----------------------------------------------------------->
	Parallax Controls 
<----------------------------------------------------------*/

const parallaxLayers = [
  {selector: ".parallax.one", speed: 0.9},
  {selector: ".parallax.two", speed: 1},
  {selector: ".parallax.three", speed: 0.3},
  {selector: ".parallax.four", speed: 0.5},
  {selector: ".parallax.five", speed: 2},
  {selector: ".parallax.six", speed: -0.8},
  {selector: ".parallax.seven", speed: 1.6}
];

listen("scroll", window, () => {
  const scrollTop = window.pageYOffset;
  parallaxLayers.forEach(({selector, speed}) => {
    const layer = select(selector);
    const yPos = -(scrollTop * speed);
    layer.style.transform = `translateY(${yPos}px)`;
  });
});




listen("click", tutorialButton, ()=>{
  tutorial.showModal();
});
listen("click", introVideoButton, ()=> {
  introVideo.classList.toggle('open');
});
exitButtons.forEach(btn => {
  listen("click", btn, ()=> {
    tutorial.close();
  });
});
