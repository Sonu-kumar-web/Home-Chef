import Search from './models/Search';
import * as searchView from './views/searchView';
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

const controlSearch = async () => {

    // 1) Get query from view
    const query = searchView.getInput(); //TODO
    console.log(query);

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) prepare UI for result
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
        await state.search.getResults();

        // Render result on UI
        clearLoader();
        searchView.renderResult(state.search.result);

    }

}

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