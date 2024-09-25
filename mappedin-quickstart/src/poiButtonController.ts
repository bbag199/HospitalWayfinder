// Initialize button event listeners
export function initializeButtonListeners() {
  const toggleButton = document.querySelector(".main-toggle-button");
 //only select the expandable buttons for POIs
 const hiddenButtons = document.querySelectorAll(
  ".icons-container .expandable-btn"
);
  // Toggle visibility of buttons when the main button is clicked
  toggleButton?.addEventListener("click", function () {
    hiddenButtons.forEach((button) => {
      button.classList.toggle("hidden");
    });
  });
}
