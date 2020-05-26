import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {

    // Remove all element from markup 
    elements.searchResList.innerHTML = '';

};

const renderRecipes = recipe => {
    const markup = `<li>
                        <a class="results__link" href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${recipe.title}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${recipe.title}</h4>
                                <p class="results__author">${recipe.publisher}</p>
                            </div>
                        </a>
                    </li> `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

export const renderResult = recipes => {
    // recipes.forEach(el => renderRecipes(el));
    // we can also write foreach loop like this it will automatic call renderRecipes function and pass the argument 
    recipes.forEach(renderRecipes);
};
