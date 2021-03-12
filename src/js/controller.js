'use strict';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as Model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// Use Parcel's hot module loading to persist state in dev
// if (module.hot) module.hot.accept();

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipe = async function() {
  try {
    // Get #id from url
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Update results and bookmarks view
    resultsView.update(Model.getSearchResultsPage());
    bookmarksView.update(Model.state.bookmarks);

    // Load recipe
    await Model.loadRecipe(id);

    // Render recipe
    recipeView.render(Model.state.recipe);

  } catch(err) {
    recipeView.renderError();
    // console.error(err);
  }
};

const controlSearchResults = async function() {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // Render spinner
    resultsView.renderSpinner();

    // Load search results    
    await Model.loadSearchResults(query);

    // Render results and pagination buttons
    resultsView.render(Model.getSearchResultsPage());
    paginationView.render(Model.state.search);

  } catch(err) {
    throw err;
  }
};

const controlPagination = function(goToPage) {
  // Render NEW results and pagination buttons
  resultsView.render(Model.getSearchResultsPage(goToPage));
  paginationView.render(Model.state.search);
};

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  Model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(Model.state.recipe);
};

const controlAddBookmark = function() {
  // Add or remove bookmark (in state)
  if (!Model.state.recipe.bookmarked)
    Model.addBookmark(Model.state.recipe);
  else
    Model.removeBookmark(Model.state.recipe.id);

  // Update the recipe view
  recipeView.update(Model.state.recipe);

  // Render bookmarks view
  bookmarksView.render(Model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(Model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    // Render spinner
    addRecipeView.renderSpinner();

    // Upload new recipe data (to state)
    await Model.uploadRecipe(newRecipe);

    // Change ID in URL
    window.history.pushState(null, '', `#${Model.state.recipe.id}`);
    
    // Render the recipe and bookmarks view
    recipeView.render(Model.state.recipe);
    bookmarksView.render(Model.state.bookmarks);

    // Success message
    addRecipeView.renderMessage();

    // Close form
    setTimeout(
      () => addRecipeView.toggleWindow(),
      MODAL_CLOSE_SEC * 1000
    );

  } catch(err) {
    addRecipeView.renderError(err.message);
    // console.error(err);
  }
};

const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
