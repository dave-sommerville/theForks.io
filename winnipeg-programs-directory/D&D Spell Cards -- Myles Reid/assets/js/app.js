'use strict';

import { 
  select, listen, selectAll, addClass, removeClass 
} from './utils.js';

const BASE_URL = 'https://www.dnd5eapi.co';

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  },
  mode: 'cors'
}

// TODO: Add textbox to search for spells by name
// TODO: Add Error for API fetch
// TODO: Add Loader for when a card is selected
// TODO: Add filter for class as well - will have to edit how its filtered
const filterLevel = select('#level');
const spellList = select('#spell-list');
const spellCard = select('.card');
const name = select('.spell-name');
const level = select('.spell-level');
const castTime = select('.cast-time');
const range = select('.sp-range');
const area = select('.sp-area');
const components = select('.sp-components');
const duration = select('.sp-duration');
const description = select('.description');
const higherLevel = select('.higher-levels');
const magicSchool = select('.magic-school');
const classes = select('.sp-classes');
const ritualTag = select('.ritual-tag');
const addSpell = select('.add-spell');
const addSpellConfirm = select('.add-spell-message');
const preloader = select('.loader-wrapper');

async function getAllSpells() {
  try {
    const spellIndexes = await fetch(BASE_URL + '/api/spells', options);

    if (!spellIndexes.ok) {
      throw new Error(`${spellIndexes.statusText} (${spellIndexes.status})`);
    }

    const data = await spellIndexes.json();
    const spells = data.results;
    return spells;
  } catch (error) {
    spellList.innerHTML = '<li class="spell"><p>Unable to Access Spells</p></li>'
    console.log(error.message);
  }
}

async function findSpell(spell) {
  const spells = await getAllSpells();

  if (spells) {
    const spellNames = spells.map(s => s.name.toLowerCase());
    if (spellNames.includes(spell.toLowerCase())) {
      let spellIndex = spellNames.indexOf(spell.toLowerCase());
      return spells[spellIndex];
    }
  }
  return null;
}

async function getSpellDetails(spell) {
  const spellData = await findSpell(spell);
  if (spellData) {
    const spellUrl = spellData.url;
    const response = await fetch(`https://www.dnd5eapi.co${spellUrl}`, options);
    const spellInfo = await response.json();
    return spellInfo;
  }
}

let selectedSpell;
async function listAllSpells() {
  const spells = await getAllSpells();
  
  if (spells) {
    spells.sort((a, b) => a.level - b.level);
    spells.forEach(spell => {
      let name = spell.name;
      let level = spell.level;
      buildSpellList(name, level);
    })
  }
  const listedSpells = selectAll('.spell');

  listedSpells.forEach(spell => {

    listen('focus', spell, async function() {
      // animateCard();
      addClass(spellCard, 'slide-rotate');
      const spellName = spell.querySelector('h4').textContent;
      const spellInfo = await getSpellDetails(spellName);
      setTimeout(() => {
        removeClass(spellCard, 'slide-rotate');
      }, 800);
      
      // animateCard();
      if (spellInfo) {
        if (spellCard.classList.contains('hidden')) {
          spellCard.classList.remove('hidden');
        }
        displaySpellInfo(spellInfo);
        selectedSpell = spellInfo;
      }
    });
  });
}

function buildSpellList(name, level) {
  if (level === 0) {
    level = 'Cantrip';
    spellList.innerHTML += `
    <li class="spell" tabindex=0><p>${level}</p><h4>${name}</h4></li>
    `; 
  } else {
  spellList.innerHTML += `
  <li class="spell" tabindex=0><p>Level ${level}</p><h4>${name}</h4></li>
  `;
  }
}

function filterSpells() {
  const spells = selectAll('.spell');
  const filterValue = filterLevel.value;

  if (filterValue === 'all') {
    spells.forEach(item => {
      item.classList.remove('none');
    });
    return;
  }
  spells.forEach(item => {
    const text = item.innerText.toLowerCase();

    if (text.includes(filterValue)) {
      item.classList.remove('none');
    } else {
      item.classList.add('none');
    }
  });
}

function displaySpellInfo(spell) {
  name.textContent = spell.name;
  level.textContent = spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`;
  castTime.textContent = spell.casting_time;
  range.innerText = spell.range;

  setAreaOfEffect(spell);
  setRitualTag(spell);
  
  components.textContent = spell.components.join(', ');  
  duration.textContent = spell.duration;
  description.textContent = spell.desc;
  higherLevel.textContent = spell.higher_level ? spell.higher_level : 'None';
  magicSchool.textContent = spell.school.name;
  classes.textContent = spell.classes.map(c => c.name).join(', ');

}

function setAreaOfEffect(spell) {
  if (spell.area_of_effect) {
    area.innerText = ` / ${spell.area_of_effect.size}ft ${spell.area_of_effect.type}`;
  } else {
    area.textContent = '';
  }
}

function setRitualTag(spell) {
  if (spell.ritual && ritualTag.classList.contains('hidden')) {
    ritualTag.classList.remove('hidden');
  } else if (!spell.ritual && !ritualTag.classList.contains('hidden')) {
    ritualTag.classList.add('hidden');
  }
}

const spellBook = [];
function addSpellToBook() {
  if (!selectedSpell) {
    displayConfirmation('noSelect');
    return;
  }
  let spellIndex = selectedSpell.index
  spellBook.push(spellIndex);
  let storedBook = JSON.parse(localStorage.getItem('spellBook'));

  if(!storedBook) {
    localStorage.setItem('spellBook', JSON.stringify(spellBook));
    displayConfirmation('new');
    return;
  }

  if (storedBook.includes(spellIndex)) {
    displayConfirmation('exists');
    return;
  } else {
    displayConfirmation('new');
    storedBook.push(spellIndex);
    localStorage.setItem('spellBook', JSON.stringify(storedBook));
  }
}

function displayConfirmation(arg) {
  switch(arg) {
    case 'noSelect':
      addSpellConfirm.innerText = 'Please Select a spell before adding';
      break;
    case 'exists': 
      addSpellConfirm.innerText = `${selectedSpell.name} already in spellbook`;
      break;
    case 'new':
      addSpellConfirm.innerText = `${selectedSpell.name} added to spellbook`;
      break;
  }
  
  addSpellConfirm.style.visibility = 'visible';
  setTimeout(() => {
    addSpellConfirm.style.visibility = 'hidden';
  }, 1000);
}

function animateCard() {
  addClass(spellCard, 'slide-rotate');
  setTimeout(() => {
    removeClass(spellCard, 'slide-rotate');
  }, 1200);
}



listAllSpells().then(() => {
  preloader.style.opacity = 0;
}).then(() => {
  setTimeout(() => {
    preloader.style.display = 'none';
  }, 500);
});

listen('change', filterLevel, () => {
  filterLevel.blur();
  filterSpells();
});

listen('click', addSpell, () => {
  addSpellToBook();
})

// listen('fetch', spellList , () => {
//   preloader.classList.toggle('none');
// } )