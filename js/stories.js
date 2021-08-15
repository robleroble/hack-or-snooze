"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage("all");
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  // if a user is logged in, show favorite/not-favorite star
  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showStar ? makeStarHtml(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

// function that generates star html for each story - checks to see if liked by a user
function makeStarHtml(story, user) {
  const isFavorite = user.isFavorite(story);
  if (isFavorite) {
    return `
    <span class="favorite">
        <i class="fas fa-star"></i>
      </span>`;
  } else {
    return `
    <span class="favorite">
        <i class="far fa-star"></i>
      </span>`;
  }
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage(stories) {
  console.debug("putStoriesOnPage");

  let storiesType;

  if (stories === "all") {
    storiesType = storyList.stories;
  } else if (stories === "favorites") {
    storiesType = currentUser.favorites;
  }

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them

  for (let story of storiesType) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  // for (let story of currentUser.favorites) {
  //   const $story = generateStoryMarkup(story);
  //   $allStoriesList.append($story);

  $allStoriesList.show();
}

// Function to submit story from form
async function submitStoryFromForm(evt) {
  console.debug("submitStoryFromForm", evt);
  evt.preventDefault();

  // get values from form
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();

  const story = { author: author, title: title, url: url };

  // call addStory() from models.js
  const addedStory = await storyList.addStory(currentUser, story);

  // const addedStoryMarkup = generateStoryMarkup(addedStory);
  // $allStoriesList.prepend(addedStoryMarkup)
  storyList = await StoryList.getStories();
  putStoriesOnPage("all");

  $submitStoryForm.trigger("reset");
}

$submitStoryForm.on("submit", submitStoryFromForm);

// favorite a story when user clicks on star
async function favoriteStory(evt) {
  console.debug("favoriteStory");

  if (currentUser) {
    const storyId = evt.target.parentElement.parentElement.id;
    console.log(evt.target.outerHTML);
    const story = storyList.stories.find((s) => s.storyId === storyId);

    if (evt.target.outerHTML === `<i class="far fa-star"></i>`) {
      evt.target.outerHTML = `<i class="fas fa-star"></i>`;
      await currentUser.addFavorite(currentUser.username, storyId, story);
    } else {
      evt.target.outerHTML = `<i class="far fa-star"></i>`;
      await currentUser.removeFavorite(currentUser.username, storyId, story);
    }
  }
}

$allStoriesList.on("click", ".favorite", favoriteStory);
