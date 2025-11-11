diff --git a/main.js b/main.js
index 9691a26a9d85c2d270d0beedd8b59db8ea03d3f3..b49561d6050b6efbcb87b7cc003dd678236097bc 100644
--- a/main.js
+++ b/main.js
@@ -1,1085 +1,1033 @@
-diff --git a/main.js b/main.js
-index c7772648f0cf281fa60327a47335b083cdbda5f8..b49561d6050b6efbcb87b7cc003dd678236097bc 100644
---- a/main.js
-+++ b/main.js
-@@ -1,81 +1,1033 @@
--// SceneScream JavaScript
-+// SceneScream front-end logic
- console.log("🎀 SceneScream loaded");
- 
--// Firebase setup
--const firebaseConfig = {
--  apiKey: "AIzaSyDlMtxLSC8VsN-9NnonRo2SrsGcGH5BF5U",
--  authDomain: "video-comments-fe3e6.firebaseapp.com",
--  projectId: "video-comments-fe3e6",
--  storageBucket: "video-comments-fe3e6.firebasestorage.app",
--  messagingSenderId: "361268366755",
--  appId: "1:361268366755:web:c0c7efccedda5ae4b95e16"
-+// Storage helpers ---------------------------------------------------------
-+const STORAGE_KEYS = {
-+  users: "ss_users",
-+  posts: "ss_posts",
-+  watchComments: "ss_watch_comments",
-+  watchSessions: "ss_watch_sessions",
-+  currentUser: "ss_current_user"
- };
--firebase.initializeApp(firebaseConfig);
--const auth = firebase.auth();
--const db = firebase.firestore();
--const storage = firebase.storage();
- 
--// Page switching
--function showPage(id) {
--  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
--  document.getElementById('page-' + id).classList.add('active');
-+function loadFromStorage(key, fallback) {
-+  try {
-+    const raw = localStorage.getItem(key);
-+    return raw ? JSON.parse(raw) : fallback;
-+  } catch (err) {
-+    console.error("Failed to load", key, err);
-+    return fallback;
-+  }
-+}
-+
-+function saveToStorage(key, value) {
-+  try {
-+    localStorage.setItem(key, JSON.stringify(value));
-+  } catch (err) {
-+    console.error("Failed to save", key, err);
-+  }
- }
- 
--// Auth handling
-+let users = loadFromStorage(STORAGE_KEYS.users, []);
-+let posts = loadFromStorage(STORAGE_KEYS.posts, []);
-+let watchComments = loadFromStorage(STORAGE_KEYS.watchComments, []);
-+let watchSessions = loadFromStorage(STORAGE_KEYS.watchSessions, []);
-+let currentUserId = localStorage.getItem(STORAGE_KEYS.currentUser) || null;
-+
-+const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
-+
-+// DOM references ----------------------------------------------------------
- const loginNav = document.getElementById("loginNav");
- const logoutNav = document.getElementById("logoutNav");
-+const homeSignInBtn = document.getElementById("homeSignInBtn");
-+const composer = document.getElementById("composer");
-+const welcomeCard = document.getElementById("welcomeCard");
-+const postBtn = document.getElementById("postBtn");
-+const postText = document.getElementById("postText");
-+const postShowTitle = document.getElementById("postShowTitle");
-+const postSeason = document.getElementById("postSeason");
-+const postEpisode = document.getElementById("postEpisode");
-+const feedContainer = document.getElementById("feedContainer");
-+
-+const authTitle = document.getElementById("authTitle");
- const authEmail = document.getElementById("authEmail");
- const authPassword = document.getElementById("authPassword");
- const authDisplayName = document.getElementById("authDisplayName");
- const authUsername = document.getElementById("authUsername");
- const authGender = document.getElementById("authGender");
- const authDob = document.getElementById("authDob");
- const authSubmitBtn = document.getElementById("authSubmitBtn");
- const toggleAuthMode = document.getElementById("toggleAuthMode");
- const signupFields = document.getElementById("signupFields");
- const authMessage = document.getElementById("authMessage");
-+const verifyEmailInput = document.getElementById("verifyEmail");
-+const verifyCodeInput = document.getElementById("verifyCode");
-+const verifyBtn = document.getElementById("verifyBtn");
-+const verifyMessage = document.getElementById("verifyMessage");
-+
-+const profilePic = document.getElementById("profilePic");
-+const profilePicInput = document.getElementById("profilePicInput");
-+const changePicBtn = document.getElementById("changePicBtn");
-+const profileNameInput = document.getElementById("profileNameInput");
-+const profileUsernameInput = document.getElementById("profileUsernameInput");
-+const usernameChangeInfo = document.getElementById("usernameChangeInfo");
-+const profileGender = document.getElementById("profileGender");
-+const profileDob = document.getElementById("profileDob");
-+const profileStatus = document.getElementById("profileStatus");
-+const profileFavorites = document.getElementById("profileFavorites");
-+const profileThemeColor = document.getElementById("profileThemeColor");
-+const bioInput = document.getElementById("bioInput");
-+const saveProfileBtn = document.getElementById("saveProfileBtn");
-+const profileMessage = document.getElementById("profileMessage");
-+const myPostsContainer = document.getElementById("myPostsContainer");
-+
-+const friendsList = document.getElementById("friendsList");
-+const searchInput = document.getElementById("searchInput");
-+const searchBtn = document.getElementById("searchBtn");
-+const searchResults = document.getElementById("searchResults");
-+
-+const publicProfilePic = document.getElementById("publicProfilePic");
-+const publicProfileName = document.getElementById("publicProfileName");
-+const publicProfileUsername = document.getElementById("publicProfileUsername");
-+const publicProfileStatus = document.getElementById("publicProfileStatus");
-+const publicProfileBio = document.getElementById("publicProfileBio");
-+const publicProfileFavorites = document.getElementById("publicProfileFavorites");
-+const publicProfilePosts = document.getElementById("publicProfilePosts");
-+const publicPostsTitle = document.getElementById("publicPostsTitle");
-+const backToFeedBtn = document.getElementById("backToFeed");
-+
-+const watchType = document.getElementById("watchType");
-+const watchTitle = document.getElementById("watchTitle");
-+const watchSeason = document.getElementById("watchSeason");
-+const watchEpisode = document.getElementById("watchEpisode");
-+const watchEpisodeBlock = document.getElementById("watchEpisodeBlock");
-+const watchTimerDisplay = document.getElementById("watchTimerDisplay");
-+const startWatchBtn = document.getElementById("startWatchBtn");
-+const watchCommentText = document.getElementById("watchCommentText");
-+const watchCommentBtn = document.getElementById("watchCommentBtn");
-+const watchCommentsList = document.getElementById("watchCommentsList");
-+const watchSessionHistory = document.getElementById("watchSessionHistory");
-+const activeSessionInfo = document.getElementById("activeSessionInfo");
-+const activeSessionTitle = document.getElementById("activeSessionTitle");
-+const activeSessionMeta = document.getElementById("activeSessionMeta");
-+
-+// Utility helpers --------------------------------------------------------
-+function showPage(id) {
-+  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
-+  document.getElementById("page-" + id).classList.add("active");
-+}
-+
-+function findUserById(id) {
-+  return users.find((u) => u.id === id) || null;
-+}
-+
-+function findUserByEmail(email) {
-+  const normalized = email.trim().toLowerCase();
-+  return users.find((u) => u.email.toLowerCase() === normalized) || null;
-+}
-+
-+function formatDateTime(timestamp) {
-+  if (!timestamp) return "";
-+  const date = new Date(timestamp);
-+  return date.toLocaleString(undefined, {
-+    month: "short",
-+    day: "numeric",
-+    hour: "2-digit",
-+    minute: "2-digit"
-+  });
-+}
-+
-+function formatElapsed(seconds) {
-+  const hrs = Math.floor(seconds / 3600);
-+  const mins = Math.floor((seconds % 3600) / 60);
-+  const secs = seconds % 60;
-+  const pad = (n) => n.toString().padStart(2, "0");
-+  if (hrs > 0) {
-+    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
-+  }
-+  return `${pad(mins)}:${pad(secs)}`;
-+}
-+
-+function escapeHtml(str) {
-+  return str
-+    .replace(/&/g, "&amp;")
-+    .replace(/</g, "&lt;")
-+    .replace(/>/g, "&gt;")
-+    .replace(/"/g, "&quot;")
-+    .replace(/'/g, "&#039;");
-+}
-+
-+function ensureLoggedIn(actionName) {
-+  if (!currentUserId) {
-+    alert(`Sign in to ${actionName}.`);
-+    showPage("auth");
-+    return false;
-+  }
-+  return true;
-+}
-+
-+function persistUsers() {
-+  saveToStorage(STORAGE_KEYS.users, users);
-+}
-+
-+function persistPosts() {
-+  saveToStorage(STORAGE_KEYS.posts, posts);
-+}
-+
-+function persistWatchComments() {
-+  saveToStorage(STORAGE_KEYS.watchComments, watchComments);
-+}
-+
-+function persistWatchSessions() {
-+  saveToStorage(STORAGE_KEYS.watchSessions, watchSessions);
-+}
- 
-+function setCurrentUser(id) {
-+  currentUserId = id;
-+  if (id) {
-+    localStorage.setItem(STORAGE_KEYS.currentUser, id);
-+  } else {
-+    localStorage.removeItem(STORAGE_KEYS.currentUser);
-+  }
-+  updateAuthUI();
-+  renderApp();
-+}
-+
-+function getDisplayName(user) {
-+  return user.displayName || user.username || user.email;
-+}
-+
-+// Authentication ---------------------------------------------------------
- let isSignUpMode = false;
--toggleAuthMode.addEventListener("click", () => {
-+
-+function toggleAuth() {
-   isSignUpMode = !isSignUpMode;
--  signupFields.style.display = isSignUpMode ? "block" : "none";
-+  signupFields.classList.toggle("hidden", !isSignUpMode);
-+  authTitle.textContent = isSignUpMode ? "Create Account 🌟" : "Sign In ✨";
-   authSubmitBtn.textContent = isSignUpMode ? "Sign Up" : "Sign In";
-+  toggleAuthMode.textContent = isSignUpMode
-+    ? "Already have an account? Sign in"
-+    : "Don’t have an account? Sign up";
-+  authMessage.textContent = "";
-+}
-+
-+toggleAuthMode.addEventListener("click", () => {
-+  toggleAuth();
-+});
-+
-+loginNav.addEventListener("click", () => {
-+  showPage("auth");
- });
- 
--authSubmitBtn.addEventListener("click", async () => {
--  const email = authEmail.value;
-+homeSignInBtn.addEventListener("click", () => {
-+  showPage("auth");
-+});
-+
-+logoutNav.addEventListener("click", () => {
-+  setCurrentUser(null);
-+  showPage("home");
-+});
-+
-+authSubmitBtn.addEventListener("click", () => {
-+  const email = authEmail.value.trim();
-   const password = authPassword.value;
--  try {
--    if (isSignUpMode) {
--      const cred = await auth.createUserWithEmailAndPassword(email, password);
--      await db.collection("users").doc(cred.user.uid).set({
--        email,
--        displayName: authDisplayName.value,
--        username: authUsername.value,
--        gender: authGender.value,
--        dob: authDob.value
--      });
--      alert("Account created! Please sign in.");
--      isSignUpMode = false;
--      signupFields.style.display = "none";
--    } else {
--      await auth.signInWithEmailAndPassword(email, password);
--      showPage("home");
-+  authMessage.textContent = "";
-+
-+  if (!email || !password) {
-+    authMessage.textContent = "Enter your email and password.";
-+    return;
-+  }
-+
-+  if (isSignUpMode) {
-+    handleSignUp(email, password);
-+  } else {
-+    handleSignIn(email, password);
-+  }
-+});
-+
-+function handleSignUp(email, password) {
-+  const displayName = authDisplayName.value.trim();
-+  const username = authUsername.value.trim();
-+  const gender = authGender.value;
-+  const dob = authDob.value;
-+
-+  if (!displayName || !username || !gender || !dob) {
-+    authMessage.textContent = "Please fill in every sign-up field.";
-+    return;
-+  }
-+  if (password.length < 6) {
-+    authMessage.textContent = "Choose a password with at least 6 characters.";
-+    return;
-+  }
-+  if (findUserByEmail(email)) {
-+    authMessage.textContent = "That email is already registered.";
-+    return;
-+  }
-+  const usernameTaken = users.some(
-+    (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
-+  );
-+  if (usernameTaken) {
-+    authMessage.textContent = "That username is already in use.";
-+    return;
-+  }
-+
-+  const newUser = {
-+    id: "user-" + Date.now(),
-+    email,
-+    password,
-+    displayName,
-+    username,
-+    gender,
-+    dob,
-+    verified: false,
-+    verificationCode: generateVerificationCode(),
-+    lastUsernameChange: Date.now(),
-+    status: "",
-+    favorites: "",
-+    bio: "",
-+    themeColor: "#fbd3ff",
-+    profilePic: "",
-+    createdAt: Date.now()
-+  };
-+  users.push(newUser);
-+  persistUsers();
-+
-+  authMessage.textContent = "Account created! Check below to verify your email.";
-+  verifyEmailInput.value = email;
-+  verifyMessage.textContent = `Verification code for ${email}: ${newUser.verificationCode}`;
-+  authPassword.value = "";
-+  authDisplayName.value = "";
-+  authUsername.value = "";
-+  authGender.value = "";
-+  authDob.value = "";
-+  toggleAuth();
-+}
-+
-+function handleSignIn(email, password) {
-+  const user = findUserByEmail(email);
-+  if (!user || user.password !== password) {
-+    authMessage.textContent = "Incorrect email or password.";
-+    return;
-+  }
-+  if (!user.verified) {
-+    authMessage.textContent = "Please verify your email before signing in.";
-+    verifyEmailInput.value = email;
-+    verifyMessage.textContent = `Pending verification for ${email}. Enter your code below.`;
-+    return;
-+  }
-+  authEmail.value = "";
-+  authPassword.value = "";
-+  showPage("home");
-+  setCurrentUser(user.id);
-+}
-+
-+verifyBtn.addEventListener("click", () => {
-+  const email = verifyEmailInput.value.trim();
-+  const code = verifyCodeInput.value.trim();
-+  verifyMessage.textContent = "";
-+  if (!email || !code) {
-+    verifyMessage.textContent = "Enter your email and verification code.";
-+    return;
-+  }
-+  const user = findUserByEmail(email);
-+  if (!user) {
-+    verifyMessage.textContent = "No account found with that email.";
-+    return;
-+  }
-+  if (user.verified) {
-+    verifyMessage.textContent = "This email is already verified. You can sign in!";
-+    return;
-+  }
-+  if (user.verificationCode !== code) {
-+    verifyMessage.textContent = "That code doesn't match. Try again.";
-+    return;
-+  }
-+  user.verified = true;
-+  user.verificationCode = null;
-+  persistUsers();
-+  verifyMessage.textContent = "Email verified! Head back to sign in.";
-+});
-+
-+function generateVerificationCode() {
-+  return Math.floor(100000 + Math.random() * 900000).toString();
-+}
-+
-+// Profile ----------------------------------------------------------------
-+changePicBtn.addEventListener("click", () => {
-+  if (!ensureLoggedIn("update your profile picture")) return;
-+  profilePicInput.click();
-+});
-+
-+profilePicInput.addEventListener("change", (event) => {
-+  const file = event.target.files && event.target.files[0];
-+  if (!file) return;
-+  const reader = new FileReader();
-+  reader.onload = () => {
-+    const user = getCurrentUser();
-+    if (!user) return;
-+    user.profilePic = reader.result;
-+    profilePic.src = reader.result;
-+    persistUsers();
-+    renderFeed();
-+    renderFriendsList();
-+    renderSearchResults(searchInput.value.trim());
-+  };
-+  reader.readAsDataURL(file);
-+});
-+
-+saveProfileBtn.addEventListener("click", () => {
-+  if (!ensureLoggedIn("update your profile")) return;
-+  const user = getCurrentUser();
-+  if (!user) return;
-+
-+  const newDisplayName = profileNameInput.value.trim();
-+  const newUsername = profileUsernameInput.value.trim();
-+  const newGender = profileGender.value;
-+  const newDob = profileDob.value;
-+  const newStatus = profileStatus.value.trim();
-+  const newFavorites = profileFavorites.value.trim();
-+  const newTheme = profileThemeColor.value;
-+  const newBio = bioInput.value.trim();
-+
-+  if (!newDisplayName || !newUsername || !newDob) {
-+    profileMessage.textContent = "Display name, username, and date of birth are required.";
-+    return;
-+  }
-+
-+  if (newUsername.toLowerCase() !== user.username.toLowerCase()) {
-+    const timeSinceChange = Date.now() - (user.lastUsernameChange || 0);
-+    if (timeSinceChange < SEVEN_DAYS_MS) {
-+      const daysLeft = Math.ceil((SEVEN_DAYS_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
-+      profileMessage.textContent = `You can change your username again in ${daysLeft} day(s).`;
-+      profileUsernameInput.value = user.username;
-+      return;
-     }
--  } catch (err) {
--    authMessage.textContent = err.message;
-+    const usernameTaken = users.some(
-+      (u) => u.id !== user.id && u.username && u.username.toLowerCase() === newUsername.toLowerCase()
-+    );
-+    if (usernameTaken) {
-+      profileMessage.textContent = "That username is already taken.";
-+      profileUsernameInput.value = user.username;
-+      return;
-+    }
-+    user.username = newUsername;
-+    user.lastUsernameChange = Date.now();
-   }
-+
-+  user.displayName = newDisplayName;
-+  user.gender = newGender;
-+  user.dob = newDob;
-+  user.status = newStatus;
-+  user.favorites = newFavorites;
-+  user.themeColor = newTheme || "#fbd3ff";
-+  user.bio = newBio;
-+  persistUsers();
-+  applyTheme(user);
-+  renderFeed();
-+  renderFriendsList();
-+  renderSearchResults(searchInput.value.trim());
-+  renderMyPosts();
-+  profileMessage.textContent = "Profile updated!";
-+  setTimeout(() => {
-+    profileMessage.textContent = "";
-+  }, 3000);
- });
- 
--logoutNav.addEventListener("click", () => auth.signOut());
-+function populateProfile() {
-+  const user = getCurrentUser();
-+  if (!user) return;
-+  profilePic.src = user.profilePic || "https://via.placeholder.com/120";
-+  profileNameInput.value = user.displayName || "";
-+  profileUsernameInput.value = user.username || "";
-+  profileGender.value = user.gender || "";
-+  profileDob.value = user.dob || "";
-+  profileStatus.value = user.status || "";
-+  profileFavorites.value = user.favorites || "";
-+  profileThemeColor.value = user.themeColor || "#fbd3ff";
-+  bioInput.value = user.bio || "";
-+  const timeSinceChange = Date.now() - (user.lastUsernameChange || 0);
-+  if (timeSinceChange < SEVEN_DAYS_MS) {
-+    const daysLeft = Math.ceil((SEVEN_DAYS_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
-+    usernameChangeInfo.textContent = `Username can be changed again in ${daysLeft} day(s).`;
-+  } else {
-+    usernameChangeInfo.textContent = "You can update your username now.";
-+  }
-+  applyTheme(user);
-+}
-+
-+function applyTheme(user) {
-+  if (!user || !user.themeColor) return;
-+  const gradient = `linear-gradient(135deg, ${user.themeColor} 0%, #d8c7ff 100%)`;
-+  document.body.style.background = gradient;
-+}
-+
-+function getCurrentUser() {
-+  if (!currentUserId) return null;
-+  return findUserById(currentUserId);
-+}
-+
-+// Posting ----------------------------------------------------------------
-+postBtn.addEventListener("click", () => {
-+  if (!ensureLoggedIn("share a post")) return;
-+  const text = postText.value.trim();
-+  const showTitle = postShowTitle.value.trim();
-+  const season = parseInt(postSeason.value, 10);
-+  const episode = parseInt(postEpisode.value, 10);
-+
-+  if (!text) {
-+    alert("Write something before posting!");
-+    return;
-+  }
- 
--auth.onAuthStateChanged(user => {
--  if (user) {
--    loginNav.classList.add("hidden");
--    logoutNav.classList.remove("hidden");
-+  const user = getCurrentUser();
-+  if (!user) return;
-+
-+  const post = {
-+    id: "post-" + Date.now(),
-+    userId: user.id,
-+    content: text,
-+    createdAt: Date.now(),
-+    likes: [],
-+    comments: [],
-+    showTitle: showTitle || "",
-+    season: Number.isFinite(season) ? season : null,
-+    episode: Number.isFinite(episode) ? episode : null
-+  };
-+
-+  posts.push(post);
-+  persistPosts();
-+  postText.value = "";
-+  postShowTitle.value = "";
-+  postSeason.value = "";
-+  postEpisode.value = "";
-+  renderFeed();
-+  renderMyPosts();
-+});
-+
-+feedContainer.addEventListener("click", (event) => {
-+  const target = event.target.closest("[data-action]");
-+  if (!target) return;
-+  const action = target.dataset.action;
-+  const postId = target.dataset.postId;
-+  if (action === "like") {
-+    toggleLike(postId);
-+  } else if (action === "comment") {
-+    submitComment(postId);
-+  } else if (action === "viewProfile") {
-+    openPublicProfile(target.dataset.userId);
-+  }
-+});
-+
-+feedContainer.addEventListener("keydown", (event) => {
-+  if (event.key === "Enter" && event.metaKey) {
-+    const textarea = event.target.closest("textarea[data-post]");
-+    if (textarea) {
-+      event.preventDefault();
-+      submitComment(textarea.dataset.post);
-+    }
-+  }
-+});
-+
-+function toggleLike(postId) {
-+  if (!ensureLoggedIn("like posts")) return;
-+  const user = getCurrentUser();
-+  const post = posts.find((p) => p.id === postId);
-+  if (!post || !user) return;
-+  const index = post.likes.indexOf(user.id);
-+  if (index >= 0) {
-+    post.likes.splice(index, 1);
-+  } else {
-+    post.likes.push(user.id);
-+  }
-+  persistPosts();
-+  renderFeed();
-+  renderMyPosts();
-+}
-+
-+function submitComment(postId) {
-+  if (!ensureLoggedIn("comment")) return;
-+  const user = getCurrentUser();
-+  const input = document.getElementById(`commentInput-${postId}`);
-+  if (!input || !user) return;
-+  const content = input.value.trim();
-+  if (!content) return;
-+  const post = posts.find((p) => p.id === postId);
-+  if (!post) return;
-+  const comment = {
-+    id: "comment-" + Date.now(),
-+    userId: user.id,
-+    content,
-+    createdAt: Date.now()
-+  };
-+  post.comments.push(comment);
-+  persistPosts();
-+  input.value = "";
-+  renderFeed();
-+  renderMyPosts();
-+}
-+
-+function renderFeed() {
-+  feedContainer.innerHTML = "";
-+  const sorted = posts.slice().sort((a, b) => b.createdAt - a.createdAt);
-+  sorted.forEach((post) => {
-+    const postEl = buildPostElement(post);
-+    feedContainer.appendChild(postEl);
-+  });
-+}
-+
-+function buildPostElement(post) {
-+  const author =
-+    findUserById(post.userId) ||
-+    { id: "", username: "unknown", displayName: "Mystery", profilePic: "" };
-+  const wrapper = document.createElement("article");
-+  wrapper.className = "post-card";
-+  wrapper.dataset.postId = post.id;
-+  const liked = currentUserId && post.likes.includes(currentUserId);
-+  const commentsHtml = post.comments
-+    .map((c) => {
-+      const commenter =
-+        findUserById(c.userId) ||
-+        { id: "", username: "ghost", displayName: "Unknown" };
-+      return `
-+        <div class="comment">
-+          <div class="comment-author" data-action="viewProfile" data-user-id="${commenter.id || ""}">${escapeHtml(getDisplayName(commenter))}</div>
-+          <div class="comment-body">${escapeHtml(c.content)}</div>
-+          <div class="info-text">${formatDateTime(c.createdAt)}</div>
-+        </div>
-+      `;
-+    })
-+    .join("");
-+  const showContext = buildShowContext(post);
-+  wrapper.innerHTML = `
-+    <div class="post-header">
-+      <img class="avatar" src="${author.profilePic || "https://via.placeholder.com/80"}" alt="${escapeHtml(getDisplayName(author))}" />
-+      <div class="post-meta">
-+        <span class="name" data-action="viewProfile" data-user-id="${author.id}">${escapeHtml(getDisplayName(author))}</span>
-+        <span class="username">@${escapeHtml(author.username || "user")}</span>
-+        <span class="info-text">${formatDateTime(post.createdAt)}</span>
-+      </div>
-+    </div>
-+    <div class="post-content">${escapeHtml(post.content)}</div>
-+    ${showContext}
-+    <div class="post-footer">
-+      <button class="like-btn ${liked ? "active" : ""}" data-action="like" data-post-id="${post.id}">❤ <span>${post.likes.length}</span></button>
-+      <span class="info-text">${post.comments.length} comment(s)</span>
-+    </div>
-+    <div class="comment-list">${commentsHtml}</div>
-+    <div class="comment-form">
-+      <textarea id="commentInput-${post.id}" data-post="${post.id}" placeholder="Leave a comment"></textarea>
-+      <button class="btn-pill small" data-action="comment" data-post-id="${post.id}">Send</button>
-+    </div>
-+  `;
-+  if (!currentUserId) {
-+    wrapper.querySelector(`#commentInput-${post.id}`).setAttribute("disabled", "disabled");
-+    wrapper.querySelector(`[data-action="comment"]`).setAttribute("disabled", "disabled");
-+  }
-+  return wrapper;
-+}
-+
-+function buildShowContext(post) {
-+  if (!post.showTitle) return "";
-+  const parts = [`Watching ${escapeHtml(post.showTitle)}`];
-+  if (post.season) {
-+    parts.push(`Season ${post.season}`);
-+  }
-+  if (post.episode) {
-+    parts.push(`Episode ${post.episode}`);
-+  }
-+  return `<div class="post-context">${parts.join(" • ")}</div>`;
-+}
-+
-+function renderMyPosts() {
-+  if (!currentUserId) {
-+    myPostsContainer.innerHTML = "";
-+    return;
-+  }
-+  myPostsContainer.innerHTML = "";
-+  const mine = posts.filter((p) => p.userId === currentUserId).sort((a, b) => b.createdAt - a.createdAt);
-+  mine.forEach((post) => {
-+    const el = buildPostElement(post);
-+    myPostsContainer.appendChild(el);
-+  });
-+}
-+
-+// Friends & search -------------------------------------------------------
-+function renderFriendsList() {
-+  friendsList.innerHTML = "";
-+  if (!currentUserId) {
-+    friendsList.innerHTML = "<p class='info-text'>Sign in to explore the community.</p>";
-+    return;
-+  }
-+  const others = users.filter((u) => u.id !== currentUserId && u.verified);
-+  if (others.length === 0) {
-+    friendsList.innerHTML = "<p class='info-text'>No other verified fans yet. Spread the word!</p>";
-+    return;
-+  }
-+  others.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
-+  others.forEach((user) => {
-+    const card = document.createElement("div");
-+    card.className = "friend-card";
-+    card.innerHTML = `
-+      <div class="friend-info">
-+        <strong>${escapeHtml(getDisplayName(user))}</strong>
-+        <span>@${escapeHtml(user.username)}</span>
-+      </div>
-+      <button class="btn-pill small" data-view-user="${user.id}">View Profile</button>
-+    `;
-+    friendsList.appendChild(card);
-+  });
-+}
-+
-+friendsList.addEventListener("click", (event) => {
-+  const button = event.target.closest("[data-view-user]");
-+  if (!button) return;
-+  openPublicProfile(button.dataset.viewUser);
-+});
-+
-+searchBtn.addEventListener("click", () => {
-+  const query = searchInput.value.trim();
-+  renderSearchResults(query);
-+});
-+
-+searchInput.addEventListener("keydown", (event) => {
-+  if (event.key === "Enter") {
-+    renderSearchResults(searchInput.value.trim());
-+  }
-+});
-+
-+function renderSearchResults(query) {
-+  searchResults.innerHTML = "";
-+  if (!query) {
-+    return;
-+  }
-+  const lower = query.toLowerCase();
-+  const matches = users.filter((user) => {
-+    if (!user.verified) return false;
-+    const nameMatch = (user.displayName || "").toLowerCase().includes(lower);
-+    const usernameMatch = (user.username || "").toLowerCase().includes(lower);
-+    return nameMatch || usernameMatch;
-+  });
-+  matches.forEach((user) => {
-+    const row = document.createElement("div");
-+    row.className = "search-result";
-+    row.innerHTML = `
-+      <div class="search-info">
-+        <strong>${escapeHtml(getDisplayName(user))}</strong>
-+        <span>@${escapeHtml(user.username)}</span>
-+      </div>
-+      <button class="btn-pill small" data-view-user="${user.id}">View</button>
-+    `;
-+    searchResults.appendChild(row);
-+  });
-+  if (matches.length === 0) {
-+    searchResults.innerHTML = "<p class='info-text'>No fans matched that search yet.</p>";
-+  }
-+}
-+
-+searchResults.addEventListener("click", (event) => {
-+  const button = event.target.closest("[data-view-user]");
-+  if (!button) return;
-+  openPublicProfile(button.dataset.viewUser);
-+});
-+
-+backToFeedBtn.addEventListener("click", () => {
-+  showPage("home");
-+});
-+
-+function openPublicProfile(userId) {
-+  const user = findUserById(userId);
-+  if (!user) return;
-+  publicProfilePic.src = user.profilePic || "https://via.placeholder.com/120";
-+  publicProfileName.textContent = getDisplayName(user);
-+  publicProfileUsername.textContent = `@${user.username}`;
-+  publicProfileStatus.textContent = user.status || "";
-+  publicProfileBio.textContent = user.bio || "";
-+  publicProfileFavorites.textContent = user.favorites ? `Favorites: ${user.favorites}` : "";
-+  publicPostsTitle.textContent = `${getDisplayName(user)}'s Posts`;
-+  publicProfilePosts.innerHTML = "";
-+  const userPosts = posts.filter((p) => p.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
-+  userPosts.forEach((post) => {
-+    const el = buildPostElement(post);
-+    publicProfilePosts.appendChild(el);
-+  });
-+  showPage("public-profile");
-+}
-+
-+// Watch party ------------------------------------------------------------
-+const watchState = {
-+  activeKey: null,
-+  running: false,
-+  startTimestamp: null,
-+  elapsedSeconds: 0,
-+  timerInterval: null
-+};
-+
-+watchType.addEventListener("change", () => {
-+  if (watchType.value === "movie") {
-+    watchEpisodeBlock.style.display = "none";
-+    watchSeason.value = "";
-+    watchEpisode.value = "";
-   } else {
--    loginNav.classList.remove("hidden");
--    logoutNav.classList.add("hidden");
-+    watchEpisodeBlock.style.display = "grid";
-   }
- });
- 
-+startWatchBtn.addEventListener("click", () => {
-+  if (watchState.running) {
-+    stopWatchTimer();
-+  } else {
-+    beginWatchTimer();
-+  }
-+});
-+
-+watchCommentBtn.addEventListener("click", () => {
-+  if (!ensureLoggedIn("drop live comments")) return;
-+  if (!watchState.activeKey) {
-+    alert("Start or select a session first.");
-+    return;
-+  }
-+  const text = watchCommentText.value.trim();
-+  if (!text) return;
-+  const user = getCurrentUser();
-+  if (!user) return;
-+  const comment = {
-+    id: "wc-" + Date.now(),
-+    sessionKey: watchState.activeKey,
-+    userId: user.id,
-+    text,
-+    timestampSeconds: watchState.elapsedSeconds || 0,
-+    createdAt: Date.now()
-+  };
-+  watchComments.push(comment);
-+  persistWatchComments();
-+  watchCommentText.value = "";
-+  renderLiveComments();
-+});
-+
-+watchSessionHistory.addEventListener("click", (event) => {
-+  const pill = event.target.closest(".session-pill");
-+  if (!pill) return;
-+  const key = pill.dataset.sessionKey;
-+  setActiveSession(key);
-+  stopWatchTimer(true);
-+});
-+
-+function beginWatchTimer() {
-+  const type = watchType.value;
-+  const title = watchTitle.value.trim();
-+  if (!title) {
-+    alert("Enter the title of the show or movie.");
-+    return;
-+  }
-+  let season = null;
-+  let episode = null;
-+  if (type === "show") {
-+    season = parseInt(watchSeason.value, 10);
-+    episode = parseInt(watchEpisode.value, 10);
-+    if (!Number.isFinite(season) || season <= 0 || !Number.isFinite(episode) || episode <= 0) {
-+      alert("Please provide season and episode numbers for a show.");
-+      return;
-+    }
-+  }
-+  const meta = {
-+    key: buildSessionKey(type, title, season, episode),
-+    type,
-+    title,
-+    season: season || null,
-+    episode: episode || null
-+  };
-+  setActiveSession(meta.key, meta);
-+  watchState.running = true;
-+  watchState.startTimestamp = Date.now();
-+  watchState.elapsedSeconds = 0;
-+  if (watchState.timerInterval) clearInterval(watchState.timerInterval);
-+  watchState.timerInterval = setInterval(updateWatchTimer, 1000);
-+  updateWatchTimer();
-+  startWatchBtn.textContent = "Stop Timer";
-+  saveSession(meta);
-+}
-+
-+function stopWatchTimer(keepSession = true) {
-+  watchState.running = false;
-+  watchState.startTimestamp = null;
-+  if (!keepSession) {
-+    watchState.elapsedSeconds = 0;
-+    watchState.activeKey = null;
-+    activeSessionInfo.hidden = true;
-+  }
-+  if (watchState.timerInterval) {
-+    clearInterval(watchState.timerInterval);
-+    watchState.timerInterval = null;
-+  }
-+  watchTimerDisplay.textContent = formatElapsed(watchState.elapsedSeconds);
-+  startWatchBtn.textContent = "Start Timer";
-+}
-+
-+function updateWatchTimer() {
-+  if (!watchState.running || !watchState.startTimestamp) return;
-+  const elapsed = Math.floor((Date.now() - watchState.startTimestamp) / 1000);
-+  watchState.elapsedSeconds = elapsed;
-+  watchTimerDisplay.textContent = formatElapsed(elapsed);
-+  renderLiveComments();
-+}
-+
-+function renderLiveComments() {
-+  watchCommentsList.innerHTML = "";
-+  if (!watchState.activeKey) {
-+    watchCommentsList.innerHTML = "<p class='info-text'>Start a session to see synchronized reactions.</p>";
-+    return;
-+  }
-+  const comments = watchComments
-+    .filter((c) => c.sessionKey === watchState.activeKey)
-+    .sort((a, b) => a.timestampSeconds - b.timestampSeconds || a.createdAt - b.createdAt);
-+  comments.forEach((comment) => {
-+    const user = findUserById(comment.userId) || { displayName: "Unknown", username: "unknown" };
-+    const wrapper = document.createElement("div");
-+    wrapper.className = "live-comment";
-+    if (comment.timestampSeconds <= watchState.elapsedSeconds) {
-+      wrapper.classList.add("highlight");
-+    }
-+    wrapper.innerHTML = `
-+      <div class="timestamp">${formatElapsed(comment.timestampSeconds)}</div>
-+      <div><strong>${escapeHtml(getDisplayName(user))}</strong> said:</div>
-+      <div>${escapeHtml(comment.text)}</div>
-+    `;
-+    watchCommentsList.appendChild(wrapper);
-+  });
-+  if (comments.length === 0) {
-+    watchCommentsList.innerHTML = "<p class='info-text'>No live comments yet. Be the first!</p>";
-+  }
-+}
-+
-+function saveSession(meta) {
-+  const existingIndex = watchSessions.findIndex((s) => s.key === meta.key);
-+  const entry = {
-+    key: meta.key,
-+    type: meta.type,
-+    title: meta.title,
-+    season: meta.season,
-+    episode: meta.episode,
-+    lastActiveAt: Date.now()
-+  };
-+  if (existingIndex >= 0) {
-+    watchSessions.splice(existingIndex, 1, entry);
-+  } else {
-+    watchSessions.push(entry);
-+  }
-+  watchSessions.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
-+  watchSessions = watchSessions.slice(0, 20);
-+  persistWatchSessions();
-+  renderWatchSessionHistory();
-+}
-+
-+function renderWatchSessionHistory() {
-+  watchSessionHistory.innerHTML = "";
-+  if (watchSessions.length === 0) {
-+    watchSessionHistory.innerHTML = "<p class='info-text'>No sessions yet. Start one above!</p>";
-+    return;
-+  }
-+  watchSessions.forEach((session) => {
-+    const pill = document.createElement("button");
-+    pill.className = "session-pill";
-+    pill.dataset.sessionKey = session.key;
-+    const meta = describeSession(session);
-+    pill.innerHTML = `<span>${escapeHtml(meta.title)}</span><span class="info-text">${escapeHtml(meta.meta)}</span>`;
-+    watchSessionHistory.appendChild(pill);
-+  });
-+}
-+
-+function buildSessionKey(type, title, season, episode) {
-+  const normTitle = title.trim().toLowerCase().replace(/\s+/g, "_");
-+  if (type === "movie") {
-+    return `movie|${normTitle}`;
-+  }
-+  return `show|${normTitle}|s${season}|e${episode}`;
-+}
-+
-+function getSessionMeta(key) {
-+  return watchSessions.find((s) => s.key === key) || parseSessionKey(key);
-+}
-+
-+function parseSessionKey(key) {
-+  const parts = key.split("|");
-+  if (parts[0] === "movie") {
-+    return {
-+      key,
-+      type: "movie",
-+      title: parts[1].replace(/_/g, " "),
-+      season: null,
-+      episode: null
-+    };
-+  }
-+  if (parts[0] === "show") {
-+    return {
-+      key,
-+      type: "show",
-+      title: parts[1].replace(/_/g, " "),
-+      season: parseInt(parts[2].replace("s", ""), 10),
-+      episode: parseInt(parts[3].replace("e", ""), 10)
-+    };
-+  }
-+  return null;
-+}
-+
-+function describeSession(session) {
-+  const title = session.title;
-+  const meta = session.type === "movie" ? "Movie" : `S${session.season} · E${session.episode}`;
-+  return { title, meta };
-+}
-+
-+function setActiveSession(key, metaOverride) {
-+  const meta = metaOverride || getSessionMeta(key);
-+  if (!meta) return;
-+  watchState.activeKey = key;
-+  watchState.elapsedSeconds = 0;
-+  activeSessionInfo.hidden = false;
-+  activeSessionTitle.textContent = meta.title;
-+  if (meta.type === "movie") {
-+    activeSessionMeta.textContent = "Movie";
-+  } else {
-+    activeSessionMeta.textContent = `Season ${meta.season} • Episode ${meta.episode}`;
-+  }
-+  watchType.value = meta.type;
-+  watchTitle.value = meta.title;
-+  if (meta.type === "show") {
-+    watchEpisodeBlock.style.display = "grid";
-+    watchSeason.value = meta.season || "";
-+    watchEpisode.value = meta.episode || "";
-+  } else {
-+    watchEpisodeBlock.style.display = "none";
-+    watchSeason.value = "";
-+    watchEpisode.value = "";
-+  }
-+  watchTimerDisplay.textContent = formatElapsed(watchState.elapsedSeconds || 0);
-+  renderLiveComments();
-+}
-+
-+// UI updates -------------------------------------------------------------
-+function updateAuthUI() {
-+  const isLoggedIn = Boolean(currentUserId);
-+  loginNav.classList.toggle("hidden", isLoggedIn);
-+  logoutNav.classList.toggle("hidden", !isLoggedIn);
-+  welcomeCard.classList.toggle("hidden", isLoggedIn);
-+  composer.classList.toggle("hidden", !isLoggedIn);
-+  if (!isLoggedIn) {
-+    document.body.style.background = "linear-gradient(135deg, #fbd3ff 0%, #d8c7ff 100%)";
-+  } else {
-+    applyTheme(getCurrentUser());
-+  }
-+}
-+
-+function renderApp() {
-+  populateProfile();
-+  renderFeed();
-+  renderMyPosts();
-+  renderFriendsList();
-+  renderSearchResults(searchInput.value.trim());
-+  renderWatchSessionHistory();
-+  renderLiveComments();
-+}
-+
-+// Initialization ---------------------------------------------------------
-+updateAuthUI();
-+renderApp();
+// SceneScream front-end logic
+console.log("🎀 SceneScream loaded");
+
+// Storage helpers ---------------------------------------------------------
+const STORAGE_KEYS = {
+  users: "ss_users",
+  posts: "ss_posts",
+  watchComments: "ss_watch_comments",
+  watchSessions: "ss_watch_sessions",
+  currentUser: "ss_current_user"
+};
+
+function loadFromStorage(key, fallback) {
+  try {
+    const raw = localStorage.getItem(key);
+    return raw ? JSON.parse(raw) : fallback;
+  } catch (err) {
+    console.error("Failed to load", key, err);
+    return fallback;
+  }
+}
+
+function saveToStorage(key, value) {
+  try {
+    localStorage.setItem(key, JSON.stringify(value));
+  } catch (err) {
+    console.error("Failed to save", key, err);
+  }
+}
+
+let users = loadFromStorage(STORAGE_KEYS.users, []);
+let posts = loadFromStorage(STORAGE_KEYS.posts, []);
+let watchComments = loadFromStorage(STORAGE_KEYS.watchComments, []);
+let watchSessions = loadFromStorage(STORAGE_KEYS.watchSessions, []);
+let currentUserId = localStorage.getItem(STORAGE_KEYS.currentUser) || null;
+
+const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
+
+// DOM references ----------------------------------------------------------
+const loginNav = document.getElementById("loginNav");
+const logoutNav = document.getElementById("logoutNav");
+const homeSignInBtn = document.getElementById("homeSignInBtn");
+const composer = document.getElementById("composer");
+const welcomeCard = document.getElementById("welcomeCard");
+const postBtn = document.getElementById("postBtn");
+const postText = document.getElementById("postText");
+const postShowTitle = document.getElementById("postShowTitle");
+const postSeason = document.getElementById("postSeason");
+const postEpisode = document.getElementById("postEpisode");
+const feedContainer = document.getElementById("feedContainer");
+
+const authTitle = document.getElementById("authTitle");
+const authEmail = document.getElementById("authEmail");
+const authPassword = document.getElementById("authPassword");
+const authDisplayName = document.getElementById("authDisplayName");
+const authUsername = document.getElementById("authUsername");
+const authGender = document.getElementById("authGender");
+const authDob = document.getElementById("authDob");
+const authSubmitBtn = document.getElementById("authSubmitBtn");
+const toggleAuthMode = document.getElementById("toggleAuthMode");
+const signupFields = document.getElementById("signupFields");
+const authMessage = document.getElementById("authMessage");
+const verifyEmailInput = document.getElementById("verifyEmail");
+const verifyCodeInput = document.getElementById("verifyCode");
+const verifyBtn = document.getElementById("verifyBtn");
+const verifyMessage = document.getElementById("verifyMessage");
+
+const profilePic = document.getElementById("profilePic");
+const profilePicInput = document.getElementById("profilePicInput");
+const changePicBtn = document.getElementById("changePicBtn");
+const profileNameInput = document.getElementById("profileNameInput");
+const profileUsernameInput = document.getElementById("profileUsernameInput");
+const usernameChangeInfo = document.getElementById("usernameChangeInfo");
+const profileGender = document.getElementById("profileGender");
+const profileDob = document.getElementById("profileDob");
+const profileStatus = document.getElementById("profileStatus");
+const profileFavorites = document.getElementById("profileFavorites");
+const profileThemeColor = document.getElementById("profileThemeColor");
+const bioInput = document.getElementById("bioInput");
+const saveProfileBtn = document.getElementById("saveProfileBtn");
+const profileMessage = document.getElementById("profileMessage");
+const myPostsContainer = document.getElementById("myPostsContainer");
+
+const friendsList = document.getElementById("friendsList");
+const searchInput = document.getElementById("searchInput");
+const searchBtn = document.getElementById("searchBtn");
+const searchResults = document.getElementById("searchResults");
+
+const publicProfilePic = document.getElementById("publicProfilePic");
+const publicProfileName = document.getElementById("publicProfileName");
+const publicProfileUsername = document.getElementById("publicProfileUsername");
+const publicProfileStatus = document.getElementById("publicProfileStatus");
+const publicProfileBio = document.getElementById("publicProfileBio");
+const publicProfileFavorites = document.getElementById("publicProfileFavorites");
+const publicProfilePosts = document.getElementById("publicProfilePosts");
+const publicPostsTitle = document.getElementById("publicPostsTitle");
+const backToFeedBtn = document.getElementById("backToFeed");
+
+const watchType = document.getElementById("watchType");
+const watchTitle = document.getElementById("watchTitle");
+const watchSeason = document.getElementById("watchSeason");
+const watchEpisode = document.getElementById("watchEpisode");
+const watchEpisodeBlock = document.getElementById("watchEpisodeBlock");
+const watchTimerDisplay = document.getElementById("watchTimerDisplay");
+const startWatchBtn = document.getElementById("startWatchBtn");
+const watchCommentText = document.getElementById("watchCommentText");
+const watchCommentBtn = document.getElementById("watchCommentBtn");
+const watchCommentsList = document.getElementById("watchCommentsList");
+const watchSessionHistory = document.getElementById("watchSessionHistory");
+const activeSessionInfo = document.getElementById("activeSessionInfo");
+const activeSessionTitle = document.getElementById("activeSessionTitle");
+const activeSessionMeta = document.getElementById("activeSessionMeta");
+
+// Utility helpers --------------------------------------------------------
+function showPage(id) {
+  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
+  document.getElementById("page-" + id).classList.add("active");
+}
+
+function findUserById(id) {
+  return users.find((u) => u.id === id) || null;
+}
+
+function findUserByEmail(email) {
+  const normalized = email.trim().toLowerCase();
+  return users.find((u) => u.email.toLowerCase() === normalized) || null;
+}
+
+function formatDateTime(timestamp) {
+  if (!timestamp) return "";
+  const date = new Date(timestamp);
+  return date.toLocaleString(undefined, {
+    month: "short",
+    day: "numeric",
+    hour: "2-digit",
+    minute: "2-digit"
+  });
+}
+
+function formatElapsed(seconds) {
+  const hrs = Math.floor(seconds / 3600);
+  const mins = Math.floor((seconds % 3600) / 60);
+  const secs = seconds % 60;
+  const pad = (n) => n.toString().padStart(2, "0");
+  if (hrs > 0) {
+    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
+  }
+  return `${pad(mins)}:${pad(secs)}`;
+}
+
+function escapeHtml(str) {
+  return str
+    .replace(/&/g, "&amp;")
+    .replace(/</g, "&lt;")
+    .replace(/>/g, "&gt;")
+    .replace(/"/g, "&quot;")
+    .replace(/'/g, "&#039;");
+}
+
+function ensureLoggedIn(actionName) {
+  if (!currentUserId) {
+    alert(`Sign in to ${actionName}.`);
+    showPage("auth");
+    return false;
+  }
+  return true;
+}
+
+function persistUsers() {
+  saveToStorage(STORAGE_KEYS.users, users);
+}
+
+function persistPosts() {
+  saveToStorage(STORAGE_KEYS.posts, posts);
+}
+
+function persistWatchComments() {
+  saveToStorage(STORAGE_KEYS.watchComments, watchComments);
+}
+
+function persistWatchSessions() {
+  saveToStorage(STORAGE_KEYS.watchSessions, watchSessions);
+}
+
+function setCurrentUser(id) {
+  currentUserId = id;
+  if (id) {
+    localStorage.setItem(STORAGE_KEYS.currentUser, id);
+  } else {
+    localStorage.removeItem(STORAGE_KEYS.currentUser);
+  }
+  updateAuthUI();
+  renderApp();
+}
+
+function getDisplayName(user) {
+  return user.displayName || user.username || user.email;
+}
+
+// Authentication ---------------------------------------------------------
+let isSignUpMode = false;
+
+function toggleAuth() {
+  isSignUpMode = !isSignUpMode;
+  signupFields.classList.toggle("hidden", !isSignUpMode);
+  authTitle.textContent = isSignUpMode ? "Create Account 🌟" : "Sign In ✨";
+  authSubmitBtn.textContent = isSignUpMode ? "Sign Up" : "Sign In";
+  toggleAuthMode.textContent = isSignUpMode
+    ? "Already have an account? Sign in"
+    : "Don’t have an account? Sign up";
+  authMessage.textContent = "";
+}
+
+toggleAuthMode.addEventListener("click", () => {
+  toggleAuth();
+});
+
+loginNav.addEventListener("click", () => {
+  showPage("auth");
+});
+
+homeSignInBtn.addEventListener("click", () => {
+  showPage("auth");
+});
+
+logoutNav.addEventListener("click", () => {
+  setCurrentUser(null);
+  showPage("home");
+});
+
+authSubmitBtn.addEventListener("click", () => {
+  const email = authEmail.value.trim();
+  const password = authPassword.value;
+  authMessage.textContent = "";
+
+  if (!email || !password) {
+    authMessage.textContent = "Enter your email and password.";
+    return;
+  }
+
+  if (isSignUpMode) {
+    handleSignUp(email, password);
+  } else {
+    handleSignIn(email, password);
+  }
+});
+
+function handleSignUp(email, password) {
+  const displayName = authDisplayName.value.trim();
+  const username = authUsername.value.trim();
+  const gender = authGender.value;
+  const dob = authDob.value;
+
+  if (!displayName || !username || !gender || !dob) {
+    authMessage.textContent = "Please fill in every sign-up field.";
+    return;
+  }
+  if (password.length < 6) {
+    authMessage.textContent = "Choose a password with at least 6 characters.";
+    return;
+  }
+  if (findUserByEmail(email)) {
+    authMessage.textContent = "That email is already registered.";
+    return;
+  }
+  const usernameTaken = users.some(
+    (u) => u.username && u.username.toLowerCase() === username.toLowerCase()
+  );
+  if (usernameTaken) {
+    authMessage.textContent = "That username is already in use.";
+    return;
+  }
+
+  const newUser = {
+    id: "user-" + Date.now(),
+    email,
+    password,
+    displayName,
+    username,
+    gender,
+    dob,
+    verified: false,
+    verificationCode: generateVerificationCode(),
+    lastUsernameChange: Date.now(),
+    status: "",
+    favorites: "",
+    bio: "",
+    themeColor: "#fbd3ff",
+    profilePic: "",
+    createdAt: Date.now()
+  };
+  users.push(newUser);
+  persistUsers();
+
+  authMessage.textContent = "Account created! Check below to verify your email.";
+  verifyEmailInput.value = email;
+  verifyMessage.textContent = `Verification code for ${email}: ${newUser.verificationCode}`;
+  authPassword.value = "";
+  authDisplayName.value = "";
+  authUsername.value = "";
+  authGender.value = "";
+  authDob.value = "";
+  toggleAuth();
+}
+
+function handleSignIn(email, password) {
+  const user = findUserByEmail(email);
+  if (!user || user.password !== password) {
+    authMessage.textContent = "Incorrect email or password.";
+    return;
+  }
+  if (!user.verified) {
+    authMessage.textContent = "Please verify your email before signing in.";
+    verifyEmailInput.value = email;
+    verifyMessage.textContent = `Pending verification for ${email}. Enter your code below.`;
+    return;
+  }
+  authEmail.value = "";
+  authPassword.value = "";
+  showPage("home");
+  setCurrentUser(user.id);
+}
+
+verifyBtn.addEventListener("click", () => {
+  const email = verifyEmailInput.value.trim();
+  const code = verifyCodeInput.value.trim();
+  verifyMessage.textContent = "";
+  if (!email || !code) {
+    verifyMessage.textContent = "Enter your email and verification code.";
+    return;
+  }
+  const user = findUserByEmail(email);
+  if (!user) {
+    verifyMessage.textContent = "No account found with that email.";
+    return;
+  }
+  if (user.verified) {
+    verifyMessage.textContent = "This email is already verified. You can sign in!";
+    return;
+  }
+  if (user.verificationCode !== code) {
+    verifyMessage.textContent = "That code doesn't match. Try again.";
+    return;
+  }
+  user.verified = true;
+  user.verificationCode = null;
+  persistUsers();
+  verifyMessage.textContent = "Email verified! Head back to sign in.";
+});
+
+function generateVerificationCode() {
+  return Math.floor(100000 + Math.random() * 900000).toString();
+}
+
+// Profile ----------------------------------------------------------------
+changePicBtn.addEventListener("click", () => {
+  if (!ensureLoggedIn("update your profile picture")) return;
+  profilePicInput.click();
+});
+
+profilePicInput.addEventListener("change", (event) => {
+  const file = event.target.files && event.target.files[0];
+  if (!file) return;
+  const reader = new FileReader();
+  reader.onload = () => {
+    const user = getCurrentUser();
+    if (!user) return;
+    user.profilePic = reader.result;
+    profilePic.src = reader.result;
+    persistUsers();
+    renderFeed();
+    renderFriendsList();
+    renderSearchResults(searchInput.value.trim());
+  };
+  reader.readAsDataURL(file);
+});
+
+saveProfileBtn.addEventListener("click", () => {
+  if (!ensureLoggedIn("update your profile")) return;
+  const user = getCurrentUser();
+  if (!user) return;
+
+  const newDisplayName = profileNameInput.value.trim();
+  const newUsername = profileUsernameInput.value.trim();
+  const newGender = profileGender.value;
+  const newDob = profileDob.value;
+  const newStatus = profileStatus.value.trim();
+  const newFavorites = profileFavorites.value.trim();
+  const newTheme = profileThemeColor.value;
+  const newBio = bioInput.value.trim();
+
+  if (!newDisplayName || !newUsername || !newDob) {
+    profileMessage.textContent = "Display name, username, and date of birth are required.";
+    return;
+  }
+
+  if (newUsername.toLowerCase() !== user.username.toLowerCase()) {
+    const timeSinceChange = Date.now() - (user.lastUsernameChange || 0);
+    if (timeSinceChange < SEVEN_DAYS_MS) {
+      const daysLeft = Math.ceil((SEVEN_DAYS_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
+      profileMessage.textContent = `You can change your username again in ${daysLeft} day(s).`;
+      profileUsernameInput.value = user.username;
+      return;
+    }
+    const usernameTaken = users.some(
+      (u) => u.id !== user.id && u.username && u.username.toLowerCase() === newUsername.toLowerCase()
+    );
+    if (usernameTaken) {
+      profileMessage.textContent = "That username is already taken.";
+      profileUsernameInput.value = user.username;
+      return;
+    }
+    user.username = newUsername;
+    user.lastUsernameChange = Date.now();
+  }
+
+  user.displayName = newDisplayName;
+  user.gender = newGender;
+  user.dob = newDob;
+  user.status = newStatus;
+  user.favorites = newFavorites;
+  user.themeColor = newTheme || "#fbd3ff";
+  user.bio = newBio;
+  persistUsers();
+  applyTheme(user);
+  renderFeed();
+  renderFriendsList();
+  renderSearchResults(searchInput.value.trim());
+  renderMyPosts();
+  profileMessage.textContent = "Profile updated!";
+  setTimeout(() => {
+    profileMessage.textContent = "";
+  }, 3000);
+});
+
+function populateProfile() {
+  const user = getCurrentUser();
+  if (!user) return;
+  profilePic.src = user.profilePic || "https://via.placeholder.com/120";
+  profileNameInput.value = user.displayName || "";
+  profileUsernameInput.value = user.username || "";
+  profileGender.value = user.gender || "";
+  profileDob.value = user.dob || "";
+  profileStatus.value = user.status || "";
+  profileFavorites.value = user.favorites || "";
+  profileThemeColor.value = user.themeColor || "#fbd3ff";
+  bioInput.value = user.bio || "";
+  const timeSinceChange = Date.now() - (user.lastUsernameChange || 0);
+  if (timeSinceChange < SEVEN_DAYS_MS) {
+    const daysLeft = Math.ceil((SEVEN_DAYS_MS - timeSinceChange) / (24 * 60 * 60 * 1000));
+    usernameChangeInfo.textContent = `Username can be changed again in ${daysLeft} day(s).`;
+  } else {
+    usernameChangeInfo.textContent = "You can update your username now.";
+  }
+  applyTheme(user);
+}
+
+function applyTheme(user) {
+  if (!user || !user.themeColor) return;
+  const gradient = `linear-gradient(135deg, ${user.themeColor} 0%, #d8c7ff 100%)`;
+  document.body.style.background = gradient;
+}
+
+function getCurrentUser() {
+  if (!currentUserId) return null;
+  return findUserById(currentUserId);
+}
+
+// Posting ----------------------------------------------------------------
+postBtn.addEventListener("click", () => {
+  if (!ensureLoggedIn("share a post")) return;
+  const text = postText.value.trim();
+  const showTitle = postShowTitle.value.trim();
+  const season = parseInt(postSeason.value, 10);
+  const episode = parseInt(postEpisode.value, 10);
+
+  if (!text) {
+    alert("Write something before posting!");
+    return;
+  }
+
+  const user = getCurrentUser();
+  if (!user) return;
+
+  const post = {
+    id: "post-" + Date.now(),
+    userId: user.id,
+    content: text,
+    createdAt: Date.now(),
+    likes: [],
+    comments: [],
+    showTitle: showTitle || "",
+    season: Number.isFinite(season) ? season : null,
+    episode: Number.isFinite(episode) ? episode : null
+  };
+
+  posts.push(post);
+  persistPosts();
+  postText.value = "";
+  postShowTitle.value = "";
+  postSeason.value = "";
+  postEpisode.value = "";
+  renderFeed();
+  renderMyPosts();
+});
+
+feedContainer.addEventListener("click", (event) => {
+  const target = event.target.closest("[data-action]");
+  if (!target) return;
+  const action = target.dataset.action;
+  const postId = target.dataset.postId;
+  if (action === "like") {
+    toggleLike(postId);
+  } else if (action === "comment") {
+    submitComment(postId);
+  } else if (action === "viewProfile") {
+    openPublicProfile(target.dataset.userId);
+  }
+});
+
+feedContainer.addEventListener("keydown", (event) => {
+  if (event.key === "Enter" && event.metaKey) {
+    const textarea = event.target.closest("textarea[data-post]");
+    if (textarea) {
+      event.preventDefault();
+      submitComment(textarea.dataset.post);
+    }
+  }
+});
+
+function toggleLike(postId) {
+  if (!ensureLoggedIn("like posts")) return;
+  const user = getCurrentUser();
+  const post = posts.find((p) => p.id === postId);
+  if (!post || !user) return;
+  const index = post.likes.indexOf(user.id);
+  if (index >= 0) {
+    post.likes.splice(index, 1);
+  } else {
+    post.likes.push(user.id);
+  }
+  persistPosts();
+  renderFeed();
+  renderMyPosts();
+}
+
+function submitComment(postId) {
+  if (!ensureLoggedIn("comment")) return;
+  const user = getCurrentUser();
+  const input = document.getElementById(`commentInput-${postId}`);
+  if (!input || !user) return;
+  const content = input.value.trim();
+  if (!content) return;
+  const post = posts.find((p) => p.id === postId);
+  if (!post) return;
+  const comment = {
+    id: "comment-" + Date.now(),
+    userId: user.id,
+    content,
+    createdAt: Date.now()
+  };
+  post.comments.push(comment);
+  persistPosts();
+  input.value = "";
+  renderFeed();
+  renderMyPosts();
+}
+
+function renderFeed() {
+  feedContainer.innerHTML = "";
+  const sorted = posts.slice().sort((a, b) => b.createdAt - a.createdAt);
+  sorted.forEach((post) => {
+    const postEl = buildPostElement(post);
+    feedContainer.appendChild(postEl);
+  });
+}
+
+function buildPostElement(post) {
+  const author =
+    findUserById(post.userId) ||
+    { id: "", username: "unknown", displayName: "Mystery", profilePic: "" };
+  const wrapper = document.createElement("article");
+  wrapper.className = "post-card";
+  wrapper.dataset.postId = post.id;
+  const liked = currentUserId && post.likes.includes(currentUserId);
+  const commentsHtml = post.comments
+    .map((c) => {
+      const commenter =
+        findUserById(c.userId) ||
+        { id: "", username: "ghost", displayName: "Unknown" };
+      return `
+        <div class="comment">
+          <div class="comment-author" data-action="viewProfile" data-user-id="${commenter.id || ""}">${escapeHtml(getDisplayName(commenter))}</div>
+          <div class="comment-body">${escapeHtml(c.content)}</div>
+          <div class="info-text">${formatDateTime(c.createdAt)}</div>
+        </div>
+      `;
+    })
+    .join("");
+  const showContext = buildShowContext(post);
+  wrapper.innerHTML = `
+    <div class="post-header">
+      <img class="avatar" src="${author.profilePic || "https://via.placeholder.com/80"}" alt="${escapeHtml(getDisplayName(author))}" />
+      <div class="post-meta">
+        <span class="name" data-action="viewProfile" data-user-id="${author.id}">${escapeHtml(getDisplayName(author))}</span>
+        <span class="username">@${escapeHtml(author.username || "user")}</span>
+        <span class="info-text">${formatDateTime(post.createdAt)}</span>
+      </div>
+    </div>
+    <div class="post-content">${escapeHtml(post.content)}</div>
+    ${showContext}
+    <div class="post-footer">
+      <button class="like-btn ${liked ? "active" : ""}" data-action="like" data-post-id="${post.id}">❤ <span>${post.likes.length}</span></button>
+      <span class="info-text">${post.comments.length} comment(s)</span>
+    </div>
+    <div class="comment-list">${commentsHtml}</div>
+    <div class="comment-form">
+      <textarea id="commentInput-${post.id}" data-post="${post.id}" placeholder="Leave a comment"></textarea>
+      <button class="btn-pill small" data-action="comment" data-post-id="${post.id}">Send</button>
+    </div>
+  `;
+  if (!currentUserId) {
+    wrapper.querySelector(`#commentInput-${post.id}`).setAttribute("disabled", "disabled");
+    wrapper.querySelector(`[data-action="comment"]`).setAttribute("disabled", "disabled");
+  }
+  return wrapper;
+}
+
+function buildShowContext(post) {
+  if (!post.showTitle) return "";
+  const parts = [`Watching ${escapeHtml(post.showTitle)}`];
+  if (post.season) {
+    parts.push(`Season ${post.season}`);
+  }
+  if (post.episode) {
+    parts.push(`Episode ${post.episode}`);
+  }
+  return `<div class="post-context">${parts.join(" • ")}</div>`;
+}
+
+function renderMyPosts() {
+  if (!currentUserId) {
+    myPostsContainer.innerHTML = "";
+    return;
+  }
+  myPostsContainer.innerHTML = "";
+  const mine = posts.filter((p) => p.userId === currentUserId).sort((a, b) => b.createdAt - a.createdAt);
+  mine.forEach((post) => {
+    const el = buildPostElement(post);
+    myPostsContainer.appendChild(el);
+  });
+}
+
+// Friends & search -------------------------------------------------------
+function renderFriendsList() {
+  friendsList.innerHTML = "";
+  if (!currentUserId) {
+    friendsList.innerHTML = "<p class='info-text'>Sign in to explore the community.</p>";
+    return;
+  }
+  const others = users.filter((u) => u.id !== currentUserId && u.verified);
+  if (others.length === 0) {
+    friendsList.innerHTML = "<p class='info-text'>No other verified fans yet. Spread the word!</p>";
+    return;
+  }
+  others.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
+  others.forEach((user) => {
+    const card = document.createElement("div");
+    card.className = "friend-card";
+    card.innerHTML = `
+      <div class="friend-info">
+        <strong>${escapeHtml(getDisplayName(user))}</strong>
+        <span>@${escapeHtml(user.username)}</span>
+      </div>
+      <button class="btn-pill small" data-view-user="${user.id}">View Profile</button>
+    `;
+    friendsList.appendChild(card);
+  });
+}
+
+friendsList.addEventListener("click", (event) => {
+  const button = event.target.closest("[data-view-user]");
+  if (!button) return;
+  openPublicProfile(button.dataset.viewUser);
+});
+
+searchBtn.addEventListener("click", () => {
+  const query = searchInput.value.trim();
+  renderSearchResults(query);
+});
+
+searchInput.addEventListener("keydown", (event) => {
+  if (event.key === "Enter") {
+    renderSearchResults(searchInput.value.trim());
+  }
+});
+
+function renderSearchResults(query) {
+  searchResults.innerHTML = "";
+  if (!query) {
+    return;
+  }
+  const lower = query.toLowerCase();
+  const matches = users.filter((user) => {
+    if (!user.verified) return false;
+    const nameMatch = (user.displayName || "").toLowerCase().includes(lower);
+    const usernameMatch = (user.username || "").toLowerCase().includes(lower);
+    return nameMatch || usernameMatch;
+  });
+  matches.forEach((user) => {
+    const row = document.createElement("div");
+    row.className = "search-result";
+    row.innerHTML = `
+      <div class="search-info">
+        <strong>${escapeHtml(getDisplayName(user))}</strong>
+        <span>@${escapeHtml(user.username)}</span>
+      </div>
+      <button class="btn-pill small" data-view-user="${user.id}">View</button>
+    `;
+    searchResults.appendChild(row);
+  });
+  if (matches.length === 0) {
+    searchResults.innerHTML = "<p class='info-text'>No fans matched that search yet.</p>";
+  }
+}
+
+searchResults.addEventListener("click", (event) => {
+  const button = event.target.closest("[data-view-user]");
+  if (!button) return;
+  openPublicProfile(button.dataset.viewUser);
+});
+
+backToFeedBtn.addEventListener("click", () => {
+  showPage("home");
+});
+
+function openPublicProfile(userId) {
+  const user = findUserById(userId);
+  if (!user) return;
+  publicProfilePic.src = user.profilePic || "https://via.placeholder.com/120";
+  publicProfileName.textContent = getDisplayName(user);
+  publicProfileUsername.textContent = `@${user.username}`;
+  publicProfileStatus.textContent = user.status || "";
+  publicProfileBio.textContent = user.bio || "";
+  publicProfileFavorites.textContent = user.favorites ? `Favorites: ${user.favorites}` : "";
+  publicPostsTitle.textContent = `${getDisplayName(user)}'s Posts`;
+  publicProfilePosts.innerHTML = "";
+  const userPosts = posts.filter((p) => p.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
+  userPosts.forEach((post) => {
+    const el = buildPostElement(post);
+    publicProfilePosts.appendChild(el);
+  });
+  showPage("public-profile");
+}
+
+// Watch party ------------------------------------------------------------
+const watchState = {
+  activeKey: null,
+  running: false,
+  startTimestamp: null,
+  elapsedSeconds: 0,
+  timerInterval: null
+};
+
+watchType.addEventListener("change", () => {
+  if (watchType.value === "movie") {
+    watchEpisodeBlock.style.display = "none";
+    watchSeason.value = "";
+    watchEpisode.value = "";
+  } else {
+    watchEpisodeBlock.style.display = "grid";
+  }
+});
+
+startWatchBtn.addEventListener("click", () => {
+  if (watchState.running) {
+    stopWatchTimer();
+  } else {
+    beginWatchTimer();
+  }
+});
+
+watchCommentBtn.addEventListener("click", () => {
+  if (!ensureLoggedIn("drop live comments")) return;
+  if (!watchState.activeKey) {
+    alert("Start or select a session first.");
+    return;
+  }
+  const text = watchCommentText.value.trim();
+  if (!text) return;
+  const user = getCurrentUser();
+  if (!user) return;
+  const comment = {
+    id: "wc-" + Date.now(),
+    sessionKey: watchState.activeKey,
+    userId: user.id,
+    text,
+    timestampSeconds: watchState.elapsedSeconds || 0,
+    createdAt: Date.now()
+  };
+  watchComments.push(comment);
+  persistWatchComments();
+  watchCommentText.value = "";
+  renderLiveComments();
+});
+
+watchSessionHistory.addEventListener("click", (event) => {
+  const pill = event.target.closest(".session-pill");
+  if (!pill) return;
+  const key = pill.dataset.sessionKey;
+  setActiveSession(key);
+  stopWatchTimer(true);
+});
+
+function beginWatchTimer() {
+  const type = watchType.value;
+  const title = watchTitle.value.trim();
+  if (!title) {
+    alert("Enter the title of the show or movie.");
+    return;
+  }
+  let season = null;
+  let episode = null;
+  if (type === "show") {
+    season = parseInt(watchSeason.value, 10);
+    episode = parseInt(watchEpisode.value, 10);
+    if (!Number.isFinite(season) || season <= 0 || !Number.isFinite(episode) || episode <= 0) {
+      alert("Please provide season and episode numbers for a show.");
+      return;
+    }
+  }
+  const meta = {
+    key: buildSessionKey(type, title, season, episode),
+    type,
+    title,
+    season: season || null,
+    episode: episode || null
+  };
+  setActiveSession(meta.key, meta);
+  watchState.running = true;
+  watchState.startTimestamp = Date.now();
+  watchState.elapsedSeconds = 0;
+  if (watchState.timerInterval) clearInterval(watchState.timerInterval);
+  watchState.timerInterval = setInterval(updateWatchTimer, 1000);
+  updateWatchTimer();
+  startWatchBtn.textContent = "Stop Timer";
+  saveSession(meta);
+}
+
+function stopWatchTimer(keepSession = true) {
+  watchState.running = false;
+  watchState.startTimestamp = null;
+  if (!keepSession) {
+    watchState.elapsedSeconds = 0;
+    watchState.activeKey = null;
+    activeSessionInfo.hidden = true;
+  }
+  if (watchState.timerInterval) {
+    clearInterval(watchState.timerInterval);
+    watchState.timerInterval = null;
+  }
+  watchTimerDisplay.textContent = formatElapsed(watchState.elapsedSeconds);
+  startWatchBtn.textContent = "Start Timer";
+}
+
+function updateWatchTimer() {
+  if (!watchState.running || !watchState.startTimestamp) return;
+  const elapsed = Math.floor((Date.now() - watchState.startTimestamp) / 1000);
+  watchState.elapsedSeconds = elapsed;
+  watchTimerDisplay.textContent = formatElapsed(elapsed);
+  renderLiveComments();
+}
+
+function renderLiveComments() {
+  watchCommentsList.innerHTML = "";
+  if (!watchState.activeKey) {
+    watchCommentsList.innerHTML = "<p class='info-text'>Start a session to see synchronized reactions.</p>";
+    return;
+  }
+  const comments = watchComments
+    .filter((c) => c.sessionKey === watchState.activeKey)
+    .sort((a, b) => a.timestampSeconds - b.timestampSeconds || a.createdAt - b.createdAt);
+  comments.forEach((comment) => {
+    const user = findUserById(comment.userId) || { displayName: "Unknown", username: "unknown" };
+    const wrapper = document.createElement("div");
+    wrapper.className = "live-comment";
+    if (comment.timestampSeconds <= watchState.elapsedSeconds) {
+      wrapper.classList.add("highlight");
+    }
+    wrapper.innerHTML = `
+      <div class="timestamp">${formatElapsed(comment.timestampSeconds)}</div>
+      <div><strong>${escapeHtml(getDisplayName(user))}</strong> said:</div>
+      <div>${escapeHtml(comment.text)}</div>
+    `;
+    watchCommentsList.appendChild(wrapper);
+  });
+  if (comments.length === 0) {
+    watchCommentsList.innerHTML = "<p class='info-text'>No live comments yet. Be the first!</p>";
+  }
+}
+
+function saveSession(meta) {
+  const existingIndex = watchSessions.findIndex((s) => s.key === meta.key);
+  const entry = {
+    key: meta.key,
+    type: meta.type,
+    title: meta.title,
+    season: meta.season,
+    episode: meta.episode,
+    lastActiveAt: Date.now()
+  };
+  if (existingIndex >= 0) {
+    watchSessions.splice(existingIndex, 1, entry);
+  } else {
+    watchSessions.push(entry);
+  }
+  watchSessions.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
+  watchSessions = watchSessions.slice(0, 20);
+  persistWatchSessions();
+  renderWatchSessionHistory();
+}
+
+function renderWatchSessionHistory() {
+  watchSessionHistory.innerHTML = "";
+  if (watchSessions.length === 0) {
+    watchSessionHistory.innerHTML = "<p class='info-text'>No sessions yet. Start one above!</p>";
+    return;
+  }
+  watchSessions.forEach((session) => {
+    const pill = document.createElement("button");
+    pill.className = "session-pill";
+    pill.dataset.sessionKey = session.key;
+    const meta = describeSession(session);
+    pill.innerHTML = `<span>${escapeHtml(meta.title)}</span><span class="info-text">${escapeHtml(meta.meta)}</span>`;
+    watchSessionHistory.appendChild(pill);
+  });
+}
+
+function buildSessionKey(type, title, season, episode) {
+  const normTitle = title.trim().toLowerCase().replace(/\s+/g, "_");
+  if (type === "movie") {
+    return `movie|${normTitle}`;
+  }
+  return `show|${normTitle}|s${season}|e${episode}`;
+}
+
+function getSessionMeta(key) {
+  return watchSessions.find((s) => s.key === key) || parseSessionKey(key);
+}
+
+function parseSessionKey(key) {
+  const parts = key.split("|");
+  if (parts[0] === "movie") {
+    return {
+      key,
+      type: "movie",
+      title: parts[1].replace(/_/g, " "),
+      season: null,
+      episode: null
+    };
+  }
+  if (parts[0] === "show") {
+    return {
+      key,
+      type: "show",
+      title: parts[1].replace(/_/g, " "),
+      season: parseInt(parts[2].replace("s", ""), 10),
+      episode: parseInt(parts[3].replace("e", ""), 10)
+    };
+  }
+  return null;
+}
+
+function describeSession(session) {
+  const title = session.title;
+  const meta = session.type === "movie" ? "Movie" : `S${session.season} · E${session.episode}`;
+  return { title, meta };
+}
+
+function setActiveSession(key, metaOverride) {
+  const meta = metaOverride || getSessionMeta(key);
+  if (!meta) return;
+  watchState.activeKey = key;
+  watchState.elapsedSeconds = 0;
+  activeSessionInfo.hidden = false;
+  activeSessionTitle.textContent = meta.title;
+  if (meta.type === "movie") {
+    activeSessionMeta.textContent = "Movie";
+  } else {
+    activeSessionMeta.textContent = `Season ${meta.season} • Episode ${meta.episode}`;
+  }
+  watchType.value = meta.type;
+  watchTitle.value = meta.title;
+  if (meta.type === "show") {
+    watchEpisodeBlock.style.display = "grid";
+    watchSeason.value = meta.season || "";
+    watchEpisode.value = meta.episode || "";
+  } else {
+    watchEpisodeBlock.style.display = "none";
+    watchSeason.value = "";
+    watchEpisode.value = "";
+  }
+  watchTimerDisplay.textContent = formatElapsed(watchState.elapsedSeconds || 0);
+  renderLiveComments();
+}
+
+// UI updates -------------------------------------------------------------
+function updateAuthUI() {
+  const isLoggedIn = Boolean(currentUserId);
+  loginNav.classList.toggle("hidden", isLoggedIn);
+  logoutNav.classList.toggle("hidden", !isLoggedIn);
+  welcomeCard.classList.toggle("hidden", isLoggedIn);
+  composer.classList.toggle("hidden", !isLoggedIn);
+  if (!isLoggedIn) {
+    document.body.style.background = "linear-gradient(135deg, #fbd3ff 0%, #d8c7ff 100%)";
+  } else {
+    applyTheme(getCurrentUser());
+  }
+}
+
+function renderApp() {
+  populateProfile();
+  renderFeed();
+  renderMyPosts();
+  renderFriendsList();
+  renderSearchResults(searchInput.value.trim());
+  renderWatchSessionHistory();
+  renderLiveComments();
+}
+
+// Initialization ---------------------------------------------------------
+updateAuthUI();
+renderApp();
