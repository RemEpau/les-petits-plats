import { recipes } from '../../data/recipes.js';
import { normalizedFilterName } from './app.utils.js';
import { FILTERS } from '../constants/app.contants.js';

let dropDownCreated = false;

export function filtresDropDown(currentSearch) {
  document.getElementById('filtres').innerHTML = '';
  FILTERS.forEach((filter, i) => {
    document.getElementById('filtres').innerHTML += `
        <div div class="sm:w-52 w-32 flex-1 mb-5 font-medium z-10 relative" id="${normalizedFilterName(FILTERS[i])}" tabindex="3"> 
          <div class="bg-white w-full sm:text-base text-sm p-4 flex items-center justify-between rounded-xl cursor-pointer btn-dropdown relative">
            ${FILTERS[i]}
            <i class="fa-solid fa-chevron-down"></i>
          </div>
          <ul class="bg-white overflow-y-auto max-h-52 hidden rounded-b-xl absolute">
            <form class="m-2 flex items-center border filters-form">
              <input type="text" class="p-2 w-full">
              <button type="submit">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="m-2">
                  <g id="search">
                    <circle id="Ellipse" cx="10" cy="10.4219" r="9.5" stroke="black"
                      class="group-hover:stroke-black transition" />
                    <line id="Line 2" x1="18.3536" y1="19.0683" x2="27.3536" y2="28.0683" stroke="black"
                      class="group-hover:stroke-black transition" />
                  </g>
                </svg>
              </button>
            </form>
            ${listItems(FILTERS[i], currentSearch)}
          </ul>
        </div>
        `
  });

  // Fonction qui permet de lister les items en fonction du filtre
  function listItems(filtreName, currentSearch = []) {
    // Si la recherche est vide, on retourne tous les items
    if (currentSearch.length === 0) {
      return Array.from(new Set(recipes.map(recipe => {
        let items;
        switch (filtreName) {
          case "Ingrédients":
            items = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
            break;
          case "Appareils":
            items = [recipe.appliance.toLowerCase()];
            break;
          case "Ustensiles":
            items = recipe.utensils.map(ustensil => ustensil.toLowerCase());
            break;
        }
        return items;
      }).flat()))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        .map(item => {
          return `
            <li class="p-2 sm:text-base text-sm hover:bg-yellow focus:bg-yellow cursor-pointer capitalize" tabindex="0">${item}</li>
          `;
        }).join('');
    }
    // Sinon, on filtre les items en fonction de la valeur de l'input
    else {
      return Array.from(new Set(recipes.filter(recipe => {
        return currentSearch.every(id => {
          return (
            recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(id.toLowerCase())) ||
            recipe.appliance.toLowerCase().includes(id.toLowerCase()) ||
            recipe.utensils.some(utensil => utensil.toLowerCase().includes(id.toLowerCase()))
          );
        });
      }).map(recipe => {
        let items;
        switch (filtreName) {
          case "Ingrédients":
            items = recipe.ingredients.map(ingredient => ingredient.ingredient.toLowerCase());
            break;
          case "Appareils":
            items = [recipe.appliance.toLowerCase()];
            break;
          case "Ustensiles":
            items = recipe.utensils.map(ustensil => ustensil.toLowerCase());
        }
        return items;
      }).flat()))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
        .map(item => {
          return `
                <li class="p-2 hover:bg-yellow sm:text-base text-sm focus:bg-yellow cursor-pointer capitalize" tabindex="0">${item}</li>
              `;
        }).join('');
    }
  }

  // Fonction qui permet de filtrer les items en fonction de la valeur de l'input
  document.querySelectorAll('.filters-form input').forEach(input => {
    input.addEventListener('input', (event) => {
      // On filtre les items en fonction de la valeur de l'input
      document.querySelectorAll(`#${event.target.closest('.relative').id} ul li`).forEach(item => {
        const itemValue = item.innerText.toLowerCase();
        if (event.target.value.toLowerCase() === '') {
          item.classList.remove('hidden');
        } else if (itemValue.includes(event.target.value.toLowerCase()) && !Array.from(document.getElementById('current-search').children).map(div => div.querySelector('p').innerText.toLowerCase()).includes(itemValue)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // Fonction qui permet d'ouvrir ou de fermer le dropdown
  if (dropDownCreated === false) {
    document.addEventListener('click', (event) => {
      const button = event.target.closest('.btn-dropdown');
      if (button) {
        button.nextElementSibling.classList.toggle('hidden');
        button.classList.toggle('rounded-xl');
        button.classList.toggle('rounded-t-xl');
      }
    });
    dropDownCreated = true;
  }

  // On empêche la soumission des formulaires de filtres
  document.querySelectorAll('.filters-form').forEach(form => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  });

  // On ajoute un event listener sur chaque button dans les divs de current-search pour les supprimer
  document.getElementById('current-search').addEventListener('click', (event) => {
    if (event.target.closest('button')) {
      event.target.closest('button').parentElement.remove();
    }
  });
}

// Fonction qui permet d'ajouter un item à la liste de recherche actuelle
export function addListItemToCurrentSearch() {
  document.addEventListener('click', (event) => {
    if (event.target.closest('li')) {
      document.getElementById('current-search').innerHTML += `
        <div class="flex items-center justify-center gap-8 bg-yellow pl-4 rounded-xl activeFilter sm:text-base text-sm">
          <p class="whitespace-nowrap">${event.target.closest('li').innerText}</p>
          <button class="p-4">
            <i class="fas fa-times"></i>
          </button>
        </div>`;
    }
  });
}