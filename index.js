const COHORT = "2405-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
const CONST_API_ID = 2405;

const state = {
  parties: [],
};

const partyList = document.querySelector("#partyList");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

/**
 * Sync state with the API and rerender
 */
async function render() {
  await getParties();
  renderParties();
}

render();

/**
 * Update state with parties from API
 */
async function getParties() {
  // TODO
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.parties = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render artists from state
 */
function renderParties() {
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties</li>";
    return;
  }

  // TO DO Build this out so that date and time are properly displayed
  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <span>${party.description} <span/><br>
      <span>${party.date}</span><br>
      <span>${party.location}</span><br>
      <button onclick=deleteParty(${party.id})>Delete Party - Choose Wisely</button><br>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

/**
 * Ask the API to create a new party based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  // TO DO Build this out so that date and time are properly displayed
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: new Date(addPartyForm.date.value),
        location: addPartyForm.location.value,
        cohortId: CONST_API_ID,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      responseData.error ? responseData.error.message : "Failed to add party";
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

//  Add Delete functionality
async function deleteParty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete party");
    }

    render();
  } catch (error) {
    console.error("Error", error);
  }
}
