// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader} from './views/base';

/* GLOABAL APP STATE */
/* 
- Search Object
- Current recipe object
- Shopping List object
- Liked recipes
*/
const state = {};

const controlSearch = async () => {
    // Get query from search form (view)
    const query = searchView.getInput();

    // Create search object if query exists
    if(query) {
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // Search for recipes
        await state.search.getResults();

        // Display results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
    }

};

// listen for search form submit
elements.searchFrom.addEventListener('submit', e => {
    controlSearch();

    e.preventDefault();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});

