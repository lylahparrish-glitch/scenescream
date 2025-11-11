console.log("SceneScream Phase 1 ready!");

const firebaseConfig = {
  apiKey: "AIzaSyDlMtxLSC8VsN-9NnonRo2SrsGcGH5BF5U",
  authDomain: "video-comments-fe3e6.firebaseapp.com",
  projectId: "video-comments-fe3e6",
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const pages = {
  home: document.getElementById("page-home"),
  profile: document.getElementById("page-profile"),
  auth: document.getElementById("page-auth")
};
function show(id) {
  Object.values(pages).forEach(p => p.classList.add("hidden"));
  pages[id].classList.remove("hidden");
}

const navHome=document.getElementById("navHome");
const navProfile=document.getElementById("navProfile");
const navAuth=document.getElementById("navAuth");
const navLogout=document.getElementById("navLogout");

navHome.onclick=()=>show("home");
navProfile.onclick=()=>show("profile");
navAuth.onclick=()=>show("auth");
navLogout.onclick=()=>auth.signOut();

const composer=document.getElementById("composer");
const postBtn=document.getElementById("postBtn");
const postText=document.getElementById("postText");
const feed=document.getElementById("feed");

const authEmail=document.getElementById("authEmail");
const authPassword=document.getElementById("authPassword");
const authName=document.getElementById("authName");
const authUsername=document.getElementById("authUsername");
const authDob=document.getElementById("authDob");
const authGender=document.getElementById("authGender");
const authSubmit=document.getElementById("authSubmit");
const toggleAuth=document.getElementById("toggleAuth");
const signupExtra=document.getElementById("signupExtra");
const authMsg=document.getElementById("authMsg");
let signUp=false;

toggleAuth.onclick=()=>{
  signUp=!signUp;
  signupExtra.classList.toggle("hidden",!signUp);
  authSubmit.textContent=signUp?"Sign Up":"Sign In";
  document.getElementById("authTitle").textContent=signUp?"Create Account 🌟":"Sign In ✨";
};

authSubmit.onclick=async()=>{
  const email=authEmail.value,pass=authPassword.value;
  if(signUp){
    try{
      const cred=await auth.createUserWithEmailAndPassword(email,pass);
      await db.collection("users").doc(cred.user.uid).set({
        name:authName.value,username:authUsername.value,
        dob:authDob.value,gender:authGender.value,email
      });
      authMsg.textContent="Account created! Now sign in.";
      signUp=false; toggleAuth.click();
    }catch(e){authMsg.textContent=e.message;}
  }else{
    try{await auth.signInWithEmailAndPassword(email,pass);}
    catch(e){authMsg.textContent=e.message;}
  }
};

auth.onAuthStateChanged(user=>{
  if(user){
    navAuth.classList.add("hidden");
    navLogout.classList.remove("hidden");
    composer.classList.remove("hidden");
    loadFeed();
    show("home");
  }else{
    navAuth.classList.remove("hidden");
    navLogout.classList.add("hidden");
    composer.classList.add("hidden");
    feed.innerHTML="";
    show("auth");
  }
});

postBtn.onclick=async()=>{
  const text=postText.value.trim();
  if(!text)return;
  const user=auth.currentUser;
  await db.collection("posts").add({
    text,uid:user.uid,created:firebase.firestore.FieldValue.serverTimestamp()
  });
  postText.value="";
  loadFeed();
};

async function loadFeed(){
  const snap=await db.collection("posts").orderBy("created","desc").limit(20).get();
  feed.innerHTML="";
  snap.forEach(doc=>{
    const p=doc.data();
    const el=document.createElement("div");
    el.className="card";
    el.textContent=p.text;
    feed.appendChild(el);
  });
}
