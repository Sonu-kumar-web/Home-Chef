import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {

    // Clear the search space after every search (or result )
    elements.searchInput.value = '';
};

export const clearResults = () => {

    // Remove all element from markup before search next result
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';

};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    // CSS selector
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active');
};

// Reduce the title size followed by three dots without cut any word
export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
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
                    </li> `
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

// type: 'prev' or 'next'
const createButton = (page, type) => `
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page-1 : page + 1}>
        <span>Page ${type === 'prev' ? page-1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
`

// for change pages
const renderButtons = (page, numResults, resultPerPage) => {

    const pages = Math.ceil(numResults / resultPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');

    } else if (page < pages) {
        // Both buttons
        button = `
            ${button = createButton(page, 'prev')}
            ${button = createButton(page, 'next')}
        `;

    } else if (page === pages && pages > 1) {
        // only button to go to prev page 
        button = createButton(page, 'prev');
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};

export const renderResult = (recipes, page = 1, resPerPage = 10) => {
    // recipes.forEach(el => renderRecipes(el));
    // we can also write foreach loop like this it will automatic call renderRecipes function and pass the argument 

    // Render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipes);

    // Render the pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};