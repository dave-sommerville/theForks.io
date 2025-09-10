import { create, select, listen } from './utils.js';

let cardContent = `
  <div class="ritual-tag hidden"><i class="fa-regular fa-registered"></i></div>
  <h3 class="spell-name"></h3>
  <p class="spell-level"></p>
  <div class="quick-info">
    <div class="row">
      <div class="cast info-box">
        <h5>Casting Time</h5>
        <p class="cast-time"></p>
      </div>
      <div class="range info-box">
        <h5>Range / Area</h5>
        <div class="range-area">
          <p class="sp-range"></p>
          <p class="sp-area"></p>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="components info-box">
        <h5>Components</h5>
        <p class="sp-components"></p>
      </div>
      <div class="duration info-box">
        <h5>Duration</h5>
        <p class="sp-duration"></p>
      </div>
    </div>
  </div>
  <div class="info-text">
    <div class="description">
      <button>Description</button>
    </div>
  </div>
  <div class="extras row">
    <div class="school info-box">
      <h5>School Of Magic</h5>
      <p class="magic-school"></p>
    </div>
    <div class="classes info-box">
      <h5>Classes</h5>
      <p class="sp-classes"></p>
    </div>
  </div>
  <button class="delete"><i class="fa-regular fa-trash-alt"></i></button>
`
// TODO: Add Checkbox for prepared spells
export function buildCard(spell) {
  const card = create('div');
  card.classList.add('card');
  card.innerHTML = cardContent;
  
  const name = select('.spell-name', card);
  const level = select('.spell-level', card);
  const castTime = select('.cast-time', card);
  const range = select('.sp-range', card);
  const area = select('.sp-area', card);
  const components = select('.sp-components', card);
  const duration = select('.sp-duration', card);
  const description = select('.description', card);
  const magicSchool = select('.magic-school', card);
  const classes = select('.sp-classes', card);
  const ritualTag = select('.ritual-tag', card);
  const deleteBtn = select('.delete', card);
  
  name.textContent = spell.name;
  level.textContent = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
  castTime.textContent = spell.casting_time;
  range.innerText = spell.range;

  if (spell.area_of_effect) {
    area.innerText = ` / ${spell.area_of_effect.size}ft ${spell.area_of_effect.type}`;
  } else {
    area.textContent = '';
  }

  if (spell.ritual && ritualTag.classList.contains('hidden')) {
    ritualTag.classList.remove('hidden');
  } else if (!spell.ritual && !ritualTag.classList.contains('hidden')) {
    ritualTag.classList.add('hidden');
  }

  components.textContent = spell.components.join(', ');  
  duration.textContent = spell.duration;
  magicSchool.textContent = spell.school.name;
  classes.textContent = spell.classes.map(c => c.name).join(', ');

  card.dataset.level = spell.level;

  const descriptionButton = select('button', description);
  const dialog = select('dialog');

  listen('click', descriptionButton, () => {
    dialog.innerHTML = `<h3>${spell.name}</h3>`;
    dialog.innerHTML += `<p>${spell.desc}</p>`;
    dialog.innerHTML += `<p>${spell.higher_level ? spell.higher_level : ''}</p>`;
    dialog.showModal();
  });

  listen('click', dialog, (e) => { 
    const rect = dialog.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom || 
        e.clientX < rect.left || e.clientX > rect.right) {
      dialog.close();
    }
  });
  
  listen('click', deleteBtn, () => {
    let spellBook = localStorage.getItem('spellBook');
    let index = spell.index;
    const arrSpellBook = JSON.parse(spellBook);
    console.log(arrSpellBook);
    if (arrSpellBook.includes(index)) {
      let i = arrSpellBook.indexOf(index);
      arrSpellBook.splice(i, 1);
      console.log(arrSpellBook);
      localStorage.setItem('spellBook', JSON.stringify(arrSpellBook));
      card.remove();
    }
    
  });


  return card;
}