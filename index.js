const COHORT = "2405-FTB-ET-WEB-FT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

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
  // TODO
  if (!state.parties.length) {
    partyList.innerHTML = "<li>No Parties</li>";
    return;
  }
  const partyCards = state.parties.map((party) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${party.name}</h2>
      <span>${party.description} <span/><br>
      <span>${party.date}</span><br>
      <span>${party.location}</span><br>
    `;
    return li;
  });

  partyList.replaceChildren(...partyCards);
}

/**
 * Ask the API to create a new artist based on form data
 * @param {Event} event
 */
async function addParty(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addPartyForm.name.value,
        description: addPartyForm.description.value,
        date: addPartyForm.date.value,
        location: addPartyForm.location.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create party");
    }

    render();
  } catch (error) {
    console.error(error);
  }
}
