// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader} from './views/base';

/* GLOABAL APP STATE */
/* 
- Search Object
- Current recipe object
- Shopping List object
- Liked recipes
*/
const state = {};


/* SEARCH CONTROLLER */
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

        try {
              // Search for recipes
            await state.search.getResults();

            // Display results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something Went Wrong :(');
            clearLoader();
        }
      
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


/* RECIPE CONTROLLER */
const controlRecipe = async () => {
    // Get id using url and hash prop
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if(id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // HighLight selected element
        if(state.search) searchView.highlightSelected(id);

        // Create  new recipe Object
        state.recipe = new Recipe(id);

        try {
             // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();
            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
        } catch (error) {
            console.log(error);
            alert('Error Processing Recipe');
        }
       
    }
}



['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
        }
       
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // Decrease button is clicked
        state.recipe.updateServings('inc');
    }

    recipeView.updateServingsIngredients(state.recipe);
})