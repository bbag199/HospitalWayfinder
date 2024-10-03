export function updateButtonText() {
  const directionsBtn = document.querySelector(
    ".directions-btn"
  ) as HTMLButtonElement;
  const stopNavBtn = document.querySelector(
    ".stop-nav-btn"
  ) as HTMLButtonElement;

  if (window.innerWidth <= 430) {
    if (directionsBtn) directionsBtn.textContent = "Go";
    if (stopNavBtn) stopNavBtn.textContent = "Stop";
  } else {
    if (directionsBtn) directionsBtn.textContent = "Get Directions";
    if (stopNavBtn) stopNavBtn.textContent = "Stop Navigation";
  }
}

// Automatically update button text on page load
updateButtonText();

// Automatically update button text on window resize
window.addEventListener("resize", updateButtonText);
