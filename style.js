
let loginRoll, loginBatch, loginPassword;
let signupRoll, signupBatch, signupName, signupPassword;

/*************************************************
 * LOGIN ↔ REGISTER TOGGLE (NO CHANGE)
 *************************************************/
const wrapper = document.querySelector(".auth-wrapper");
const registerBtn = document.querySelector(".register-trigger");
const loginBtn = document.querySelector(".login-trigger");

registerBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const msg = document.getElementById("loginErrorMsg");
  if (msg) msg.style.display = "none";
  wrapper.classList.add("toggled");
});


loginBtn.addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.remove("toggled");
});

/*************************************************
 * PASSWORD SHOW / HIDE (NO CHANGE)
 *************************************************/
function togglePassword(inputId, iconElement) {
  const input = document.getElementById(inputId);
  const icon = iconElement.querySelector("i");

  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  }
}

/*************************************************
 * GOOGLE APPS SCRIPT URL
 *************************************************/
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx4YCCsk7i4qpCUKVsfPsecp7avFkNH02WLB4WFGuzf6mZf5RlBTaFkst9nehWYnOypzg/exec";

/*************************************************
 * REGISTER USER (WITH BATCH)
 *************************************************/
function registerUser(e) {
  e.preventDefault();

  const url =
    `${SCRIPT_URL}?action=register` +
    `&roll=${encodeURIComponent(signupRoll.value)}` +
    `&batch=${encodeURIComponent(signupBatch.value)}` +
    `&name=${encodeURIComponent(signupName.value)}` +
    `&password=${encodeURIComponent(signupPassword.value)}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {

      if (data.status === "exists") {

        alert("Already Registered!");
         /* ✅ AUTO SWITCH TO LOGIN */
        document
          .querySelector(".auth-wrapper")
          .classList.remove("toggled");

        return;
      } else if (data.status === "registered") {
        alert("Registered Successfully!");
        wrapper.classList.remove("toggled");
      } else if (data.status === "sheet_not_found") {
        alert("Google Sheet not found");
      } else {
        alert("Unknown server response");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error connecting to Google Sheet");
    });
}

/*************************************************
 * LOGIN USER (WITH BATCH)
 *************************************************/
function loginUser(e) {
  e.preventDefault();

  const msg = document.getElementById("loginErrorMsg");

  // 🔵 Blue message (instant)
  msg.innerText = "Checking account...";
  msg.style.color = "#00d4ff";    //  Blue Color
  msg.style.display = "block";

  const url =
    `${SCRIPT_URL}?action=login` +
    `&roll=${encodeURIComponent(loginRoll.value)}` +
    `&batch=${encodeURIComponent(loginBatch.value)}` +
    `&password=${encodeURIComponent(loginPassword.value)}`;

  fetch(url)
  .then((res) => res.json())
  .then((data) => {

    const status = (data.status || "").trim().toLowerCase();

  if (status === "success") {
  window.location.href = "home.html";

  } else if (status === "roll_not_found") {

  msg.innerText = "Don't have an account, Register now.";
  msg.style.color = "#ff6b6b";
  msg.style.display = "block";
  return;
} else if (status === "invalid_batch") {

  const passMsg = document.getElementById("loginPasswordMsg");
  const msg = document.getElementById("loginErrorMsg");

  msg.style.display = "none";

  passMsg.innerText =
    "Invalid Batch selected. Please choose the correct batch.";
  passMsg.style.display = "block";

  return;
} else if (status === "wrong_password") {

  const passMsg = document.getElementById("loginPasswordMsg");
  const forgotLink = document.getElementById("forgotPasswordLink");
  const msg = document.getElementById("loginErrorMsg");

  // Roll message hide
  msg.style.display = "none";

  // Password error show
  passMsg.innerText =
    "Password is incorrect!";
  passMsg.style.display = "block";

  // 🔥 Forgot Password link show
  forgotLink.style.display = "block";

  return;
} else {

  msg.innerText = "Login failed. Please try again.";
  msg.style.color = "#ff6b6b";
  return;
}

  })
  .catch(() => {
    msg.innerText = "Server is slow. Please try again.";
    msg.style.color = "#ff6b6b";
  });
}

function toggleHelp() {
  const popup = document.getElementById("helpPopup");
  popup.style.display =
    popup.style.display === "block" ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {

  // 🔥 ADD THIS (UX FIX)
if (loginRoll || loginBatch) {

  const hideForgot = () => {
    const forgotLink = document.getElementById("forgotPasswordLink");
    if (forgotLink) forgotLink.style.display = "none";
  };

  if (loginRoll) {
    loginRoll.addEventListener("input", hideForgot);
  }

  if (loginBatch) {
    loginBatch.addEventListener("change", hideForgot);
  }
}


  loginRoll = document.getElementById("loginRoll");
  loginBatch = document.getElementById("loginBatch");
  loginPassword = document.getElementById("loginPassword");

  signupRoll = document.getElementById("signupRoll");
  signupBatch = document.getElementById("signupBatch");
  signupName = document.getElementById("signupName");
  signupPassword = document.getElementById("signupPassword");

  if (loginPassword) {

  // 🔹 Password box pe click
  loginPassword.addEventListener("focus", function () {
    const passMsg = document.getElementById("loginPasswordMsg");
    const forgotLink = document.getElementById("forgotPasswordLink");
    const msg = document.getElementById("loginErrorMsg"); // 👈 contact admin msg

    if (passMsg) passMsg.style.display = "none";
    if (forgotLink) forgotLink.style.display = "none";
    if (msg) msg.style.display = "none";   // 🔥 MAIN FIX
  });

  // 🔹 Password type karte time
  loginPassword.addEventListener("input", function () {
    const passMsg = document.getElementById("loginPasswordMsg");
    const forgotLink = document.getElementById("forgotPasswordLink");
    const msg = document.getElementById("loginErrorMsg");

    if (passMsg) passMsg.style.display = "none";
    if (forgotLink) forgotLink.style.display = "none";
    if (msg) msg.style.display = "none";   // 🔥 MAIN FIX
  });
}


  /* ========= LOGIN ROLL VALIDATION ========= */
  if (loginRoll) {
    loginRoll.addEventListener("input", function () {
      const msg = document.getElementById("loginErrorMsg");

      if (/[^0-9]/.test(this.value)) {
        msg.innerText = "Please enter a valid University Roll Number.";
        msg.style.display = "block";
        this.value = this.value.replace(/[^0-9]/g, "");
      } else {
        msg.style.display = "none";
      }
    });
  }

  /* ========= REGISTER ROLL VALIDATION ========= */
  if (signupRoll) {
    signupRoll.addEventListener("input", function () {
      const msg = document.getElementById("signupErrorMsg");

      if (/[^0-9]/.test(this.value)) {
        msg.innerText = "Please enter a valid University Roll Number.";
        msg.style.display = "block";
        this.value = this.value.replace(/[^0-9]/g, "");
      } else {
        msg.style.display = "none";
      }
    });
  }

});

function forgotPassword(event) {
  event.stopPropagation();   // 🔥 MAIN FIX

  const passMsg = document.getElementById("loginPasswordMsg");
  const forgotLink = document.getElementById("forgotPasswordLink");
  const msg = document.getElementById("loginErrorMsg");

  if (passMsg) passMsg.style.display = "none";
  if (forgotLink) forgotLink.style.display = "none";

  msg.innerText =
    "For security reasons, please contact the admin to reset your password.";
  msg.style.color = "#00d4ff";
  msg.style.display = "block";
}

// 🔥 Hide login messages on click anywhere
document.addEventListener("click", function () {
  const msg = document.getElementById("loginErrorMsg");      // roll / general msg
  const passMsg = document.getElementById("loginPasswordMsg");  // batch / password msg

  if (msg) msg.style.display = "none";
  if (passMsg) passMsg.style.display = "none";
});
 


