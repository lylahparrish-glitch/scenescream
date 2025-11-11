// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDlMtxLSC8VsN-9NnonRo2SrsGcGH5BF5U",
  authDomain: "video-comments-fe3e6.firebaseapp.com",
  projectId: "video-comments-fe3e6",
  storageBucket: "video-comments-fe3e6.appspot.com", // fixed appspot.com domain
  messagingSenderId: "361268366755",
  appId: "1:361268366755:web:c0c7efccedda5ae4b95e16"
};

firebase.initializeApp(firebaseConfig);

// Firebase references
const auth = firebase.auth();
const db = firebase.firestore();

// DOM references
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorP = document.getElementById("error");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const forgotBtn = document.getElementById("forgotBtn");
const logoutBtn = document.getElementById("logoutBtn");
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postsDiv = document.getElementById("posts");

const authSection = document.getElementById("authSection");
const feedSection = document.getElementById("feedSection");

// Show or hide feed
function showFeed(show) {
  authSection.classList.toggle("hidden", show);
  feedSection.classList.toggle("hidden", !show);
}

// Auth state
auth.onAuthStateChanged(user => {
  if (user) {
    showFeed(true);
    loadPosts();
  } else {
    showFeed(false);
  }
});

// Sign up
signupBtn.onclick = async () => {
  try {
    await auth.createUserWithEmailAndPassword(email.value, password.value);
    errorP.textContent = "";
  } catch (err) {
    errorP.textContent = err.message;
  }
};

// Sign in
loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(email.value, password.value);
    errorP.textContent = "";
  } catch (err) {
    errorP.textContent = err.message;
  }
};

// Forgot password
forgotBtn.onclick = async () => {
  if (!email.value) {
    errorP.textContent = "Enter your email above first.";
    return;
  }
  try {
    await auth.sendPasswordResetEmail(email.value);
    errorP.textContent = "Password reset email sent!";
  } catch (err) {
    errorP.textContent = err.message;
  }
};

// Logout
logoutBtn.onclick = () => auth.signOut();

// Post to Firestore
postBtn.onclick = async () => {
  const text = postText.value.trim();
  if (!text) return;
  const user = auth.currentUser;
  await db.collection("posts").add({
    uid: user.uid,
    text,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  postText.value = "";
  loadPosts();
};

// Load posts
async function loadPosts() {
  const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
  postsDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    const div = document.createElement("div");
    div.className = "post";
    div.textContent = data.text;
    postsDiv.appendChild(div);
  });
}
