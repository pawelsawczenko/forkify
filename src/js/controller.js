import * as model from './model.js';
import recipieView from './views/recipieView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipes = async () => {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipieView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipieView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipieView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultsView.renderSpinner();

    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = goToPage => {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = newServings => {
  model.updateServings(newServings);
  // recipieView.render(model.state.recipe);
  recipieView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  if (!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  } else {
    model.deleteBookmark(model.state.recipe.id);
  }

  recipieView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    // console.log(model.state.recipe);

    recipieView.render(model.state.recipe);

    addRecipeView.renderMessege();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => {
      addRecipeView.toggleWindow();
      addRecipeView.render(model.state.recipe);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const controlDeleteUserRecipe = async () => {
  try {
    // console.log(model.state.recipe);

    const id = window.location.hash.slice(1);

    if (model.state.recipe.bookmarked) {
      model.deleteBookmark(id);
      bookmarksView.render(model.state.bookmarks);
    }

    if (model.state.search.results.filter(result => result.id === id)) {
      model.state.search.results = model.state.search.results.filter(
        result => result.id !== id
      );
    }

    await model.deleteRecipe(id);

    if (model.state.search.results.filter(result => result.id === id)) {
      resultsView.render(model.getSearchResultsPage());
      paginationView.render(model.state.search);
    }

    recipieView.renderMessege('Your recipe was succsesfully deleted');
    window.history.pushState(null, '', `#`);
  } catch (err) {
    console.log(err);
    recipieView.renderError('Your recipe was NOT deleted');
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipieView.addHandlerRender(controlRecipes);
  recipieView.addHandlerUpadteServings(controlServings);
  recipieView.addHandlerAddBookmark(controlAddBookmark);
  recipieView.addHandlerDeleteRecipe(controlDeleteUserRecipe);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerPagination(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
