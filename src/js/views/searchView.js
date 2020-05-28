import {elements} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {

    // Clear the search space after every search (or result )
    elements.searchInput.value = '';
};

export const clearResults = () => {

    // Remove all element from markup before search next result
    elements.searchResList.innerHTML = '';

};

// Reduce the title size followed by three dots without cut any word
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit){
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit){
                newTitle.push(cur);
            }
            acc = acc + cur.length;
        }, 0);
        // return the result
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};

const renderRecipes = recipe => {
    const markup = `<li>
                        <a class="results__link" href="#${recipe.recipe_id}">
                            <figure class="results__fig">
                                <img src="${recipe.image_url}" alt="${recipe.title}">
                            </figure>
                            <div class="results__data">
                                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
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
