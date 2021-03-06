import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current recipe object
 * Shopping list object
 * Liked recipes 
 */

const state = {};
// window.state = state;

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
    // console.log(id);

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
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );

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


// LIST CONTROLLER
const controlList = () => {
    // crete a new list if there is none yet
    if(!state.list) state.list = new List();

    // Add each Ingredient to the list  and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });

}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();
    
    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach( like => likesView.renderLike(like));
})

// Handle delete and update list item event
elements.shopping.addEventListener('click', e => {
    clearLoader();
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        // Delete from state
        state.list.deleteItem(id);

        // Delete form UI
        listView.deleteItem(id);
    }
    // Handle the count update
    else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});


// LIKES CONTROLLER
const controlLike = () => {
    // Create new Likes object
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if(!state.likes.isLiked(currentID)){
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to the UI list
        // console.log(state.likes);
        likesView.renderLike(newLike);
        

    }
    // User HAS liked current recipe
    else{
        // Remove  like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from the UI list
        // console.log(state.likes);
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handling recipe button clicks
//btn-decrease * --> * means click on button or its child
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clicked 
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }

    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        // Increased button is clicked 
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }else if(e.target.matches('.recipe__btn--add, recipe__btn--add *')){
        // Add ingredient to shopping list
        controlList();
    }
    else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like Controller
        controlLike();
    }

    console.log(state.recipe);
    
});

// window.l = new List();

