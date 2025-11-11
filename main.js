// Initialize Firebase with your real config
const firebaseConfig = {
  apiKey: "AIzaSyDlMtxLSC8VsN-9NnonRo2SrsGcGH5BF5U",
  authDomain: "video-comments-fe3e6.firebaseapp.com",
  projectId: "video-comments-fe3e6",
  storageBucket: "video-comments-fe3e6.firebasestorage.app",
  messagingSenderId: "361268366755",
  appId: "1:361268366755:web:c0c7efccedda5ae4b95e16"
};

firebase.initializeApp(firebaseConfig);

// Firebase references
const auth = firebase.auth();
const db = firebase.firestore();

// DOM references
const authSection = document.getElementById("auth");
const feedSection = document.getElementById("feed");
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const errorP = document.getElementById("error");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");
const postBtn = document.getElementById("postBtn");
const postText = document.getElementById("postText");
const postsDiv = document.getElementById("posts");

// Toggle between auth and feed views
function showFeed(show) {
  authSection.classList.toggle("hidden", show);
  feedSection.classList.toggle("hidden", !show);
}

// Auth state listener
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
    await auth.createUserWithEmailAndPassword(emailInput.value, passInput.value);
  } catch (e) {
    errorP.textContent = e.message;
  }
};

// Sign in
loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(emailInput.value, passInput.value);
  } catch (e) {
    errorP.textContent = e.message;
  }
};

// Sign out
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

// Load all posts
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
