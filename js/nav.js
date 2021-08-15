"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage("all");
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navSubmit.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//** When logged-in user clicks submit, submitform appears */

function navSubmitClick(evt) {
  console.debug("navSubmitClick");
  hidePageComponents();
  $submitStoryForm.show();
  putStoriesOnPage("all");
}

$navSubmit.on("click", navSubmitClick);

// When logged-in user clicks favorites, favorited stories populate

function navFavoritesClick(evt) {
  console.debug("navFavoritesClick");
  hidePageComponents();
  putStoriesOnPage("favorites");
}

$navFavorites.on("click", navFavoritesClick);
