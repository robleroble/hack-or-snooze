"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
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
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

// Function to submit story from form
async function submitStoryFromForm(evt) {
  console.debug("submitStoryFromForm", evt);
  evt.preventDefault();

  // get values from form
  const author = $("#story-author").val()
  const title = $("#story-title").val()
  const url = $("#story-url").val()

  const story = {"author": author, "title": title, "url": url}

  // call addStory() from models.js
  const addedStory = await storyList.addStory(currentUser, story)

  // const addedStoryMarkup = generateStoryMarkup(addedStory);
  // $allStoriesList.prepend(addedStoryMarkup)
  storyList = await StoryList.getStories();
  putStoriesOnPage();

  $submitStoryForm.trigger("reset")
}

$submitStoryForm.on("submit", submitStoryFromForm)