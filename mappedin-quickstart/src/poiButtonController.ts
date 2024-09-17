// Initialize button event listeners
export function initializeButtonListeners() {
  const toggleButton = document.querySelector(".main-toggle-button");
  const hiddenButtons = document.querySelectorAll(".expandable-btn");

  // Toggle visibility of buttons when the main button is clicked
  toggleButton?.addEventListener("click", function () {
    hiddenButtons.forEach((button) => {
      button.classList.toggle("hidden");
    });
  });

  //actions for each button
  // document
  //   .getElementById("reception-btn")
  //   ?.addEventListener("click", function () {
  //     alert("Reception were highlighted");
  //   });

  // document.getElementById("cafe-btn")?.addEventListener("click", function () {
  //   alert("Café were highlighted");
  // });

  // document.getElementById("toilet-btn")?.addEventListener("click", function () {
  //   alert("Toiletswere highlighted");
  // });
}
