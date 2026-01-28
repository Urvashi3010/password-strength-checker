/* ===== DOM ELEMENT REFERENCES ===== */
// Get password input field element
const pwd = document.getElementById("pwd");
// Get "Check Strength" button element
const checkBtn = document.getElementById("checkBtn");
// Get inner strength bar element (fills with color)
const strengthBar = document.getElementById("strength");
// Get strength feedback text element
const strengthText = document.getElementById("strengthText");
// Get eye icon toggle button to show/hide password
const toggleBtn = document.getElementById("toggleBtn");

/* ===== REQUIREMENT INDICATOR REFERENCES ===== */
// Elements that show checkmark when requirement is met
const reqLength = document.getElementById("req-length");    // 8+ characters
const reqNumber = document.getElementById("req-number");    // Contains digit
const reqUpper = document.getElementById("req-upper");      // Contains uppercase
const reqSpecial = document.getElementById("req-special");  // Contains special char

console.log("Script loaded. Elements found:", {
  pwd: !!pwd,
  checkBtn: !!checkBtn,
  strengthBar: !!strengthBar,
  strengthText: !!strengthText,
  toggleBtn: !!toggleBtn
});

// ===== PROCESS 1: TOGGLE PASSWORD VISIBILITY =====
// When user clicks the eye icon, this switches between showing and hiding the password
if (toggleBtn) {
  toggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // HOW: Check current input type and switch it
    if (pwd.type === "password") {
      pwd.type = "text";  // CHANGE TO TEXT - shows password as plain text
      toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';  // Update icon to eye-slash
    } else {
      pwd.type = "password";  // CHANGE TO PASSWORD - hides with dots
      toggleBtn.innerHTML = '<i class="fas fa-eye"></i>';  // Update icon back to eye
    }
  });
}

// ===== PROCESS 2: CHECK PASSWORD STRENGTH =====
// This is the main function that analyzes the password and updates all visual feedback
function updateStrength() {
  console.log("updateStrength called");
  const password = pwd.value;
  let score = 0;  // Counter for how many requirements are met (0-4)

  // STEP 1: TEST PASSWORD AGAINST 4 SECURITY CRITERIA
  const hasLength = password.length >= 8;           // Does it have 8+ characters?
  const hasNumber = /\d/.test(password);             // Does it contain any digit (0-9)?
  const hasUpper = /[A-Z]/.test(password);           // Does it have uppercase letter (A-Z)?
  const hasSpecial = /[^A-Za-z0-9]/.test(password); // Does it have special character (!@#$%, etc)?

  // STEP 2: UPDATE VISUAL REQUIREMENT INDICATORS
  // Changes each requirement icon from ✗ to ✓ if condition is met
  updateRequirement(reqLength, hasLength);
  updateRequirement(reqNumber, hasNumber);
  updateRequirement(reqUpper, hasUpper);
  updateRequirement(reqSpecial, hasSpecial);

  // STEP 3: CALCULATE STRENGTH SCORE
  // Add 1 point for each requirement that is met (total max = 4 points)
  if (hasLength) score++;   // +1 point
  if (hasNumber) score++;   // +1 point
  if (hasUpper) score++;    // +1 point
  if (hasSpecial) score++;  // +1 point

  // STEP 4: UPDATE THE STRENGTH BAR WIDTH
  // Bar grows from 0% (no requirements) to 100% (all 4 requirements met)
  let width = (score / 4) * 100;  // Convert score to percentage
  strengthBar.style.width = width + "%";

  // STEP 5: UPDATE FEEDBACK TEXT AND COLOR BASED ON SCORE
  if (score === 0) {
    // Score 0: No password entered yet
    strengthBar.style.background = "transparent";
    strengthText.textContent = "Type a password to check strength";
    strengthText.style.color = "#666";
  } else if (score <= 1) {
    // Score 1: Only 1 requirement met = WEAK PASSWORD (RED)
    strengthBar.style.background = "#ff4757";  // RED color
    strengthText.textContent = "Weak Password ✗";
    strengthText.style.color = "#ff4757";
  } else if (score === 2 || score === 3) {
    // Score 2-3: 2 or 3 requirements met = MEDIUM STRENGTH (ORANGE)
    strengthBar.style.background = "#ffa502";  // ORANGE color
    strengthText.textContent = "Medium Strength ⚠";
    strengthText.style.color = "#ffa502";
  } else {
    // Score 4: All 4 requirements met = STRONG PASSWORD (GREEN)
    strengthBar.style.background = "#4caf50";  // GREEN color
    strengthText.textContent = "Strong Password ✓";
    strengthText.style.color = "#4caf50";
  }
  
  console.log("Password:", password, "Score:", score);
}

// ===== PROCESS 3: UPDATE REQUIREMENT INDICATOR ICONS =====
// This function updates the visual indicator (checkmark or X) for each requirement
function updateRequirement(element, isMet) {
  if (!element) return;  // Safety check - if element doesn't exist, skip
  
  if (isMet) {
    // WHEN REQUIREMENT IS MET:
    element.classList.add("active");  // Add "active" class for CSS styling (green background)
    element.textContent = "✓";  // Show checkmark symbol
  } else {
    // WHEN REQUIREMENT IS NOT MET:
    element.classList.remove("active");  // Remove "active" class (remove green styling)
    element.textContent = "✗";  // Show X symbol
  }
}

// ===== PROCESS 4: SET UP EVENT LISTENERS FOR REAL-TIME & MANUAL CHECKING =====

// REAL-TIME STRENGTH CHECKING: Triggered when user types each character
if (pwd) {
  // Listen for "input" event - fires on every character change
  pwd.addEventListener("input", updateStrength);
  
  // Also listen for "Enter" key press - allows manual check with keyboard
  pwd.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      updateStrength();  // Manually trigger the strength check
    }
  });
}

// MANUAL STRENGTH CHECK: Triggered when user clicks the "Check Strength" button
if (checkBtn) {
  checkBtn.addEventListener("click", function (e) {
    console.log("Check button clicked");
    updateStrength();  // Manually trigger the strength evaluation
  });
}
