import Search from './models/Search';
import Recipe from './models/Recipe';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import {
    elements,
    renderLoader,
    clearLoader
} from './views/base';

/** Global state of the app
 * - Search Object
 * - Current recipe object
 * Shopping list object
 * Liked recipes 
 */

const state = {};

// Search Controller
const controlSearch = async () => {

    // 1) Get query from view
    const query = searchView.getInput(); //TODO
    // console.log(query);

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes 
            await state.search.getResults();

            // Render result on UI
            clearLoader();
            searchView.renderResult(state.search.result);

        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }

    }

};

elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();

});

elements.searchResPages.addEventListener('click', e => {

    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); // 10 is for base 10 means 0 to 9 (if there is to 2 means binary means 0 and 1)
        searchView.clearResults();
        searchView.renderResult(state.search.result, goToPage);
        console.log(goToPage);

    }
});

// RECIPE CONTROLLER ************************************
// const r = new Recipe(47746);
// r.getRecipe();
// console.log(r);

const controlRecipe = async () => {
    // GET Id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for change
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // Highlight the selected search item
        if(state.search) searchView.highlightSelected(id); 

        // Create new recipe object 
        state.recipe = new Recipe(id);
        // state.recipe.parseIngredients();

        try {
            // Get recipe data and parse ingredient 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving and time 
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            // console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch (err) {
            console.log(err);
            alert('Error in processing recipe')
        }


    }

};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

// Adding same event Listener for multiple event 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));