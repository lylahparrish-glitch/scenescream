// Paste your own Firebase config here:
const firebaseConfig = {
  apiKey: "YOUR_KEY_HERE",
  authDomain: "YOUR_DOMAIN.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

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

function showFeed(show) {
  authSection.classList.toggle("hidden", show);
  feedSection.classList.toggle("hidden", !show);
}

auth.onAuthStateChanged(user => {
  if (user) {
    showFeed(true);
    loadPosts();
  } else {
    showFeed(false);
  }
});

signupBtn.onclick = async () => {
  try {
    await auth.createUserWithEmailAndPassword(emailInput.value, passInput.value);
  } catch (e) {
    errorP.textContent = e.message;
  }
};

loginBtn.onclick = async () => {
  try {
    await auth.signInWithEmailAndPassword(emailInput.value, passInput.value);
  } catch (e) {
    errorP.textContent = e.message;
  }
};

logoutBtn.onclick = () => auth.signOut();

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

