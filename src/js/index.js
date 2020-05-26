import Search from './models/Search';
import * as searchView from './views/searchView';
import {elements} from './views/base';

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

    if(query){
        // 2) New search object and add to state
        state.search = new Search(query);
        
        // 3) prepare UI for result
        searchView.clearInput();
        searchView.clearResults();

        // 4) Search for recipes
        await state.search.getResults();

        // Render result on UI
        searchView.renderResult(state.search.result);
        
    }

}

elements.searchForm.addEventListener('submit', e => {

    e.preventDefault();
    controlSearch();

});


