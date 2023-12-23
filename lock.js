const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

const centerX = windowWidth / 2;
const centerY = windowHeight / 2;

// Set the initial cursor position to the center of the window
let mouseX = centerX;
let mouseY = centerY;

// Function to handle mouse movement
function handleMouseMove(event) {
  mouseX += event.movementX;
  mouseY += event.movementY;

  // Ensure the cursor stays within the bounds of the window
  mouseX = Math.max(0, Math.min(windowWidth, mouseX));
  mouseY = Math.max(0, Math.min(windowHeight, mouseY));

  // Move the cursor back to the center
  moveCursor(centerX, centerY);
}

// Function to move the cursor to a specific position
function moveCursor(x, y) {
  window.requestPointerLock =
    window.requestPointerLock || document.body.requestPointerLock;

  if (document.pointerLockElement !== document.body) {
    // Lock the cursor
    document.body.requestPointerLock();
  }

  // Move the cursor to the specified position
  document.body.style.cursor = "none";
  document.body.style.setProperty("--cursor-x", `${x}px`);
  document.body.style.setProperty("--cursor-y", `${y}px`);
}

// Add event listener for mouse movement
document.addEventListener("mousemove", handleMouseMove);
