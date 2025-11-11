// SceneScream JavaScript
console.log("🎀 SceneScream loaded");

// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyDlMtxLSC8VsN-9NnonRo2SrsGcGH5BF5U",
  authDomain: "video-comments-fe3e6.firebaseapp.com",
  projectId: "video-comments-fe3e6",
  storageBucket: "video-comments-fe3e6.firebasestorage.app",
  messagingSenderId: "361268366755",
  appId: "1:361268366755:web:c0c7efccedda5ae4b95e16"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Page switching
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
}

// Auth handling
const loginNav = document.getElementById("loginNav");
const logoutNav = document.getElementById("logoutNav");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authDisplayName = document.getElementById("authDisplayName");
const authUsername = document.getElementById("authUsername");
const authGender = document.getElementById("authGender");
const authDob = document.getElementById("authDob");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const toggleAuthMode = document.getElementById("toggleAuthMode");
const signupFields = document.getElementById("signupFields");
const authMessage = document.getElementById("authMessage");

let isSignUpMode = false;
toggleAuthMode.addEventListener("click", () => {
  isSignUpMode = !isSignUpMode;
  signupFields.style.display = isSignUpMode ? "block" : "none";
  authSubmitBtn.textContent = isSignUpMode ? "Sign Up" : "Sign In";
});

authSubmitBtn.addEventListener("click", async () => {
  const email = authEmail.value;
  const password = authPassword.value;
  try {
    if (isSignUpMode) {
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await db.collection("users").doc(cred.user.uid).set({
        email,
        displayName: authDisplayName.value,
        username: authUsername.value,
        gender: authGender.value,
        dob: authDob.value
      });
      alert("Account created! Please sign in.");
      isSignUpMode = false;
      signupFields.style.display = "none";
    } else {
      await auth.signInWithEmailAndPassword(email, password);
      showPage("home");
    }
  } catch (err) {
    authMessage.textContent = err.message;
  }
});

logoutNav.addEventListener("click", () => auth.signOut());

auth.onAuthStateChanged(user => {
  if (user) {
    loginNav.classList.add("hidden");
    logoutNav.classList.remove("hidden");
  } else {
    loginNav.classList.remove("hidden");
    logoutNav.classList.add("hidden");
  }
});

