// Initialize Firebase
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

// DOM Elements
const authPage = document.getElementById("authPage");
const homePage = document.getElementById("homePage");
const profilePage = document.getElementById("profilePage");
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Sign Up
signupBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const username = document.getElementById("username").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;

  try {
    const cred = await auth.createUserWithEmailAndPassword(email, password);
    await cred.user.sendEmailVerification();
    await db.collection("users").doc(cred.user.uid).set({
      name, username, dob, gender, email, createdAt: new Date(),
      profilePic: "", verified: false
    });
    alert("Verification email sent! Please verify and log in.");
  } catch (e) {
    alert(e.message);
  }
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    if (!cred.user.emailVerified) {
      alert("Please verify your email before logging in.");
      auth.signOut();
      return;
    }
    loadHome();
  } catch (e) {
    alert(e.message);
  }
});

// Auth State
auth.onAuthStateChanged(user => {
  if (user && user.emailVerified) {
    showPage("home");
    loadProfile();
    loadFeed();
  } else {
    showPage("auth");
  }
});

logoutBtn.addEventListener("click", () => auth.signOut());

// Show Page
function showPage(p) {
  document.querySelectorAll(".page").forEach(pg => pg.classList.add("hidden"));
  if (p === "home") homePage.classList.remove("hidden");
  if (p === "profile") profilePage.classList.remove("hidden");
  if (p === "auth") authPage.classList.remove("hidden");
}

// Load Profile
async function loadProfile() {
  const user = auth.currentUser;
  if (!user) return;
  const doc = await db.collection("users").doc(user.uid).get();
  const data = doc.data();
  document.getElementById("profileName").textContent = data.name;
  document.getElementById("profileUsername").textContent = "@" + data.username;
  document.getElementById("profileEmail").textContent = data.email;
  if (data.profilePic) document.getElementById("profilePic").src = data.profilePic;
}

// Upload Profile Pic
document.getElementById("profilePicInput").addEventListener("change", async e => {
  const file = e.target.files[0];
  const user = auth.currentUser;
  const ref = storage.ref(`profilePics/${user.uid}.jpg`);
  await ref.put(file);
  const url = await ref.getDownloadURL();
  await db.collection("users").doc(user.uid).update({ profilePic: url });
  loadProfile();
});

// Post
document.getElementById("postBtn").addEventListener("click", async () => {
  const text = document.getElementById("postText").value;
  const img = document.getElementById("postImg").files[0];
  const user = auth.currentUser;
  const ref = db.collection("posts");
  let imgUrl = "";
  if (img) {
    const sref = storage.ref(`posts/${user.uid}/${Date.now()}.jpg`);
    await sref.put(img);
    imgUrl = await sref.getDownloadURL();
  }
  await ref.add({
    uid: user.uid, text, imgUrl, createdAt: new Date()
  });
  document.getElementById("postText").value = "";
  document.getElementById("postImg").value = "";
  loadFeed();
});

// Load Feed
async function loadFeed() {
  const feed = document.getElementById("feed");
  feed.innerHTML = "";
  const snap = await db.collection("posts").orderBy("createdAt", "desc").get();
  snap.forEach(doc => {
    const p = doc.data();
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<p>${p.text}</p>${p.imgUrl ? `<img src="${p.imgUrl}" style="max-width:100%;border-radius:10px;">` : ""}`;
    feed.appendChild(div);
  });
}
