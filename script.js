// =====================================================
// script.js: builds and runs the whole Aconite website
// Sections: 1 Settings  2 Your info  3 State  4 Local accounts
//           5 Screens   6 Actions    7 Start
// =====================================================


// ---------- 1. SETTINGS (edit these) ----------

// The developer account: whoever logs in with this email sees the site's own
// homepage ("Hi, I'm Aconite"). CHANGE THIS to the email you sign up with.
const DEVELOPER_EMAIL = "aconiteofthevalley@gmail.com";

// Your pictures
const LOGO_SRC = "file:///C:/Users/joana/OneDrive/Desktop/Personal%20Webpage/cake.png";
const PROFILE_SRC = "file:///C:/Users/joana/OneDrive/Desktop/Personal%20Webpage/5a45455dee8a1c68c98b18d9f7f3ee56.png";


// ---------- 2. YOUR INFO (change the words here) ----------

const SITE_NAME = "Aconite";
const INITIALS = "AC";
const TABS = ["HOME", "MEDIA", "PROJECTS", "EMOTIONS", "FISH", "TOMODACHI", "BLOG", "CRYSTAL"];
const TAB_LABELS = { EMOTIONS: "Emotion bubbles", FISH: "Draw a Fish", TOMODACHI: "Tomodachi", BLOG: "Blog maker", CRYSTAL: "Crystal tunes" };   // menu names that aren't just the tab name
function tabLabel(tab) {
  return TAB_LABELS[tab] || tab.charAt(0) + tab.slice(1).toLowerCase();
}

const TYPING_PHRASES = ["Student", "Creative Thinker", "Future Developer", "Lifelong Learner"];

const WELCOME_TEXT =
  "Welcome to my personal website! This is where I share who I am, what I'm learning, and the things I've built.";

// What visitors (everyone except the developer) see on their homepage by default.
// These are fixed: visitors can edit their name, picture and bio, but not these.
const VISITOR_GREETING = "Welcome,";
const VISITOR_WELCOME = "Thanks for stopping by! Open the menu in the top left (click \"" + SITE_NAME + "\") to look around.";

// The only icons anyone can pick for an interest: cat kaomojis
const CAT_ICONS = [
  "=^･ω･^=", "(=^･^=)", "ฅ^•ﻌ•^ฅ", "(=ↀωↀ=)", "(=｀ω´=)", "(=^‥^=)",
  "ฅ(•ㅅ•❀)ฅ", "(=ＴェＴ=)", "(=✪ᆺ✪=)", "≽^•⩊•^≼", "(^･ω･^ )", "(=^-ω-^=)"
];
function iconOrDefault(icon) {
  return CAT_ICONS.includes(icon) ? icon : CAT_ICONS[0];
}

// The icons for projects: fruit emojis
const FRUIT_ICONS = [
  "🍎", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍒", "🍑", "🍍", "🥝", "🥭", "🍐"
];
// A project's icon; projects saved before icons existed get one by their position
function fruitFor(project, index) {
  return FRUIT_ICONS.includes(project.icon) ? project.icon : FRUIT_ICONS[(index || 0) % FRUIT_ICONS.length];
}

// The built-in interests. `key` names each one's checklist, `verb` is the word
// used when you tick something off ("3 of 7 watched").
const MEDIA_INTRO = "A quick guide to the stories I love and where each one comes from.";
const MEDIA = [
  { key: "anime",  verb: "watched",  icon: CAT_ICONS[0], title: "Anime",  text: "Animation from Japan, made for TV, streaming, and film. Many anime are adapted from manga or light novels." },
  { key: "manga",  verb: "read",     icon: CAT_ICONS[3], title: "Manga",  text: "Japanese comics, usually black and white and read right to left, published in magazines and collected volumes." },
  { key: "manhwa", verb: "read",     icon: CAT_ICONS[2], title: "Manhwa", text: "Korean comics, often full color and made for vertical scrolling on phones (webtoons). Read top to bottom." },
  { key: "manhua", verb: "read",     icon: CAT_ICONS[5], title: "Manhua", text: "Chinese comics, often full color and vertical scroll. Chinese animation is called donghua." },
  { key: "danmei", verb: "finished", icon: CAT_ICONS[4], title: "Danmei", text: "A Chinese genre of romance between men, usually told in web novels. Popular ones get adapted into manhua, donghua, and live-action dramas." }
];

// The titles every account starts with in each checklist (change them freely).
// Everyone can add their own titles or remove these; ticks are saved per account.
const STARTER_LISTS = {
  anime:  ["Fullmetal Alchemist: Brotherhood", "Attack on Titan", "Demon Slayer", "Death Note", "Cowboy Bebop", "Your Name", "Spirited Away"],
  manga:  ["One Piece", "Berserk", "Vagabond", "Fruits Basket", "Vinland Saga", "Chainsaw Man", "Fullmetal Alchemist"],
  manhwa: ["Solo Leveling", "Tower of God", "Noblesse", "Lookism", "The God of High School", "Omniscient Reader's Viewpoint", "True Beauty"],
  manhua: ["Battle Through the Heavens", "Soul Land", "Tales of Demons and Gods", "The King's Avatar", "Martial Peak"],
  danmei: ["Heaven Official's Blessing", "Grandmaster of Demonic Cultivation", "Scum Villain's Self-Saving System", "Guardian", "Word of Honor", "The Husky and His White Cat Shizun"]
};


// ---------- 3. STATE ----------

let state = {
  view: "loading",              // "loading", "login", "signup", "delete" or "app"
  activeTab: loadTab(),         // "HOME", "MEDIA" or "PROJECTS"
  user: null,                   // the logged-in user: { name, email, bio, avatar, projects, interests, lists, isDeveloper }
  menuOpen: false,              // is the logo dropdown open?
  editingHome: false,           // is a visitor editing their profile?
  editingProject: null,         // null, "new", or the id of the project being edited
  editingInterest: null,        // null, "new", or the id of the interest being edited
  openList: null,               // key of the interest whose checklist is open (null = card grid)
  fishSchool: false,            // showing the School of fishes instead of the drawing board?
  zooOpen: false,               // showing the Zoo instead of the animal builder?
  catDraft: null,               // the cat being built on the Tomodachi page (null = the saved one)
  theme: loadTheme(),           // "light" or "dark"
  errorMsg: "",
  successMsg: ""
};

function loadTheme() {
  try { return localStorage.getItem("theme") || "light"; } catch (e) { return "light"; }
}
function loadTab() {
  try {
    const t = sessionStorage.getItem("aconite_tab");
    return TABS.includes(t) ? t : "HOME";
  } catch (e) { return "HOME"; }
}

// Escape typed text before putting it into HTML
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

// A short random id for projects, interests and checklist titles
function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}


// ---------- 4. LOCAL ACCOUNTS (no server) ----------
// Accounts are saved in this browser's localStorage, so they only exist on
// this device/browser. Passwords are never saved as plain text: each one is
// salted and hashed first.

const USERS_KEY = "aconite_users";      // all accounts: { email: { name, salt, hash } }
const SESSION_KEY = "aconite_session";  // email of the logged-in user

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {}; } catch (e) { return {}; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function bytesToHex(bytes) {
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}
function makeSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToHex(bytes);
}

// Salted hash of a password (PBKDF2 when available, simple fallback otherwise)
async function hashPassword(password, salt) {
  const enc = new TextEncoder();
  if (window.crypto && crypto.subtle) {
    const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt: enc.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
    return bytesToHex(new Uint8Array(bits));
  }
  let h = 5381;
  const text = salt + password;
  for (let i = 0; i < text.length; i++) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0;
  return "fb" + h.toString(16);
}

// Turn a saved account into the user object the site uses
function userFromAccount(email, account) {
  return {
    name: account.name,
    email: email,
    bio: account.bio || "",
    avatar: account.avatar || "",
    projects: Array.isArray(account.projects) ? account.projects : [],
    interests: Array.isArray(account.interests) ? account.interests : [],
    lists: account.lists && typeof account.lists === "object" ? account.lists : {},
    cat: account.cat && typeof account.cat === "object" ? account.cat : null,
    blog: account.blog && typeof account.blog === "object" ? account.blog : null,
    isDeveloper: email === DEVELOPER_EMAIL.toLowerCase()
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Create an account and return it. Throws Error with a friendly message.
async function createAccount(name, email, password) {
  email = email.toLowerCase();
  if (!isValidEmail(email)) throw new Error("That email address doesn't look right.");
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const users = loadUsers();
  if (users[email]) throw new Error("That email already has an account. Try logging in.");
  const salt = makeSalt();
  users[email] = { name: name, salt: salt, hash: await hashPassword(password, salt) };
  try { saveUsers(users); }
  catch (e) { throw new Error("Couldn't save your account. Is browser storage turned off?"); }
  return userFromAccount(email, users[email]);
}

// Check email + password and return the user. Throws Error with a friendly message.
async function checkLogin(email, password) {
  email = email.toLowerCase();
  const account = loadUsers()[email];
  if (!account) throw new Error("Wrong email or password.");
  if ((await hashPassword(password, account.salt)) !== account.hash) {
    throw new Error("Wrong email or password.");
  }
  return userFromAccount(email, account);
}

function startSession(user) {
  blogDraft = null;
  try { localStorage.setItem(SESSION_KEY, user.email); } catch (e) {}
  state.user = user;
  state.catDraft = null;
  resetDrawing();
  state.view = "app";
  state.errorMsg = "";
  state.successMsg = "";
  state.menuOpen = false;
}

function endSession() {
  stopCrystal();
  blogDraft = null;
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
  state.user = null;
  state.catDraft = null;
  resetDrawing();
  state.view = "login";
  state.menuOpen = false;
}

// Who was logged in last time? (null if nobody)
function restoreSession() {
  try {
    const email = localStorage.getItem(SESSION_KEY);
    const account = email && loadUsers()[email];
    return account ? userFromAccount(email, account) : null;
  } catch (e) { return null; }
}


// ---------- 5. SCREENS ----------

// keepScroll = true keeps the page where it was (used when ticking checklist items)
function render(keepScroll) {
  const oldMain = document.querySelector("#app main");
  const scrollTop = keepScroll && oldMain ? oldMain.scrollTop : 0;

  document.body.classList.toggle("dark", state.theme === "dark");
  stopTyping();
  stashFishDraft();      // keep an unfinished drawing safe while the page is redrawn

  let content = "";
  if (state.view === "loading") content = `<div class="center-note">Loading...</div>`;
  else if (state.view === "login") content = renderLoginView();
  else if (state.view === "signup") content = renderSignupView();
  else if (state.view === "delete") content = renderDeleteView();
  else content = renderAppView();   // only reachable when logged in

  document.getElementById("app").innerHTML = `
    ${renderNav()}
    <main class="${isScrollablePage() ? "scrollable" : ""}">${content}</main>
    <footer>© ${new Date().getFullYear()} ${SITE_NAME}. Built with HTML, CSS &amp; JavaScript.</footer>
  `;

  if (keepScroll) {
    const newMain = document.querySelector("#app main");
    if (newMain) newMain.scrollTop = scrollTop;
  }

  if (state.view === "app" && state.activeTab === "HOME") startTyping();
  if (state.view === "app" && state.activeTab === "EMOTIONS") startBubbles();
  if (state.view === "app" && state.activeTab === "FISH") {
    setupFishCanvas();     // does nothing while the tank is full-size (no drawing board)
    startSchool();
  }
  if (state.view === "app" && state.activeTab === "TOMODACHI" && state.zooOpen) startZoo();
}

// Only the Media and Projects pages may scroll; login and home never do
function isScrollablePage() {
  return state.view === "app" && ["MEDIA", "PROJECTS"].includes(state.activeTab);
}

// Top bar: cake logo (the only dropdown button), site name, login/logout, dark mode
function renderNav() {
  const loggedIn = (state.view === "app" || state.view === "delete") && state.user;
  const name = loggedIn ? (state.user.name || state.user.email.split("@")[0]) : "";

  return `
    <nav>
      <div class="brand">
        <button class="logo-btn" onclick="toggleMenu(event)" aria-label="Open menu" aria-expanded="${state.menuOpen}">
          <img src="${LOGO_SRC}" alt="" onerror="this.outerHTML='🎂'">
        </button>
        <span class="site-name">${SITE_NAME}</span>
        ${loggedIn && state.menuOpen ? `
          <div class="dropdown">
            ${TABS.map(tab => `
              <a class="${state.activeTab === tab ? "active" : ""}" onclick="setActiveTab('${tab}')">
                ${tabLabel(tab)}
              </a>`).join("")}
            <a class="${state.view === "delete" ? "active" : ""}" onclick="switchView('delete')">Delete account</a>
          </div>` : ""}
      </div>
      <div class="nav-right">
        ${loggedIn
          ? `<button onclick="handleLogout()">Log out (${escapeHtml(name)})</button>`
          : `<button onclick="switchView('login')">Login / Sign up</button>`}
        <button onclick="toggleTheme()" aria-label="Toggle dark mode">${state.theme === "dark" ? "☀️" : "🌙"}</button>
      </div>
    </nav>
  `;
}

function messageBoxes() {
  return `
    ${state.errorMsg ? `<div class="msg error">${escapeHtml(state.errorMsg)}</div>` : ""}
    ${state.successMsg ? `<div class="msg success">${escapeHtml(state.successMsg)}</div>` : ""}
  `;
}

function renderLoginView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Welcome <span class="accent">back</span></h2>
        <div class="subtitle">Log in to see ${SITE_NAME}'s website.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleLogin(event)">
          <input type="email" id="loginEmail" placeholder="Email" required>
          <input type="password" id="loginPassword" placeholder="Password" required>
          <button type="submit">Login</button>
        </form>
        <p class="switch-line">Don't have an account?
          <button type="button" class="link-btn" onclick="switchView('signup')">Sign up</button>
        </p>
        <p class="note">Accounts are saved in this browser only. Your password is stored hashed, never as plain text.</p>
      </div>
    </div>
  `;
}

function renderSignupView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Create an <span class="accent">account</span></h2>
        <div class="subtitle">Sign up to see ${SITE_NAME}'s website.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleSignup(event)">
          <input type="text" id="signupName" placeholder="Name" required>
          <input type="email" id="signupEmail" placeholder="Email" required>
          <input type="password" id="signupPassword" placeholder="Password (8+ characters)" minlength="8" required>
          <input type="password" id="signupConfirm" placeholder="Confirm password" minlength="8" required>
          <button type="submit">Sign up</button>
        </form>
        <p class="switch-line">Already have an account?
          <button type="button" class="link-btn" onclick="switchView('login')">Log in</button>
        </p>
        <p class="note">Accounts are saved in this browser only. Your password is stored hashed, never as plain text.</p>
      </div>
    </div>
  `;
}

function renderDeleteView() {
  return `
    <div class="auth-wrap">
      <div class="auth-card">
        <h2>Delete <span class="accent">account</span></h2>
        <div class="subtitle">Entered the wrong info? Delete this account (${escapeHtml(state.user.email)}), then sign up again with the right details.</div>
        ${messageBoxes()}
        <form class="auth-form" onsubmit="handleDelete(event)">
          <input type="password" id="deletePassword" placeholder="Enter your password to confirm" required>
          <button type="submit">Permanently delete my account</button>
          <button type="button" class="link-btn" onclick="switchView('app')">Cancel</button>
        </form>
        <p class="note">This can't be undone.</p>
      </div>
    </div>
  `;
}

// The three pages, shown only to logged-in visitors
function renderAppView() {
  if (state.activeTab === "MEDIA") return renderMediaTab();
  if (state.activeTab === "PROJECTS") return renderProjectsTab();
  if (state.activeTab === "EMOTIONS") return renderEmotionsTab();
  if (state.activeTab === "FISH") return renderFishTab();
  if (state.activeTab === "TOMODACHI") return renderTomodachiTab();
  if (state.activeTab === "BLOG") return renderBlogTab();
  if (state.activeTab === "CRYSTAL") return renderCrystalTab();
  return renderHomeTab();
}

// "Jane Doe" -> "JD"; falls back to the default initials
function initialsFor(name) {
  const letters = String(name || "").trim().split(/\s+/).filter(Boolean)
    .slice(0, 2).map(w => Array.from(w)[0].toUpperCase()).join("");
  return letters || INITIALS;
}

// The round picture on the homepage. `src` can be empty (then only the initials show).
function avatarHtml(initials, src) {
  return `
    <div class="avatar">
      ${src ? `<img src="${escapeHtml(src)}" alt="Profile picture"
           onload="this.nextElementSibling.style.display='none'" onerror="this.remove()">` : ""}
      <span>${escapeHtml(initials)}</span>
    </div>`;
}

function renderHomeTab() {
  const u = state.user || {};
  const isDev = !!u.isDeveloper;

  // Developer: the site's own words and the fixed profile picture.
  // Everyone else: the fixed visitor greeting, plus their own (editable) name, picture and bio.
  const shownName = isDev ? SITE_NAME : (u.name || SITE_NAME);
  const greeting = isDev ? "Hi, I'm" : VISITOR_GREETING;
  const welcome = isDev ? WELCOME_TEXT : VISITOR_WELCOME;
  const initials = isDev ? INITIALS : initialsFor(shownName);
  const picture = isDev ? PROFILE_SRC : (pendingAvatar !== undefined ? pendingAvatar : u.avatar);

  if (!isDev && state.editingHome) {
    return `
      <section class="page hero">
        ${avatarHtml(initials, picture)}
        ${messageBoxes()}
        <form class="auth-form edit-form" onsubmit="saveHome(event)">
          <div class="avatar-actions">
            <label class="file-btn">Change picture
              <input type="file" accept="image/*" hidden onchange="handleAvatarFile(this)">
            </label>
            <button type="button" class="link-btn" onclick="removeAvatar()">Remove picture</button>
          </div>
          <p class="note" id="avatarNote">Pictures are saved in this browser only.</p>
          <input type="text" id="editName" value="${escapeHtml(shownName)}" maxlength="40" placeholder="Your name" required>
          <textarea id="editBio" rows="3" maxlength="200" placeholder="Write a short bio about yourself">${escapeHtml(u.bio || "")}</textarea>
          <button type="submit">Save</button>
          <button type="button" class="link-btn" onclick="cancelEditHome()">Cancel</button>
        </form>
      </section>
    `;
  }

  return `
    <section class="page hero">
      ${avatarHtml(initials, picture)}
      <h1>${escapeHtml(greeting)} <span class="accent">${escapeHtml(shownName)}</span></h1>
      ${isDev ? `<div class="typing" id="typing"></div>` : ""}
      <p>${escapeHtml(welcome)}</p>
      ${!isDev && u.bio ? `<p class="bio">${escapeHtml(u.bio)}</p>` : ""}
      ${isDev ? "" : `<button onclick="startEditHome()">✏️ Edit profile</button>`}
    </section>
  `;
}

// Every interest the signed-in person sees: the built-in ones, then the ones they added.
// `key` is the name of the interest's checklist.
function allInterests() {
  const mine = (state.user && state.user.interests) || [];
  const builtIn = MEDIA.map(m => ({
    key: m.key, id: null, title: m.title, text: m.text, icon: m.icon, verb: m.verb, own: false
  }));
  const added = mine.map(i => ({
    key: "i-" + i.id, id: i.id, title: i.title, text: i.text, icon: i.icon, verb: "finished", own: true
  }));
  return builtIn.concat(added);
}

// The checklist for one interest: what the person saved, or the starter titles
function getChecklist(key) {
  const saved = state.user && state.user.lists && state.user.lists[key];
  if (Array.isArray(saved)) return saved;
  return (STARTER_LISTS[key] || []).map((title, i) => ({ id: "s" + i, title: title, done: false }));
}

// One card on the Media page. Click it to open its checklist.
// `own` cards (added by the visitor) also get Edit / Delete buttons.
function interestCard(item) {
  const items = getChecklist(item.key);
  const done = items.filter(x => x.done).length;
  const hint = items.length
    ? `${done} / ${items.length} ${item.verb} · open list →`
    : "No titles yet · open list →";

  return `
    <div class="card clickable" role="button" tabindex="0"
         onclick="openChecklist('${item.key}')"
         onkeydown="if(event.target===this&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openChecklist('${item.key}')}">
      <div class="icon">${escapeHtml(iconOrDefault(item.icon))}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <span class="card-hint">${hint}</span>
      ${item.own ? `
        <div class="project-actions">
          <button class="small" onclick="event.stopPropagation(); startEditInterest('${item.id}')">Edit</button>
          <button class="small danger" onclick="event.stopPropagation(); deleteInterest('${item.id}')">Delete</button>
        </div>` : ""}
    </div>`;
}

// The built-in interests are shared; interests people add are private to their own account
function renderMediaTab() {
  const all = allInterests();
  const open = state.openList && all.find(i => i.key === state.openList);
  if (open) return renderChecklistView(open);

  const mine = (state.user && state.user.interests) || [];
  const editing = state.editingInterest;
  const current = editing && editing !== "new" ? mine.find(i => i.id === editing) : null;
  const showForm = editing === "new" || !!current;
  const selected = current ? iconOrDefault(current.icon) : CAT_ICONS[0];

  return `
    <section class="page">
      <div class="page-head">
        <h2>Anime, Comics <span>&amp; Danmei</span></h2>
        ${showForm ? "" : `<button onclick="startEditInterest('new')">+ Add interest</button>`}
      </div>
      <p class="intro">${escapeHtml(MEDIA_INTRO)} Click a card to open its checklist. Interests you add are only visible to you.</p>
      ${messageBoxes()}
      ${showForm ? `
        <form class="auth-form project-form" onsubmit="saveInterest(event)">
          <input type="text" id="interestTitle" value="${escapeHtml(current ? current.title : "")}" maxlength="40" placeholder="Interest (e.g. Movies)" required>
          <textarea id="interestText" rows="3" maxlength="300" placeholder="What do you like about it?">${escapeHtml(current ? current.text : "")}</textarea>
          <div class="icon-label">Pick an icon</div>
          <div class="icon-picker">
            ${CAT_ICONS.map((icon, i) => `
              <label class="icon-option">
                <input type="radio" name="interestIcon" value="${i}" ${icon === selected ? "checked" : ""}>
                <span>${escapeHtml(icon)}</span>
              </label>`).join("")}
          </div>
          <div class="form-row">
            <button type="submit">Save interest</button>
            <button type="button" class="link-btn" onclick="cancelEditInterest()">Cancel</button>
          </div>
        </form>` : ""}
      <div class="cards media-grid">
        ${all.map(item => interestCard(item)).join("")}
      </div>
    </section>
  `;
}

// One column of the checklist screen ("Not yet watched" or "Already watched")
function checkColumn(heading, list, item, emptyText) {
  return `
    <div class="check-col">
      <h3>${escapeHtml(heading)} <span class="count">${list.length}</span></h3>
      ${list.length ? `
        <ul class="checklist">
          ${list.map(x => `
            <li class="check-item ${x.done ? "done" : ""}">
              <label>
                <input type="checkbox" ${x.done ? "checked" : ""} onchange="toggleItem('${item.key}', '${x.id}')">
                <span class="check-title">${escapeHtml(x.title)}</span>
              </label>
              <button class="small danger" onclick="deleteItem('${item.key}', '${x.id}')" aria-label="Remove ${escapeHtml(x.title)}">✕</button>
            </li>`).join("")}
        </ul>` : `<p class="empty-col">${escapeHtml(emptyText)}</p>`}
    </div>`;
}

// The checklist screen that opens when you click an interest card
function renderChecklistView(item) {
  const items = getChecklist(item.key);
  const done = items.filter(x => x.done).length;
  const percent = items.length ? Math.round((done / items.length) * 100) : 0;
  const todo = items.filter(x => !x.done);
  const finished = items.filter(x => x.done);

  return `
    <section class="page">
      <div class="page-head">
        <h2><span>${escapeHtml(iconOrDefault(item.icon))}</span> ${escapeHtml(item.title)}</h2>
        <button onclick="closeChecklist()">← Back</button>
      </div>
      <p class="intro">${escapeHtml(item.text)}</p>
      ${messageBoxes()}
      <form class="add-item-form" onsubmit="addItem(event, '${item.key}')">
        <input type="text" id="itemTitle" maxlength="80" placeholder="Add a title to your ${escapeHtml(item.title)} list" required>
        <button type="submit">Add</button>
      </form>
      <div class="progress" aria-hidden="true"><div class="progress-bar" style="width:${percent}%"></div></div>
      <p class="progress-text">${done} of ${items.length} ${escapeHtml(item.verb)}</p>
      <div class="check-columns">
        ${checkColumn("Not yet " + item.verb, todo, item, "Nothing left, you've " + item.verb + " everything!")}
        ${checkColumn("Already " + item.verb, finished, item, "Nothing ticked off yet.")}
      </div>
    </section>
  `;
}

// Projects are private: each account only ever sees its own list
function renderProjectsTab() {
  const projects = (state.user && state.user.projects) || [];
  const editing = state.editingProject;
  const current = editing && editing !== "new" ? projects.find(p => p.id === editing) : null;
  const showForm = editing === "new" || !!current;
  const selectedFruit = current ? fruitFor(current, projects.indexOf(current)) : FRUIT_ICONS[0];

  return `
    <section class="page">
      <div class="page-head">
        <h2>My <span>Projects</span></h2>
        ${showForm ? "" : `<button onclick="startEditProject('new')">+ Add project</button>`}
      </div>
      <p class="intro">Only you can see the projects you add here. They're saved in this browser.</p>
      ${messageBoxes()}
      ${showForm ? `
        <form class="auth-form project-form" onsubmit="saveProject(event)">
          <input type="text" id="projectTitle" value="${escapeHtml(current ? current.title : "")}" maxlength="60" placeholder="Project title" required>
          <textarea id="projectText" rows="3" maxlength="400" placeholder="What is it about?">${escapeHtml(current ? current.text : "")}</textarea>
          <div class="icon-label">Pick a fruit</div>
          <div class="icon-picker">
            ${FRUIT_ICONS.map((icon, i) => `
              <label class="icon-option">
                <input type="radio" name="projectIcon" value="${i}" ${icon === selectedFruit ? "checked" : ""}>
                <span>${icon}</span>
              </label>`).join("")}
          </div>
          <div class="form-row">
            <button type="submit">Save project</button>
            <button type="button" class="link-btn" onclick="cancelEditProject()">Cancel</button>
          </div>
        </form>` : ""}
      <div class="cards project-grid">
        ${projects.map((p, i) => `
          <div class="project">
            <div class="project-icon">${fruitFor(p, i)}</div>
            <h3>${escapeHtml(p.title)}</h3>
            <p>${escapeHtml(p.text)}</p>
            <div class="project-actions">
              <button class="small" onclick="startEditProject('${p.id}')">Edit</button>
              <button class="small danger" onclick="deleteProject('${p.id}')">Delete</button>
            </div>
          </div>`).join("")}
      </div>
      ${!projects.length && !showForm ? `<p class="intro">No projects yet. Click "Add project" to create your first one.</p>` : ""}
    </section>
  `;
}

// Typing animation on the home page
let typingTimer = null;
function stopTyping() {
  clearTimeout(typingTimer);
  typingTimer = null;
}
function startTyping() {
  if (!document.getElementById("typing")) return;   // visitors don't get the typing line
  let phraseIndex = 0, charIndex = 0, deleting = false;

  function tick() {
    const el = document.getElementById("typing");
    if (!el) return;                       // page changed, stop
    const current = TYPING_PHRASES[phraseIndex];
    el.textContent = current.substring(0, charIndex);

    let delay = deleting ? 50 : 100;
    if (!deleting && charIndex < current.length) {
      charIndex++;
    } else if (deleting && charIndex > 0) {
      charIndex--;
    } else if (!deleting) {
      deleting = true;
      delay = 1200;
    } else {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
    }
    typingTimer = setTimeout(tick, delay);
  }
  tick();
}


// ----- Emotion bubbles -----
// Every bubble is one emotion. Click one and you get a quote for that feeling.
// Add or change quotes freely: each one is ["the quote", "who said it"].
// An empty "who" shows as "a little reminder".
const EMOTIONS = [
  { key: "happy",     label: "Happy",     emoji: "😊", color: "#fff0a6", dark: "#c9a23c" },
  { key: "sad",       label: "Sad",       emoji: "😢", color: "#b8d8f7", dark: "#4a78ad" },
  { key: "love",      label: "In love",   emoji: "🥰", color: "#f9c4d9", dark: "#b5577f" },
  { key: "disgusted", label: "Disgusted", emoji: "🤢", color: "#cdebb4", dark: "#6a9150" },
  { key: "angry",     label: "Angry",     emoji: "😠", color: "#f7b7ad", dark: "#a9493b" },
  { key: "anxious",   label: "Anxious",   emoji: "😰", color: "#d8c9f2", dark: "#7560a8" },
  { key: "excited",   label: "Excited",   emoji: "🤩", color: "#fdd3a6", dark: "#bf7430" },
  { key: "tired",     label: "Tired",     emoji: "😴", color: "#cfdae0", dark: "#62788a" },
  { key: "other",     label: "Something else", emoji: "🫧", color: "#e4eeea", dark: "#7d9693" }
];

const QUOTES = {
  happy: [
    ["Happiness depends upon ourselves.", "Aristotle"],
    ["Be happy for this moment. This moment is your life.", "Omar Khayyam"],
    ["The best way to cheer yourself up is to try to cheer somebody else up.", "Mark Twain"],
    ["Happiness is not something ready made. It comes from your own actions.", "Dalai Lama"],
    ["Hold on to this feeling. You earned it.", ""],
    ["Today is a good day to have a good day.", ""],
    ["Happiness is a warm puppy.", "Charles M. Schulz"],
    ["Happiness is not by chance, but by choice.", "Jim Rohn"],
    ["Notice the small joys. They add up.", ""],
    ["You're allowed to enjoy this without waiting for the other shoe to drop.", ""],
    ["Smile at something today. Even a tiny thing counts.", ""],
    ["Joy shared is joy doubled. Tell someone your good news.", ""]
  ],
  sad: [
    ["This too shall pass.", "Persian proverb"],
    ["Even the darkest night will end and the sun will rise.", "Victor Hugo, Les Misérables"],
    ["Isn't it nice to think that tomorrow is a new day with no mistakes in it yet?", "L. M. Montgomery, Anne of Green Gables"],
    ["Tomorrow is another day.", "Scarlett O'Hara, Gone with the Wind"],
    ["It's okay to not be okay. Be gentle with yourself today.", ""],
    ["Just keep swimming.", "Dory, Finding Nemo"],
    ["The best way out is always through.", "Robert Frost"],
    ["Fall seven times, stand up eight.", "Japanese proverb"],
    ["Crying is allowed. Let it out, then drink some water.", ""],
    ["You don't have to be strong all the time.", ""],
    ["Small steps still move you forward.", ""]
  ],
  love: [
    ["Love looks not with the eyes, but with the mind.", "William Shakespeare"],
    ["We loved with a love that was more than love.", "Edgar Allan Poe"],
    ["Whatever our souls are made of, his and mine are the same.", "Emily Brontë, Wuthering Heights"],
    ["You pierce my soul. I am half agony, half hope.", "Jane Austen, Persuasion"],
    ["You had me at hello.", "Jerry Maguire"],
    ["As you wish.", "The Princess Bride"],
    ["Where there is love there is life.", "Mahatma Gandhi"],
    ["To love and be loved is to feel the sun from both sides.", "David Viscott"],
    ["Love all, trust a few, do wrong to none.", "William Shakespeare, All's Well That Ends Well"],
    ["All you need is love.", "The Beatles"],
    ["Hold the people you love a little closer today.", ""]
  ],
  disgusted: [
    ["The best revenge is not to be like your enemy.", "Marcus Aurelius"],
    ["You have power over your mind, not outside events.", "Marcus Aurelius"],
    ["Not my circus, not my monkeys.", "Polish proverb"],
    ["Some things are better left in the trash. Walk away and breathe.", ""],
    ["Your peace is worth more than their mess.", ""],
    ["Walk away from what drains you.", ""],
    ["Not everything deserves your attention.", ""],
    ["You are allowed to say “no thanks” and leave.", ""],
    ["Clean it up, wash your hands, and move on.", ""],
    ["It's okay to have standards.", ""],
    ["Bad tastes fade. Have a glass of water and a fresh start.", ""]
  ],
  angry: [
    ["For every minute you are angry you lose sixty seconds of happiness.", "Ralph Waldo Emerson"],
    ["Anyone can become angry, that is easy.", "Aristotle"],
    ["Anger leads to hate.", "Yoda, Star Wars: The Phantom Menace"],
    ["Speak when you are angry and you will make the best speech you will ever regret.", "Ambrose Bierce"],
    ["Take a deep breath. It's a bad moment, not a bad life.", ""],
    ["When angry, count ten before you speak; if very angry, a hundred.", "Thomas Jefferson"],
    ["Feel it, name it, then let it cool.", ""],
    ["It's fine to be mad. It's not fine to burn the bridge tonight.", ""],
    ["Go for a walk first. Send the message later.", ""],
    ["Your anger is telling you something. Listen, then choose your move.", ""],
    ["Cool water, slow breaths, sleep on it.", ""]
  ],
  anxious: [
    ["We suffer more often in imagination than in reality.", "Seneca"],
    ["Courage is not the absence of fear, but the triumph over it.", "Nelson Mandela"],
    ["Nothing in life is to be feared, it is only to be understood.", "Marie Curie"],
    ["Worry does not empty tomorrow of its sorrow.", "Corrie ten Boom"],
    ["All is well.", "3 Idiots"],
    ["Breathe in slowly. You are safe right now.", ""],
    ["You can't stop the waves, but you can learn to surf.", "Jon Kabat-Zinn"],
    ["Feel the fear and do it anyway.", "Susan Jeffers"],
    ["One thing at a time. Right now, just this breath.", ""],
    ["Name five things you can see. You're here.", ""],
    ["You have survived every hard day so far.", ""]
  ],
  excited: [
    ["To infinity and beyond!", "Buzz Lightyear, Toy Story"],
    ["Go confidently in the direction of your dreams.", "Henry David Thoreau"],
    ["Adventure is worthwhile in itself.", "Amelia Earhart"],
    ["The only way to do great work is to love what you do.", "Steve Jobs"],
    ["Ride this wave. Today is the day!", ""],
    ["Nothing great was ever achieved without enthusiasm.", "Ralph Waldo Emerson"],
    ["Seize the day.", "Horace"],
    ["What a time to be alive!", ""],
    ["Let's go! The adventure begins now.", ""],
    ["Keep that spark and use it.", ""],
    ["Dream big, then take the first step today.", ""]
  ],
  tired: [
    ["Rest is not idleness.", "John Lubbock"],
    ["Nature does not hurry, yet everything is accomplished.", "Lao Tzu"],
    ["Tomorrow is another day.", "Scarlett O'Hara, Gone with the Wind"],
    ["Just keep swimming.", "Dory, Finding Nemo"],
    ["You've done enough for today. Rest is allowed.", ""],
    ["Sleep is the best meditation.", "Dalai Lama"],
    ["Rest and be thankful.", "William Wordsworth"],
    ["Almost everything will work again if you unplug it for a few minutes, including you.", "Anne Lamott"],
    ["Being tired isn't weakness. It means you've been trying.", ""],
    ["Drink water, stretch, and close your eyes for a bit.", ""],
    ["The to-do list will still be there tomorrow.", ""]
  ],
  other: [
    ["Feelings are just visitors. Let them come and go.", "Mooji"],
    ["Not all those who wander are lost.", "J. R. R. Tolkien"],
    ["To live is the rarest thing in the world. Most people exist, that is all.", "Oscar Wilde"],
    ["Whatever you are feeling is valid. You don't need a label for it.", ""],
    ["Be gentle with yourself. You're doing the best you can.", ""],
    ["Wonder is the beginning of wisdom.", "Socrates"],
    ["The only way to make sense out of change is to plunge into it and move with it.", "Alan Watts"],
    ["Some days you just exist. That's okay too.", ""],
    ["You don't have to figure it out today.", ""],
    ["Mixed feelings are still feelings. Sit with them a while.", ""],
    ["Take a slow breath and notice what your body is saying.", ""]
  ]
};

const lastQuote = {};   // remembers the last quote shown per emotion so it doesn't repeat right away

function renderEmotionsTab() {
  return `
    <section class="bubble-field" id="bubbleField">
      <p class="bubble-hint">Pop the bubble that matches how you feel 🫧</p>
      <div class="legend" aria-label="Emotion legend">
        <div class="legend-title">Legend</div>
        ${EMOTIONS.map(e => `
          <div class="legend-item"><span class="legend-dot" style="--c:${e.color};--cd:${e.dark}"></span>${escapeHtml(e.label)}</div>`).join("")}
      </div>
      <div class="quote-overlay" id="quoteOverlay" onclick="if(event.target===this)closeQuote()">
        <div class="quote-card" role="dialog" aria-live="polite">
          <div class="quote-emoji" id="quoteEmoji"></div>
          <div class="quote-feeling" id="quoteFeeling"></div>
          <p class="quote-text" id="quoteText"></p>
          <p class="quote-author" id="quoteAuthor"></p>
          <div class="form-row quote-buttons">
            <button type="button" onclick="anotherQuote()">Another quote</button>
            <button type="button" class="link-btn" onclick="closeQuote()">Close</button>
          </div>
        </div>
      </div>
    </section>`;
}

// The field always holds 100 bubbles. Colors come only from the legend (the 9 emotions),
// and each bubble carries its own quote: bubble number i is emotion i % 9 and quote number
// floor(i / 9) of that emotion, so no two bubbles share a quote.
const BUBBLE_COUNT = 100;

function startBubbles() {
  const field = document.getElementById("bubbleField");
  if (!field) return;
  for (let i = 0; i < BUBBLE_COUNT; i++) spawnBubble(field, i);
}

function spawnBubble(field, slot) {
  if (!field.isConnected) return;     // the page changed, stop
  const emo = EMOTIONS[slot % EMOTIONS.length];
  const list = QUOTES[emo.key];
  const quoteIndex = Math.floor(slot / EMOTIONS.length) % list.length;
  const small = field.clientWidth < 600;
  const size = Math.round((small ? 30 : 38) + Math.random() * (small ? 16 : 22));
  const left = Math.random() * Math.max(0, field.clientWidth - size);
  const top = Math.random() * Math.max(0, field.clientHeight - size);

  const bubble = document.createElement("button");
  bubble.type = "button";
  bubble.className = "bubble";
  bubble.setAttribute("aria-label", emo.label + " bubble");
  bubble.style.cssText =
    `width:${size}px;height:${size}px;left:${left}px;top:${top}px;` +
    `--dx:${Math.round(Math.random() * 60 - 30)}px;--dy:${Math.round(Math.random() * 70 - 35)}px;` +
    `animation-duration:${(5 + Math.random() * 4).toFixed(1)}s;animation-delay:-${(Math.random() * 6).toFixed(1)}s;`;
  bubble.innerHTML =
    `<span class="bubble-face" style="--c:${emo.color};--cd:${emo.dark}"></span>`;
  bubble.onclick = () => popBubble(bubble, field, slot, emo.key, quoteIndex);
  field.appendChild(bubble);
}

function popBubble(bubble, field, slot, key, quoteIndex) {
  bubble.disabled = true;
  bubble.classList.add("pop");
  showQuote(key, quoteIndex);
  setTimeout(() => bubble.remove(), 300);
  setTimeout(() => spawnBubble(field, slot), 900);    // the same bubble (same color, same quote) floats back in
}

function showQuote(key, forcedIndex) {
  const emo = EMOTIONS.find(e => e.key === key);
  const overlay = document.getElementById("quoteOverlay");
  const list = QUOTES[key];
  if (!emo || !overlay || !list || !list.length) return;

  let i = typeof forcedIndex === "number" ? forcedIndex : Math.floor(Math.random() * list.length);
  if (typeof forcedIndex !== "number" && list.length > 1 && i === lastQuote[key]) i = (i + 1) % list.length;
  lastQuote[key] = i;

  overlay.dataset.emotion = key;
  overlay.style.setProperty("--c", emo.color);
  overlay.style.setProperty("--cd", emo.dark);
  document.getElementById("quoteEmoji").textContent = emo.emoji;
  document.getElementById("quoteFeeling").textContent = emo.key === "other" ? "Feeling something else?" : "Feeling " + emo.label.toLowerCase() + "?";
  document.getElementById("quoteText").textContent = "\u201c" + list[i][0] + "\u201d";
  document.getElementById("quoteAuthor").textContent = "\u2014 " + (list[i][1] || "a little reminder");
  overlay.classList.add("show");
}

function anotherQuote() {
  const overlay = document.getElementById("quoteOverlay");
  if (overlay) showQuote(overlay.dataset.emotion);
}

function closeQuote() {
  const overlay = document.getElementById("quoteOverlay");
  if (overlay) overlay.classList.remove("show");
}

document.addEventListener("keydown", event => { if (event.key === "Escape") closeQuote(); });

// ----- Draw a Fish -----
// Drawings are saved in this browser's storage (key below). Every account on this
// browser sees every drawing, including the developer's. To share between different
// devices you'd need a small online database; loadFish / saveFish are the only two
// functions that would have to change.
const FISH_KEY = "aconite_fish";
const FISH_MAX = 60;                        // the gallery keeps the newest 60 fish
const FISH_W = 400, FISH_H = 300;
const FISH_COLORS = ["#684f48", "#e5604d", "#f59a3d", "#f7c948", "#8cc152", "#5f8b94", "#6aa9e9", "#a78bda", "#f28ab2"];

let fishTool = { color: FISH_COLORS[0], size: 6 };
let fishDraft = null;        // the unfinished drawing, kept while the page is redrawn
let fishUndo = [];           // snapshots for the Undo button
let fishTouched = false;     // has anything been drawn yet?
let fishDrawing = false;
let fishLast = null;

function loadFish() {
  try {
    const list = JSON.parse(localStorage.getItem(FISH_KEY));
    return Array.isArray(list) ? list.filter(f => f && typeof f.img === "string" && f.img.startsWith("data:image/png;base64,")) : [];
  } catch (e) { return []; }
}
function saveFish(list) {
  localStorage.setItem(FISH_KEY, JSON.stringify(list));
}

function resetDrawing() {
  fishDraft = null; fishUndo = []; fishTouched = false; fishDrawing = false; fishLast = null;
}

function stashFishDraft() {
  const canvas = document.getElementById("fishCanvas");
  if (canvas) fishDraft = canvas.toDataURL("image/png");
}

function renderFishTab() {
  const count = Math.min(loadFish().length, SCHOOL_MAX);
  const full = false;                 // the tank always sits beside the drawing board

  return `
    <section class="page fit fish-page ${full ? "tank-full" : ""}">
      <div class="page-head head-left">
        <h2>Draw a <span>Fish</span></h2>
      </div>
      ${messageBoxes()}
      <div class="fit-body">
        ${full ? "" : `
        <div class="fish-panel">
          <canvas id="fishCanvas" width="${FISH_W}" height="${FISH_H}" aria-label="Drawing area"></canvas>
          <div class="swatches">
            ${FISH_COLORS.map(col => `
              <button type="button" class="swatch ${col === fishTool.color ? "selected" : ""}" data-color="${col}"
                style="background:${col}" aria-label="Color ${col}" onclick="setFishColor('${col}')"></button>`).join("")}
            <button type="button" class="small ${fishTool.color === "#ffffff" ? "selected" : ""}" data-color="#ffffff" onclick="setFishColor('#ffffff')">Eraser</button>
          </div>
          <input type="range" min="2" max="30" value="${fishTool.size}" oninput="fishTool.size = Number(this.value)" aria-label="Brush size">
          <div class="form-row fish-buttons">
            <button type="button" class="small" onclick="undoFish()">Undo</button>
            <button type="button" class="small" onclick="clearFish()">Clear</button>
            <button type="button" onclick="postFish()">Post my fish</button>
          </div>
        </div>`}
        <div class="school-tank" id="schoolTank">
          ${oceanSvg()}
          <div class="school-info" id="schoolInfo"><span>Fish count: <b>${count}</b></span><span class="school-tip">Tap a fish to see who drew it \u00b7 double-tap the water to drop food</span></div>
          ${count ? "" : `<p class="school-empty">The tank is empty. Draw a fish and post it!</p>`}
        </div>
      </div>
    </section>
  `;
}

// Get the canvas ready after the page is drawn
function setupFishCanvas() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  if (fishDraft) {
    const img = new Image();
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.src = fishDraft;
  }
  canvas.addEventListener("pointerdown", fishDown);
  canvas.addEventListener("pointermove", fishMove);
  canvas.addEventListener("pointerup", fishUp);
  canvas.addEventListener("pointercancel", fishUp);
}

function fishPoint(event) {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * FISH_W / rect.width, y: (event.clientY - rect.top) * FISH_H / rect.height };
}

function fishSnapshot(ctx) {
  fishUndo.push(ctx.getImageData(0, 0, FISH_W, FISH_H));
  if (fishUndo.length > 15) fishUndo.shift();
}

function fishDown(event) {
  event.preventDefault();
  const canvas = event.currentTarget;
  const ctx = canvas.getContext("2d");
  fishSnapshot(ctx);
  fishDrawing = true;
  fishTouched = true;
  fishLast = fishPoint(event);
  ctx.fillStyle = fishTool.color;
  ctx.beginPath();
  ctx.arc(fishLast.x, fishLast.y, fishTool.size / 2, 0, Math.PI * 2);
  ctx.fill();
  try { canvas.setPointerCapture(event.pointerId); } catch (e) {}
}

function fishMove(event) {
  if (!fishDrawing) return;
  const ctx = event.currentTarget.getContext("2d");
  const p = fishPoint(event);
  ctx.strokeStyle = fishTool.color;
  ctx.lineWidth = fishTool.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(fishLast.x, fishLast.y);
  ctx.lineTo(p.x, p.y);
  ctx.stroke();
  fishLast = p;
}

function fishUp() { fishDrawing = false; }

function setFishColor(color) {
  fishTool.color = color;
  document.querySelectorAll("[data-color]").forEach(el => el.classList.toggle("selected", el.dataset.color === color));
}

function undoFish() {
  const canvas = document.getElementById("fishCanvas");
  const snap = fishUndo.pop();
  if (canvas && snap) canvas.getContext("2d").putImageData(snap, 0, 0);
}

function clearFish() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  fishSnapshot(ctx);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  fishTouched = false;
}

function postFish() {
  const canvas = document.getElementById("fishCanvas");
  if (!canvas) return;
  if (!fishTouched) { state.errorMsg = "Draw a fish first, then post it."; state.successMsg = ""; render(true); return; }

  const me = state.user;
  const list = loadFish();
  list.unshift({
    id: newId(),
    owner: me.email,
    name: me.isDeveloper ? SITE_NAME : (me.name || me.email.split("@")[0]),
    isDev: !!me.isDeveloper,
    time: Date.now(),
    img: canvas.toDataURL("image/png")
  });
  try { saveFish(list.slice(0, FISH_MAX)); }
  catch (e) { state.errorMsg = "Couldn't post. Browser storage may be full or turned off."; state.successMsg = ""; render(true); return; }

  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, FISH_W, FISH_H);
  resetDrawing();
  state.errorMsg = "";
  state.successMsg = "Your fish was posted to the gallery!";
  render(true);
}

function deleteFish(id) {
  if (!confirm("Delete this drawing?")) return;
  const me = state.user;
  const list = loadFish();
  const target = list.find(f => f.id === id);
  if (!target || !(target.owner === me.email || me.isDeveloper)) return;   // only the artist or the developer
  try { saveFish(list.filter(f => f.id !== id)); } catch (e) {}
  render(true);
}


// ----- School of fishes -----
// Every posted fish swims together in one tank. The drawings are white-background PNGs, so each
// one is first cleaned (white around the fish becomes see-through) and cropped to the fish.
const SCHOOL_MAX = 60;
const cleanFishCache = {};     // fish id -> { src, ratio }

function cleanFishImage(f, done) {
  if (cleanFishCache[f.id]) { done(cleanFishCache[f.id]); return; }
  const img = new Image();
  img.onerror = () => done(null);
  img.onload = () => {
    const w = img.width, h = img.height;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, w, h);
    const px = data.data;
    const nearWhite = i => px[i + 3] > 0 && px[i] > 228 && px[i + 1] > 228 && px[i + 2] > 228;
    // flood fill from every edge pixel so white INSIDE the fish is kept
    const stack = [];
    const seen = new Uint8Array(w * h);
    const push = (x, y) => {
      const p = y * w + x;
      if (x < 0 || y < 0 || x >= w || y >= h || seen[p]) return;
      seen[p] = 1;
      if (nearWhite(p * 4)) stack.push(p);
    };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (stack.length) {
      const p = stack.pop();
      px[p * 4 + 3] = 0;
      const x = p % w, y = (p - x) / w;
      push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
    }
    // crop to the fish
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3] > 0) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    if (maxX < 0) { done(null); return; }          // an empty drawing
    ctx.putImageData(data, 0, 0);
    const cw = maxX - minX + 1, ch = maxY - minY + 1;
    const out = document.createElement("canvas");
    out.width = cw; out.height = ch;
    out.getContext("2d").drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
    const result = { src: out.toDataURL("image/png"), ratio: cw / ch };
    cleanFishCache[f.id] = result;
    done(result);
  };
  img.src = f.img;
}


// The sea behind the fish: water, light rays, a reef of corals, seaweed, rocks, shells and bubbles.
// Colors come from CSS variables so it also has a dark (deep sea) mode.
function oceanSvg() {
  let seed = 11;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const r1 = n => n.toFixed(1);

  // far reef silhouette
  let far = "M0 330 ";
  for (let x = 0; x <= 1000; x += 50) far += `L${x} ${300 + rnd() * 40} `;
  far += "L1000 420 L0 420 Z";

  // sea floor
  let sand = "M0 372 ";
  for (let x = 0; x <= 1000; x += 100) sand += `Q${x + 50} ${360 + rnd() * 22} ${x + 100} ${368 + rnd() * 12} `;
  sand += "L1000 420 L0 420 Z";

  // light rays
  let rays = "";
  for (let i = 0; i < 6; i++) { const x = 80 + i * 170 + rnd() * 40; rays += `<polygon points="${x},0 ${x + 50},0 ${x + 150},400 ${x - 40},400"/>`; }

  // seaweed (swaying)
  let weed = "";
  for (const x of [60, 120, 410, 540, 860, 930, 700]) {
    const h = 90 + rnd() * 90, sway = 14 + rnd() * 10;
    weed += `<path class="weed" style="animation-delay:-${r1(rnd() * 4)}s" d="M${x} 385 C${x - sway} ${385 - h * 0.35} ${x + sway} ${385 - h * 0.7} ${x} ${385 - h}" />`;
  }

  // branching corals
  const branch = (x, y, len, ang, depth, cls) => {
    const x2 = x + Math.sin(ang) * len, y2 = y - Math.cos(ang) * len;
    let out = `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" stroke-width="${3 + depth * 2}" stroke-linecap="round"/>`;
    if (depth > 0) { out += branch(x2, y2, len * 0.72, ang - 0.5, depth - 1, cls) + branch(x2, y2, len * 0.72, ang + 0.5, depth - 1, cls); }
    return out;
  };
  let coral = "";
  coral += branch(230, 392, 34, -0.1, 3, "coral-a");
  coral += branch(610, 394, 30, 0.1, 3, "coral-b");
  coral += branch(790, 392, 36, -0.15, 3, "coral-c");
  coral += branch(30, 396, 28, 0.2, 2, "coral-b");

  // brain corals, fan coral, tube corals
  const brain = (x, y, r, cls) => `<g class="${cls}"><circle cx="${x}" cy="${y}" r="${r}"/><path class="brain-lines" d="M${x - r * 0.6} ${y - r * 0.2} q${r * 0.3} ${-r * 0.4} ${r * 0.6} 0 t${r * 0.6} 0 M${x - r * 0.5} ${y + r * 0.3} q${r * 0.3} ${-r * 0.4} ${r * 0.5} 0 t${r * 0.5} 0"/></g>`;
  const fan = (x, y, cls) => `<g class="${cls}"><path d="M${x} ${y} L${x - 46} ${y - 70} Q${x} ${y - 100} ${x + 46} ${y - 70} Z"/><path class="fan-lines" d="M${x} ${y} L${x - 24} ${y - 84} M${x} ${y} L${x} ${y - 90} M${x} ${y} L${x + 24} ${y - 84}"/></g>`;
  const tubes = (x, y, cls) => [0, 1, 2, 3].map(i => `<rect class="${cls}" x="${x + i * 13}" y="${y - 30 - (i % 2) * 18 - i * 3}" width="10" height="${40 + (i % 2) * 18}" rx="5"/>`).join("");

  let things = brain(330, 388, 34, "coral-brain") + brain(880, 392, 28, "coral-brain2") +
    fan(480, 392, "coral-fan") + fan(155, 394, "coral-fan2") +
    tubes(690, 392, "tube-a") + tubes(60, 398, "tube-b") + tubes(950, 400, "tube-a");

  // rocks, shells, starfish
  const rocks = `<ellipse class="rock" cx="380" cy="404" rx="46" ry="22"/><ellipse class="rock2" cx="765" cy="406" rx="60" ry="26"/>
    <ellipse class="rock2" cx="10" cy="404" rx="50" ry="26"/><ellipse class="rock" cx="990" cy="408" rx="44" ry="22"/>`;
  const star = (x, y) => { let pts = ""; for (let i = 0; i < 10; i++) { const r = i % 2 ? 5 : 13, a = -Math.PI / 2 + i * Math.PI / 5; pts += `${r1(x + Math.cos(a) * r)},${r1(y + Math.sin(a) * r)} `; } return `<polygon class="starfish" points="${pts}"/>`; };
  const shell = (x, y) => `<path class="shell" d="M${x - 10} ${y} Q${x} ${y - 22} ${x + 10} ${y} Z"/><path class="shell-lines" d="M${x} ${y} L${x} ${y - 14} M${x} ${y} L${x - 5} ${y - 12} M${x} ${y} L${x + 5} ${y - 12}"/>`;
  const small = star(285, 402) + star(820, 405) + shell(560, 404) + shell(430, 408) + shell(920, 410);

  // bubbles
  let bubbles = "";
  for (let i = 0; i < 16; i++) bubbles += `<circle class="o-bubble" cx="${Math.round(rnd() * 1000)}" cy="400" r="${r1(2 + rnd() * 5)}" style="animation-duration:${r1(7 + rnd() * 8)}s;animation-delay:-${r1(rnd() * 12)}s"/>`;

  return `
    <svg class="ocean" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="oceanWater" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" class="w-top"/><stop offset="0.6" class="w-mid"/><stop offset="1" class="w-low"/>
        </linearGradient>
      </defs>
      <rect width="1000" height="420" fill="url(#oceanWater)"/>
      <g class="rays">${rays}</g>
      <path class="far-reef" d="${far}"/>
      <g class="weeds">${weed}</g>
      <g class="corals">${coral}</g>
      ${things}
      <path class="sand" d="${sand}"/>
      ${rocks}
      ${small}
      <g class="o-bubbles">${bubbles}</g>
    </svg>`;
}

// The tank is always on the page. All fish follow one invisible leader that drifts back and forth,
// so they swim together; they spread out over the whole tank. Food pellets pull the nearest fish.
function startSchool() {
  const tank = document.getElementById("schoolTank");
  if (!tank) return;
  const me = state.user || {};
  const fishList = loadFish().slice(0, SCHOOL_MAX);
  const swimmers = [];
  const pellets = [];
  let selected = null;

  fishList.forEach(f => {
    cleanFishImage(f, clean => {
      if (!clean || !tank.isConnected) return;
      const width = 46 + Math.random() * 30;
      const el = document.createElement("div");
      el.className = "school-fish";
      el.style.width = width + "px";
      el.innerHTML = `<img src="${clean.src}" alt="A fish by ${escapeHtml(f.name || "a visitor")}" draggable="false">`;
      el.onclick = () => showFishInfo(f);
      tank.appendChild(el);
      swimmers.push({
        el: el, img: el.firstElementChild, w: width, h: width / clean.ratio,
        fx: Math.random() - 0.5, fy: Math.random() - 0.5,       // place in the school (fractions of the tank)
        x: Math.random() * tank.clientWidth, y: Math.random() * tank.clientHeight,
        phase: Math.random() * 6.28, dir: 1
      });
    });
  });

  function showFishInfo(f) {
    const info = document.getElementById("schoolInfo");
    if (!info) return;
    const canDelete = f.owner === me.email || me.isDeveloper;
    info.innerHTML = `<span>Fish by <b>${escapeHtml(f.name || "a visitor")}</b>${f.isDev ? ` <span class="badge">Developer</span>` : ""}
      ${f.time ? " \u00b7 " + escapeHtml(new Date(f.time).toLocaleDateString()) : ""}</span>
      ${canDelete ? `<button class="small danger" onclick="deleteFish('${escapeHtml(f.id)}')">Delete</button>` : ""}`;
  }

  function dropPellet(clientX, clientY) {
    const r = tank.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = "pellet";
    tank.appendChild(el);
    pellets.push({ el: el, x: clientX - r.left, y: clientY - r.top });
    if (pellets.length > 12) { pellets.shift().el.remove(); }
  }
  tank.addEventListener("dblclick", e => { if (e.target === tank || e.target.classList.contains("school-light")) dropPellet(e.clientX, e.clientY); });
  let press = null;
  tank.addEventListener("pointerdown", e => {
    if (e.target !== tank) return;
    press = setTimeout(() => dropPellet(e.clientX, e.clientY), 550);   // long-press also drops food
  });
  ["pointerup", "pointerleave", "pointercancel"].forEach(ev => tank.addEventListener(ev, () => clearTimeout(press)));

  const lead = { x: 0, y: 0, dir: 1, t: 0 };
  let last = performance.now();

  function frame(now) {
    if (!tank.isConnected) return;            // the page changed, stop
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const W = tank.clientWidth, H = tank.clientHeight;
    lead.t += dt;
    const nx = W / 2 + Math.sin(lead.t * 0.22) * W * 0.12;
    lead.dir = Math.cos(lead.t * 0.22) >= 0 ? 1 : -1;
    lead.x = nx;
    lead.y = H / 2 + Math.sin(lead.t * 0.31) * H * 0.06;

    pellets.forEach((p, i) => {
      p.y = Math.min(H - 8, p.y + 34 * dt);
      p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
    });

    swimmers.forEach(s => {
      s.phase += dt * 2.2;
      let tx = lead.x + s.fx * W * 0.9 - s.w / 2;
      let ty = lead.y + s.fy * H * 0.8 + Math.sin(s.phase) * 8 - s.h / 2;
      let ease = 1 - Math.pow(0.35, dt);
      // hungry? swim to the closest pellet and eat it
      let near = null, best = 1e9;
      pellets.forEach(p => { const d = Math.hypot(p.x - s.x - s.w / 2, p.y - s.y - s.h / 2); if (d < best) { best = d; near = p; } });
      if (near && best < Math.max(W, H) * 0.7) {
        tx = near.x - s.w / 2; ty = near.y - s.h / 2;
        ease = 1 - Math.pow(0.2, dt);
        if (best < 14) { near.el.remove(); pellets.splice(pellets.indexOf(near), 1); }
      }
      const before = s.x;
      s.x += (tx - s.x) * ease;
      s.y += (ty - s.y) * ease;
      s.x = Math.max(0, Math.min(W - s.w, s.x));
      s.y = Math.max(34, Math.min(H - s.h - 4, s.y));
      if (s.x - before > 0.15) s.dir = 1; else if (s.x - before < -0.15) s.dir = -1;
      s.el.style.transform = `translate(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px)`;
      s.img.style.transform = `scaleX(${s.dir}) rotate(${(Math.sin(s.phase) * 4).toFixed(1)}deg)`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ----- Tomodachi: an animal builder + zoo -----
const ANIMAL_OPTS = [["cat", "Cat"], ["dog", "Dog"], ["bunny", "Bunny"], ["bear", "Bear"], ["fox", "Fox"], ["panda", "Panda"]];
// Starting look when you switch animal (you can change everything afterwards)
const ANIMAL_DEFAULTS = {
  cat:   { fur: "#e8a86b", pattern: "tabby",  patternColor: "#c27a3a" },
  dog:   { fur: "#d8b892", pattern: "solid",  patternColor: "#684f48" },
  bunny: { fur: "#ffffff", pattern: "solid",  patternColor: "#f0c9a0" },
  bear:  { fur: "#6b5a52", pattern: "solid",  patternColor: "#f0c9a0" },
  fox:   { fur: "#e8a86b", pattern: "tuxedo", patternColor: "#ffffff" },
  panda: { fur: "#ffffff", pattern: "solid",  patternColor: "#33302f" }
};
const BODY_OPTS = [["slim", "Slim"], ["round", "Round"], ["chonky", "Chonky"]];
const EAR_OPTS = [["pointy", "Pointy"], ["round", "Round"], ["folded", "Folded"]];
const PATTERN_OPTS = [["solid", "Solid"], ["tabby", "Tabby stripes"], ["spots", "Spots"], ["tuxedo", "Tuxedo"], ["calico", "Calico"], ["points", "Pointed"]];
const FUR_COLORS = [["#f5e6d3", "Cream"], ["#ffffff", "White"], ["#e8a86b", "Ginger"], ["#a9a9ad", "Gray"], ["#6b5a52", "Brown"], ["#33302f", "Black"], ["#d8b892", "Sand"]];
const PATTERN_COLORS = [["#ffffff", "White"], ["#c27a3a", "Dark ginger"], ["#684f48", "Chocolate"], ["#7d7d82", "Slate"], ["#33302f", "Black"], ["#f0c9a0", "Peach"]];
const EYE_COLORS = [["#6fb36b", "Green"], ["#e5b93c", "Amber"], ["#5b9bd5", "Blue"], ["#b6733a", "Copper"], ["#7cc6c0", "Teal"]];

function pickOption(list, value, fallback) {
  return list.some(x => x[0] === value) ? value : fallback;
}

// Only values from the lists above are ever used, so a cat is always safe to draw
function sanitizeCat(c) {
  c = c && typeof c === "object" ? c : {};
  return {
    animal: pickOption(ANIMAL_OPTS, c.animal, "cat"),
    name: String(c.name || "").slice(0, 20),
    body: pickOption(BODY_OPTS, c.body, "round"),
    ears: pickOption(EAR_OPTS, c.ears, "pointy"),
    pattern: pickOption(PATTERN_OPTS, c.pattern, "tabby"),
    fur: pickOption(FUR_COLORS, c.fur, "#e8a86b"),
    patternColor: pickOption(PATTERN_COLORS, c.patternColor, "#c27a3a"),
    eyes: pickOption(EYE_COLORS, c.eyes, "#6fb36b")
  };
}

function currentCat() {
  return sanitizeCat(state.catDraft || (state.user && state.user.cat));
}

// Draws the cat as an SVG picture. `px` (optional) sets a fixed width for downloading.
function catSvg(cfg, px, uid) {
  uid = uid || "";
  const ink = "#684f48", pink = "#f4b6c2";
  const b = { slim: { rx: 56, ry: 62 }, round: { rx: 72, ry: 62 }, chonky: { rx: 90, ry: 68 } }[cfg.body];
  const cy = 235, bottom = cy + b.ry;
  const fur = cfg.fur, pc = cfg.patternColor, pat = cfg.pattern;
  const pointed = pat === "points";
  const tailFill = pointed ? pc : fur;
  const earFill = pointed ? pc : fur;
  const pawFill = (pat === "tuxedo" || pointed) ? pc : fur;
  const mirror = x => 300 - x;

  // tail
  const tx = 150 + b.rx - 12;
  const tail = `M${tx} 255 C${tx + 45} 262 ${tx + 58} 200 ${tx + 28} 172`;

  // ears
  let ears = "";
  if (cfg.ears === "pointy") {
    ears = `
      <path d="M92 112 L90 36 L144 78 Z" fill="${earFill}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M${mirror(92)} 112 L${mirror(90)} 36 L${mirror(144)} 78 Z" fill="${earFill}" stroke="${ink}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M101 100 L100 56 L130 80 Z" fill="${pink}"/>
      <path d="M${mirror(101)} 100 L${mirror(100)} 56 L${mirror(130)} 80 Z" fill="${pink}"/>`;
  } else if (cfg.ears === "round") {
    ears = `
      <circle cx="104" cy="70" r="26" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <circle cx="196" cy="70" r="26" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <circle cx="104" cy="72" r="13" fill="${pink}"/>
      <circle cx="196" cy="72" r="13" fill="${pink}"/>`;
  } else {
    ears = `
      <ellipse cx="108" cy="86" rx="26" ry="17" transform="rotate(-30 108 86)" fill="${earFill}" stroke="${ink}" stroke-width="3"/>
      <ellipse cx="192" cy="86" rx="26" ry="17" transform="rotate(30 192 86)" fill="${earFill}" stroke="${ink}" stroke-width="3"/>`;
  }

  // patterns (body part and head part)
  let bodyPat = "", headPat = "";
  if (pat === "tabby") {
    bodyPat = [208, 230, 252].map(y => `
      <path d="M${150 - b.rx} ${y} L${150 - b.rx + 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${150 + b.rx} ${y} L${150 + b.rx - 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>`).join("");
    headPat = `
      <path d="M150 72 L150 96 M132 75 L135 94 M168 75 L165 94 M84 124 L108 128 M84 140 L106 142 M216 124 L192 128 M216 140 L194 142"
        stroke="${pc}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  } else if (pat === "spots") {
    bodyPat = `<circle cx="120" cy="230" r="14" fill="${pc}"/><circle cx="185" cy="245" r="16" fill="${pc}"/>
      <circle cx="150" cy="206" r="9" fill="${pc}"/><circle cx="202" cy="214" r="9" fill="${pc}"/>`;
    headPat = `<circle cx="112" cy="98" r="11" fill="${pc}"/><circle cx="190" cy="102" r="9" fill="${pc}"/>`;
  } else if (pat === "tuxedo") {
    bodyPat = `<ellipse cx="150" cy="232" rx="30" ry="46" fill="${pc}"/>`;
    headPat = `<path d="M150 72 C138 100 132 122 150 150 C168 122 162 100 150 72 Z" fill="${pc}"/>
      <ellipse cx="150" cy="152" rx="26" ry="18" fill="${pc}"/>`;
  } else if (pat === "calico") {
    bodyPat = `<ellipse cx="115" cy="235" rx="26" ry="30" fill="#5b4a45"/><ellipse cx="190" cy="225" rx="28" ry="26" fill="${pc}"/>`;
    headPat = `<ellipse cx="108" cy="100" rx="26" ry="22" fill="${pc}"/><ellipse cx="194" cy="106" rx="22" ry="20" fill="#5b4a45"/>`;
  } else if (pointed) {
    headPat = `<ellipse cx="150" cy="146" rx="34" ry="30" fill="${pc}" opacity="0.9"/>`;
  }

  // face
  const eyes = [125, 175].map(x => `
    <ellipse cx="${x}" cy="126" rx="13" ry="14" fill="${cfg.eyes}" stroke="${ink}" stroke-width="2"/>
    <ellipse cx="${x}" cy="127" rx="4.5" ry="11" fill="#2b2220"/>
    <circle cx="${x + 4}" cy="121" r="3.5" fill="#ffffff"/>`).join("");

  const name = cfg.name
    ? `<text x="150" y="333" text-anchor="middle" font-size="20" font-weight="700" fill="${ink}" font-family="Comfortaa, 'Segoe UI', sans-serif">${escapeHtml(cfg.name)}</text>` : "";
  const size = px ? ` width="${px}" height="${Math.round(px * 345 / 300)}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 345"${size} role="img" aria-label="Your cat">
    <defs>
      <clipPath id="catBodyClip${uid}"><ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}"/></clipPath>
      <clipPath id="catHeadClip${uid}"><ellipse cx="150" cy="130" rx="66" ry="58"/></clipPath>
    </defs>
    <path d="${tail}" fill="none" stroke="${ink}" stroke-width="28" stroke-linecap="round"/>
    <path d="${tail}" fill="none" stroke="${tailFill}" stroke-width="22" stroke-linecap="round"/>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="${fur}"/>
    <g clip-path="url(#catBodyClip${uid})">${bodyPat}</g>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="none" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="122" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" stroke="${ink}" stroke-width="3"/>
    <ellipse cx="178" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" stroke="${ink}" stroke-width="3"/>
    ${ears}
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="${fur}"/>
    <g clip-path="url(#catHeadClip${uid})">${headPat}</g>
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="none" stroke="${ink}" stroke-width="3"/>
    ${eyes}
    <circle cx="108" cy="150" r="9" fill="${pink}" opacity="0.5"/>
    <circle cx="192" cy="150" r="9" fill="${pink}" opacity="0.5"/>
    <path d="M144 140 L156 140 L150 148 Z" fill="#f2a0b0" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M150 148 Q143 158 135 154 M150 148 Q157 158 165 154" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
    <path d="M118 148 L78 140 M118 154 L76 156 M118 160 L80 170 M182 148 L222 140 M182 154 L224 156 M182 160 L220 170"
      stroke="${ink}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    ${name}
  </svg>`;
}


// Dog, bunny, bear, fox and panda share the cat's body and pattern options but have their own
// ears, face, and tail.
function animalSvg(cfg, px, uid) {
  uid = uid || "";
  const ink = "#684f48", pink = "#f4b6c2", dark = "#33302f";
  const a = cfg.animal;
  const b = { slim: { rx: 56, ry: 62 }, round: { rx: 72, ry: 62 }, chonky: { rx: 90, ry: 68 } }[cfg.body];
  const cy = 235, bottom = cy + b.ry;
  const fur = cfg.fur, pc = cfg.patternColor, pat = cfg.pattern;
  const panda = a === "panda";
  const pawFill = panda ? dark : (pat === "tuxedo" ? pc : fur);
  const earFill = panda ? dark : fur;
  const stroke = `stroke="${ink}" stroke-width="3"`;
  const mirror = x => 300 - x;

  // tail
  const tx = 150 + b.rx - 12;
  let tail = "";
  if (a === "dog") {
    const d = `M${tx} 250 C${tx + 36} 240 ${tx + 44} 205 ${tx + 30} 178`;
    tail = `<path d="${d}" fill="none" stroke="${ink}" stroke-width="22" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${fur}" stroke-width="16" stroke-linecap="round"/>`;
  } else if (a === "fox") {
    tail = `<path d="M${tx} 262 C${tx + 70} 270 ${tx + 84} 190 ${tx + 40} 160 C${tx + 30} 200 ${tx + 10} 220 ${tx - 6} 226 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M${tx + 40} 160 C${tx + 58} 172 ${tx + 70} 186 ${tx + 74} 204 C${tx + 60} 196 ${tx + 48} 190 ${tx + 36} 190 Z" fill="#ffffff" ${stroke} stroke-linejoin="round"/>`;
  } else {
    const r = a === "bunny" ? 17 : 13;
    tail = `<circle cx="${tx + 14}" cy="${bottom - 22}" r="${r}" fill="${panda ? "#ffffff" : fur}" ${stroke}/>`;
  }

  // ears
  let ears = "";
  if (a === "dog") {
    ears = `
      <ellipse cx="86" cy="120" rx="22" ry="42" transform="rotate(14 86 120)" fill="${pat === "solid" ? fur : pc}" ${stroke}/>
      <ellipse cx="214" cy="120" rx="22" ry="42" transform="rotate(-14 214 120)" fill="${pat === "solid" ? fur : pc}" ${stroke}/>`;
  } else if (a === "bunny") {
    ears = `
      <ellipse cx="116" cy="40" rx="18" ry="54" transform="rotate(-8 116 40)" fill="${fur}" ${stroke}/>
      <ellipse cx="184" cy="40" rx="18" ry="54" transform="rotate(8 184 40)" fill="${fur}" ${stroke}/>
      <ellipse cx="116" cy="44" rx="8" ry="38" transform="rotate(-8 116 44)" fill="${pink}"/>
      <ellipse cx="184" cy="44" rx="8" ry="38" transform="rotate(8 184 44)" fill="${pink}"/>`;
  } else if (a === "fox") {
    ears = `
      <path d="M88 110 L82 24 L142 78 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M${mirror(88)} 110 L${mirror(82)} 24 L${mirror(142)} 78 Z" fill="${fur}" ${stroke} stroke-linejoin="round"/>
      <path d="M96 98 L92 52 L126 80 Z" fill="${dark}"/>
      <path d="M${mirror(96)} 98 L${mirror(92)} 52 L${mirror(126)} 80 Z" fill="${dark}"/>`;
  } else {   // bear and panda: round ears
    ears = `
      <circle cx="98" cy="78" r="23" fill="${earFill}" ${stroke}/>
      <circle cx="202" cy="78" r="23" fill="${earFill}" ${stroke}/>
      ${panda ? "" : `<circle cx="98" cy="80" r="11" fill="${pink}"/><circle cx="202" cy="80" r="11" fill="${pink}"/>`}`;
  }

  // patterns
  let bodyPat = "", headPat = "";
  if (pat === "tabby") {
    bodyPat = [208, 230, 252].map(y => `
      <path d="M${150 - b.rx} ${y} L${150 - b.rx + 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>
      <path d="M${150 + b.rx} ${y} L${150 + b.rx - 34} ${y + 4}" stroke="${pc}" stroke-width="8" stroke-linecap="round"/>`).join("");
    headPat = `<path d="M150 72 L150 96 M132 75 L135 94 M168 75 L165 94" stroke="${pc}" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  } else if (pat === "spots") {
    bodyPat = `<circle cx="120" cy="230" r="14" fill="${pc}"/><circle cx="185" cy="245" r="16" fill="${pc}"/><circle cx="150" cy="206" r="9" fill="${pc}"/>`;
    headPat = `<circle cx="112" cy="98" r="11" fill="${pc}"/><circle cx="190" cy="102" r="9" fill="${pc}"/>`;
  } else if (pat === "tuxedo") {
    bodyPat = `<ellipse cx="150" cy="232" rx="30" ry="46" fill="${pc}"/>`;
    headPat = `<ellipse cx="150" cy="158" rx="40" ry="26" fill="${pc}"/>`;
  } else if (pat === "calico") {
    bodyPat = `<ellipse cx="115" cy="235" rx="26" ry="30" fill="#5b4a45"/><ellipse cx="190" cy="225" rx="28" ry="26" fill="${pc}"/>`;
    headPat = `<ellipse cx="108" cy="100" rx="26" ry="22" fill="${pc}"/><ellipse cx="194" cy="106" rx="22" ry="20" fill="#5b4a45"/>`;
  } else if (pat === "points") {
    headPat = `<ellipse cx="150" cy="146" rx="34" ry="30" fill="${pc}" opacity="0.9"/>`;
  }
  if (panda) {   // panda eye patches, always
    headPat += `<ellipse cx="118" cy="128" rx="19" ry="25" transform="rotate(22 118 128)" fill="${dark}"/>
      <ellipse cx="182" cy="128" rx="19" ry="25" transform="rotate(-22 182 128)" fill="${dark}"/>`;
  }

  // face
  const eyeCol = panda ? "#ffffff" : cfg.eyes;
  const eyes = [122, 178].map(x => `
    <circle cx="${x}" cy="126" r="${panda ? 9 : 12}" fill="${eyeCol}" stroke="${panda ? dark : ink}" stroke-width="2"/>
    <circle cx="${x}" cy="127" r="${panda ? 5 : 7}" fill="#2b2220"/>
    <circle cx="${x + 3}" cy="122" r="2.8" fill="#ffffff"/>`).join("");

  let snout = "";
  if (a === "dog") {
    snout = `<ellipse cx="150" cy="152" rx="32" ry="24" fill="#fff6e4" ${stroke} opacity="0.95"/>
      <ellipse cx="150" cy="141" rx="11" ry="8" fill="${dark}"/>
      <path d="M150 149 L150 158 M150 158 Q140 168 132 160 M150 158 Q160 168 168 160" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>
      <ellipse cx="150" cy="168" rx="8" ry="6" fill="#f2a0b0"/>`;
  } else if (a === "bunny") {
    snout = `<ellipse cx="150" cy="150" rx="24" ry="18" fill="#fff6e4" opacity="0.9"/>
      <path d="M144 142 L156 142 L150 150 Z" fill="#f2a0b0" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>
      <path d="M150 150 Q143 160 135 156 M150 150 Q157 160 165 156" fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round"/>
      <rect x="144" y="157" width="6" height="10" rx="1.5" fill="#ffffff" ${stroke.replace('stroke-width="3"', 'stroke-width="1.5"')}/>
      <rect x="150" y="157" width="6" height="10" rx="1.5" fill="#ffffff" ${stroke.replace('stroke-width="3"', 'stroke-width="1.5"')}/>`;
  } else if (a === "fox") {
    snout = `<path d="M96 150 C110 138 130 148 150 140 C170 148 190 138 204 150 C196 174 170 186 150 186 C130 186 104 174 96 150 Z" fill="#ffffff" opacity="0.95"/>
      <ellipse cx="150" cy="144" rx="9" ry="7" fill="${dark}"/>
      <path d="M150 150 Q142 162 132 156 M150 150 Q158 162 168 156" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {   // bear, panda
    snout = `<ellipse cx="150" cy="154" rx="28" ry="22" fill="${panda ? "#ffffff" : "#f3dcc2"}" ${stroke.replace('stroke-width="3"', 'stroke-width="2"')} opacity="0.95"/>
      <ellipse cx="150" cy="145" rx="10" ry="7" fill="${dark}"/>
      <path d="M150 152 L150 160 M150 160 Q141 168 133 162 M150 160 Q159 168 167 162" fill="none" stroke="${ink}" stroke-width="2.5" stroke-linecap="round"/>`;
  }

  const name = cfg.name
    ? `<text x="150" y="333" text-anchor="middle" font-size="20" font-weight="700" fill="${ink}" font-family="Comfortaa, 'Segoe UI', sans-serif">${escapeHtml(cfg.name)}</text>` : "";
  const size = px ? ` width="${px}" height="${Math.round(px * 345 / 300)}"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 345"${size} role="img" aria-label="Your ${a}">
    <defs>
      <clipPath id="catBodyClip${uid}"><ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}"/></clipPath>
      <clipPath id="catHeadClip${uid}"><ellipse cx="150" cy="130" rx="66" ry="58"/></clipPath>
    </defs>
    ${tail}
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="${fur}"/>
    <g clip-path="url(#catBodyClip${uid})">${bodyPat}</g>
    <ellipse cx="150" cy="${cy}" rx="${b.rx}" ry="${b.ry}" fill="none" ${stroke}/>
    <ellipse cx="122" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" ${stroke}/>
    <ellipse cx="178" cy="${bottom - 6}" rx="20" ry="11" fill="${pawFill}" ${stroke}/>
    ${ears}
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="${fur}"/>
    <g clip-path="url(#catHeadClip${uid})">${headPat}</g>
    <ellipse cx="150" cy="130" rx="66" ry="58" fill="none" ${stroke}/>
    ${snout}
    ${eyes}
    <circle cx="100" cy="152" r="9" fill="${pink}" opacity="0.5"/>
    <circle cx="200" cy="152" r="9" fill="${pink}" opacity="0.5"/>
    ${name}
  </svg>`;
}

// Draws whichever animal the settings ask for
function petSvg(cfg, px, uid) {
  return cfg.animal === "cat" ? catSvg(cfg, px, uid) : animalSvg(cfg, px, uid);
}

function chipGroup(label, field, options, current) {
  return `
    <div class="opt-group">
      <div class="icon-label">${label}</div>
      <div class="chips">
        ${options.map(o => `<button type="button" class="chip ${o[0] === current ? "selected" : ""}" onclick="setCat('${field}', '${o[0]}')">${escapeHtml(o[1])}</button>`).join("")}
      </div>
    </div>`;
}

function swatchGroup(label, field, options, current) {
  return `
    <div class="opt-group">
      <div class="icon-label">${label}</div>
      <div class="swatches">
        ${options.map(o => `<button type="button" class="swatch ${o[0] === current ? "selected" : ""}" style="background:${o[0]}"
          title="${escapeHtml(o[1])}" aria-label="${escapeHtml(o[1])}" onclick="setCat('${field}', '${o[0]}')"></button>`).join("")}
      </div>
    </div>`;
}

function renderTomodachiTab() {
  if (state.zooOpen) return renderZooView();
  const cat = currentCat();
  return `
    <section class="page fit tomo-page">
      <div class="page-head head-left">
        <h2>Tomodachi <span>animal builder</span></h2>
        <button type="button" onclick="openZoo()">Zoo</button>
      </div>
      <p class="intro">Pick an animal, color it, then save it to move into the Zoo or download it.</p>
      ${messageBoxes()}
      <div class="cat-builder fit-body">
        <div class="cat-stage" id="catStage">${petSvg(cat)}</div>
        <div class="cat-options">
          <input type="text" id="catName" value="${escapeHtml(cat.name)}" maxlength="20" placeholder="Your pet's name" oninput="setCatName(this.value)">
          ${chipGroup("Animal", "animal", ANIMAL_OPTS, cat.animal)}
          ${chipGroup("Body", "body", BODY_OPTS, cat.body)}
          ${cat.animal === "cat" ? chipGroup("Ears", "ears", EAR_OPTS, cat.ears) : ""}
          ${swatchGroup("Fur color", "fur", FUR_COLORS, cat.fur)}
          ${chipGroup("Fur pattern", "pattern", PATTERN_OPTS, cat.pattern)}
          ${swatchGroup("Pattern / spot color", "patternColor", PATTERN_COLORS, cat.patternColor)}
          ${swatchGroup("Eye color", "eyes", EYE_COLORS, cat.eyes)}
          <div class="form-row cat-buttons">
            <button type="button" onclick="saveCat()">Save my animal</button>
            <button type="button" onclick="downloadCat()">Download PNG</button>
            <button type="button" class="small" onclick="randomCat()">Randomize</button>
          </div>
          
        </div>
      </div>
    </section>
  `;
}

function setCat(field, value) {
  const cat = currentCat();
  cat[field] = value;
  if (field === "animal" && ANIMAL_DEFAULTS[value]) Object.assign(cat, ANIMAL_DEFAULTS[value]);
  state.catDraft = sanitizeCat(cat);
  state.successMsg = "";
  render(true);
}

function setCatName(value) {
  const cat = currentCat();
  cat.name = value;
  state.catDraft = sanitizeCat(cat);
  const stage = document.getElementById("catStage");
  if (stage) stage.innerHTML = petSvg(state.catDraft);
}

function randomCat() {
  const rand = list => list[Math.floor(Math.random() * list.length)][0];
  state.catDraft = sanitizeCat({
    animal: currentCat().animal, name: currentCat().name, body: rand(BODY_OPTS), ears: rand(EAR_OPTS), pattern: rand(PATTERN_OPTS),
    fur: rand(FUR_COLORS), patternColor: rand(PATTERN_COLORS), eyes: rand(EYE_COLORS)
  });
  state.successMsg = "";
  render(true);
}

function saveCat() {
  const cat = currentCat();
  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; render(true); return; }
  account.cat = cat;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; render(true); return; }
  state.user = userFromAccount(state.user.email, account);
  state.catDraft = null;
  state.errorMsg = "";
  state.successMsg = "Saved! Your animal will be here next time, and it's now living in the Zoo.";
  try { putInZoo(cat); } catch (e) { state.successMsg = "Saved! (The Zoo couldn't be updated: browser storage is full or off.)"; }
  render(true);
}

// Turn the cat picture into a PNG file and download it
function downloadCat() {
  const cat = currentCat();
  const img = new Image();
  img.onload = () => {
    const w = 900, h = Math.round(w * 345 / 300);
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#fff6e4";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    const link = document.createElement("a");
    link.download = ((cat.name || "my-" + cat.animal).replace(/[^\w-]+/g, "-")) + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.onerror = () => { state.errorMsg = "Couldn't make the picture. Try again."; render(true); };
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(petSvg(cat, 900));
}


// ----- The Zoo -----
// Every saved animal (visitors' and the developer's) lives here, walking around a forest and
// meeting each other. Like the fish, the list is kept in this browser's storage; loadZoo /
// saveZoo are the only two functions to change if you add an online database.
const ZOO_KEY = "aconite_zoo";
const ZOO_MAX = 40;

function loadZoo() {
  try {
    const list = JSON.parse(localStorage.getItem(ZOO_KEY));
    return Array.isArray(list) ? list.filter(z => z && z.id && z.cat).map(z => ({ ...z, cat: sanitizeCat(z.cat) })) : [];
  } catch (e) { return []; }
}
function saveZoo(list) {
  localStorage.setItem(ZOO_KEY, JSON.stringify(list));
}

// One animal per account: saving again replaces your old one
function putInZoo(cat) {
  const me = state.user;
  const list = loadZoo().filter(z => z.owner !== me.email);
  list.unshift({
    id: "pet-" + me.email,
    owner: me.email,
    by: me.isDeveloper ? SITE_NAME : (me.name || me.email.split("@")[0]),
    isDev: !!me.isDeveloper,
    time: Date.now(),
    cat: cat
  });
  saveZoo(list.slice(0, ZOO_MAX));
}

function removeFromZoo(id) {
  const me = state.user;
  const list = loadZoo();
  const target = list.find(z => z.id === id);
  if (!target || !(target.owner === me.email || me.isDeveloper)) return;   // only the owner or the developer
  if (!confirm("Remove this animal from the zoo?")) return;
  try { saveZoo(list.filter(z => z.id !== id)); } catch (e) {}
  render(true);
}

function openZoo() { state.zooOpen = true; state.errorMsg = ""; state.successMsg = ""; render(); }
function closeZoo() { state.zooOpen = false; render(); }

// A forest drawn in SVG. The colors come from CSS variables, so it switches with dark mode.
function forestSvg() {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const pine = (x, base, h, w, cls) => `
    <g class="${cls}">
      <rect x="${x - w * 0.07}" y="${base - h * 0.18}" width="${w * 0.14}" height="${h * 0.18}" class="trunk"/>
      <polygon points="${x},${base - h} ${x - w / 2},${base - h * 0.3} ${x + w / 2},${base - h * 0.3}"/>
      <polygon points="${x},${base - h * 0.78} ${x - w * 0.58},${base - h * 0.12} ${x + w * 0.58},${base - h * 0.12}"/>
    </g>`;
  let far = "", mid = "", near = "", stars = "", flies = "";
  for (let x = -20; x < 1040; x += 38) far += pine(x + rnd() * 14, 330, 150 + rnd() * 60, 70 + rnd() * 20, "tree-far");
  for (let x = -10; x < 1040; x += 70) mid += pine(x + rnd() * 30, 360, 210 + rnd() * 70, 105 + rnd() * 25, "tree-mid");
  for (const x of [40, 330, 690, 960]) near += pine(x + rnd() * 30, 420, 330 + rnd() * 50, 150, "tree-near");
  for (let i = 0; i < 36; i++) stars += `<circle cx="${(rnd() * 1000).toFixed(0)}" cy="${(rnd() * 160).toFixed(0)}" r="${(0.8 + rnd() * 1.4).toFixed(1)}"/>`;
  for (let i = 0; i < 14; i++) flies += `<circle cx="${(rnd() * 1000).toFixed(0)}" cy="${(200 + rnd() * 190).toFixed(0)}" r="3" style="animation-delay:-${(rnd() * 6).toFixed(1)}s"/>`;
  return `
    <svg class="forest" viewBox="0 0 1000 420" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect class="sky" width="1000" height="420"/>
      <g class="stars">${stars}</g>
      <circle class="sun" cx="840" cy="78" r="34"/>
      <g class="far">${far}</g>
      <g class="mid">${mid}</g>
      <rect class="ground" y="330" width="1000" height="90"/>
      <g class="near">${near}</g>
      <g class="fireflies">${flies}</g>
    </svg>`;
}

function renderZooView() {
  const me = state.user || {};
  const zoo = loadZoo();
  return `
    <section class="page fit zoo-page">
      <div class="page-head head-left">
        <h2>Tomodachi <span>Zoo</span></h2>
        <button type="button" onclick="closeZoo()">\u2190 Back to builder</button>
      </div>
      <p class="intro">Everyone\u2019s saved animals live here <span class="count-pill">${zoo.length} ${zoo.length === 1 ? "animal" : "animals"}</span></p>
      <div class="fit-body"><div class="zoo-scene" id="zooScene">
        ${forestSvg()}
        ${zoo.length ? "" : `<p class="school-empty">The zoo is empty. Save an animal to be the first resident!</p>`}
      </div></div>
      ${zoo.length ? `
        <div class="zoo-list">
          ${zoo.map(z => `
            <span class="zoo-chip">${escapeHtml(z.cat.name || ANIMAL_OPTS.find(o => o[0] === z.cat.animal)[1])}
              <small>by ${escapeHtml(z.by || "a visitor")}</small>${z.isDev ? ` <span class="badge">Developer</span>` : ""}
              ${(z.owner === me.email || me.isDeveloper) ? `<button class="small danger" onclick="removeFromZoo('${escapeHtml(z.id)}')" aria-label="Remove from zoo">\u2715</button>` : ""}
            </span>`).join("")}
        </div>` : ""}
    </section>`;
}

function startZoo() {
  const scene = document.getElementById("zooScene");
  if (!scene) return;
  const zoo = loadZoo();
  const walkers = zoo.map((z, i) => {
    const el = document.createElement("div");
    el.className = "zoo-animal";
    const cfg = Object.assign({}, z.cat, { name: "" });         // the name is shown as a label instead
    el.innerHTML = `<div class="zoo-body">${petSvg(cfg, null, "z" + i)}</div>
      <span class="zoo-label">${escapeHtml(z.cat.name || z.by || "")}</span><span class="zoo-heart">\u2665</span>`;
    scene.appendChild(el);
    return {
      el: el, body: el.firstElementChild, heart: el.querySelector(".zoo-heart"),
      x: Math.random(), y: Math.random(), tx: Math.random(), ty: Math.random(),
      speed: 0.02 + Math.random() * 0.025, dir: 1, wait: Math.random() * 2, bob: Math.random() * 6, meet: 0, greetedAt: -99
    };
  });
  let last = performance.now(), clock = 0;

  function frame(now) {
    if (!scene.isConnected) return;               // the page changed, stop
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now; clock += dt;
    const W = scene.clientWidth, H = scene.clientHeight;
    const size = Math.max(70, Math.min(120, W / 7));
    const top = H * 0.55, span = Math.max(10, H * 0.45 - size * 1.45);   // animals walk on the grass band

    walkers.forEach(w => {
      w.el.style.width = size + "px";
      w.bob += dt * 6;
      if (w.meet > 0) {                           // saying hello: stand still
        w.meet -= dt;
        w.heart.style.opacity = w.meet > 0 ? 1 : 0;
      } else {
        w.heart.style.opacity = 0;
        if (w.wait > 0) w.wait -= dt;
        else {
          const dx = (w.tx - w.x) * W, dy = (w.ty - w.y) * span;
          const dist = Math.hypot(dx, dy);
          if (dist < 6) { w.tx = Math.random(); w.ty = Math.random(); w.wait = 1 + Math.random() * 3; }
          else {
            const step = Math.min(dist, w.speed * W * dt);
            w.x += (dx / dist) * step / W;
            w.y += (dy / dist) * step / span;
            if (Math.abs(dx) > 3) w.dir = dx > 0 ? 1 : -1;
          }
        }
        // meet a neighbour: both stop, face each other and show a heart
        walkers.forEach(o => {
          if (o === w || o.meet > 0 || w.meet > 0) return;
          if (clock - w.greetedAt < 8 || clock - o.greetedAt < 8) return;
          if (Math.abs(o.x - w.x) * W < size * 0.9 && Math.abs(o.y - w.y) * span < size * 0.5) {
            w.meet = o.meet = 2.2; w.greetedAt = o.greetedAt = clock;
            w.dir = o.x >= w.x ? 1 : -1; o.dir = -w.dir;
          }
        });
      }
      const px = w.x * Math.max(0, W - size), py = top + w.y * span;
      w.el.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
      w.el.style.zIndex = Math.round(py);
      const hop = w.meet > 0 || w.wait > 0 ? 0 : Math.abs(Math.sin(w.bob)) * 5;
      w.body.style.transform = `translateY(${(-hop).toFixed(1)}px) scaleX(${w.dir})`;
    });
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}


// ----- Blog maker (a tiny page builder, a bit like carrd.co) -----
// Pick a look, stack blocks (heading, text, image, button, quote, divider), watch the page
// update live, save it to your account, and download it as a single .html file you can host anywhere.
const BLOG_THEMES = [
  { key: "cream",    label: "Cream",    bg: "#fff6e4", fg: "#684f48", accent: "#5f8b94", card: "#ffffff" },
  { key: "mint",     label: "Mint",     bg: "#e3f5ee", fg: "#2f4f45", accent: "#3e9b7e", card: "#ffffff" },
  { key: "sky",      label: "Sky",      bg: "#e3f1fb", fg: "#26455e", accent: "#3b82c4", card: "#ffffff" },
  { key: "rose",     label: "Rose",     bg: "#fde8ee", fg: "#6a3347", accent: "#d9567f", card: "#ffffff" },
  { key: "lavender", label: "Lavender", bg: "#eee8fb", fg: "#40335f", accent: "#7b5cd6", card: "#ffffff" },
  { key: "sunset",   label: "Sunset",   bg: "#fff0e0", fg: "#5b3425", accent: "#f0743e", card: "#ffffff" },
  { key: "midnight", label: "Midnight", bg: "#141a2e", fg: "#e8ecff", accent: "#8fa8ff", card: "#1f2745" },
  { key: "forest",   label: "Forest",   bg: "#18271f", fg: "#e5f2e2", accent: "#8fd18a", card: "#223629" }
];
const BLOG_FONTS = {
  cute:  ["Cute", "'Comfortaa','Segoe UI',system-ui,sans-serif"],
  serif: ["Classic", "Georgia,'Times New Roman',serif"],
  mono:  ["Typewriter", "'Courier New',monospace"]
};
const BLOCK_TYPES = [["heading", "Heading"], ["text", "Text"], ["image", "Image"], ["button", "Button"], ["quote", "Quote"], ["divider", "Divider"]];

const BLOG_CSS = `
.blog-site{background:var(--b-bg);color:var(--b-fg);font-family:var(--b-font);padding:clamp(18px,4vw,40px);line-height:1.6;min-height:100%;box-sizing:border-box}
.blog-site .b-inner{max-width:640px;margin:0 auto;display:grid;gap:16px}
.blog-site h1{font-size:clamp(1.8rem,5vw,2.6rem);line-height:1.15;text-align:center;margin:0 0 6px}
.blog-site h2{font-size:1.5rem;margin:8px 0 0}
.blog-site p{margin:0;overflow-wrap:anywhere}
.blog-site figure{margin:0;text-align:center}
.blog-site img{max-width:100%;border-radius:14px;display:block;margin:0 auto}
.blog-site figcaption{font-size:.85rem;opacity:.75;margin-top:6px}
.blog-site a.b-btn{display:block;text-align:center;padding:12px 20px;border-radius:999px;background:var(--b-accent);color:var(--b-bg);font-weight:700;text-decoration:none}
.blog-site blockquote{margin:0;padding:12px 18px;border-left:5px solid var(--b-accent);background:var(--b-card);border-radius:0 12px 12px 0;font-style:italic;overflow-wrap:anywhere}
.blog-site hr{border:none;border-top:2px dashed var(--b-accent);opacity:.6;width:100%}
`;
(function () { const st = document.createElement("style"); st.textContent = BLOG_CSS; document.head.appendChild(st); })();

let blogDraft = null;           // the page being edited (null = load the saved one)
let blogMobile = "edit";        // on phones: show the "edit" or the "preview" panel

function defaultBlog(name) {
  return {
    title: (name ? name + "'s" : "My") + " page", theme: "cream", font: "cute",
    blocks: [
      { id: newId(), type: "heading", text: "Hello there!" },
      { id: newId(), type: "text", text: "Write something about yourself, your hobbies, or what you're making." },
      { id: newId(), type: "button", text: "Visit my link", url: "https://example.com" }
    ]
  };
}

// Only known types and short, plain values are ever kept, so a saved page is always safe to draw
function safeUrl(u) {
  u = String(u || "").trim();
  if (/^(https?:\/\/|mailto:)/i.test(u)) return u;
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(u)) return "https://" + u;
  return "#";
}
function safeImage(u) {
  u = String(u || "").trim();
  return /^(https?:\/\/|data:image\/(png|jpeg|gif|webp);base64,)/i.test(u) ? u : "";
}
function sanitizeBlog(b, name) {
  if (!b || typeof b !== "object") return defaultBlog(name);
  const types = BLOCK_TYPES.map(t => t[0]);
  return {
    title: String(b.title || "").slice(0, 60),
    theme: BLOG_THEMES.some(t => t.key === b.theme) ? b.theme : "cream",
    font: BLOG_FONTS[b.font] ? b.font : "cute",
    blocks: (Array.isArray(b.blocks) ? b.blocks : []).filter(x => x && types.includes(x.type)).slice(0, 40).map(x => ({
      id: String(x.id || newId()).slice(0, 20), type: x.type,
      text: String(x.text || "").slice(0, 2000), url: String(x.url || "").slice(0, 300),
      src: x.type === "image" ? safeImage(x.src) : ""
    }))
  };
}
function currentBlog() {
  if (!blogDraft) blogDraft = sanitizeBlog(state.user && state.user.blog, state.user && state.user.name);
  return blogDraft;
}

function nl2br(text) { return escapeHtml(text).replace(/\n/g, "<br>"); }
function blockHtml(b) {
  if ((b.type === "heading" || b.type === "text" || b.type === "quote") && !b.text.trim()) return "";   // empty blocks stay hidden
  if (b.type === "heading") return `<h2>${escapeHtml(b.text)}</h2>`;
  if (b.type === "text") return `<p>${nl2br(b.text)}</p>`;
  if (b.type === "quote") return `<blockquote>${nl2br(b.text)}</blockquote>`;
  if (b.type === "divider") return `<hr>`;
  if (b.type === "button") return `<a class="b-btn" href="${escapeHtml(safeUrl(b.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(b.text || "Click here")}</a>`;
  if (b.type === "image") {
    const src = safeImage(b.src);
    return src ? `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(b.text)}">${b.text ? `<figcaption>${escapeHtml(b.text)}</figcaption>` : ""}</figure>` : "";
  }
  return "";
}
function blogSiteHtml(blog) {
  const t = BLOG_THEMES.find(x => x.key === blog.theme) || BLOG_THEMES[0];
  return `<div class="blog-site" style="--b-bg:${t.bg};--b-fg:${t.fg};--b-accent:${t.accent};--b-card:${t.card};--b-font:${BLOG_FONTS[blog.font][1]}">
    <div class="b-inner">${blog.title ? `<h1>${escapeHtml(blog.title)}</h1>` : ""}${blog.blocks.map(blockHtml).join("")}</div></div>`;
}

function renderBlogTab() {
  const blog = currentBlog();
  const typeName = t => (BLOCK_TYPES.find(x => x[0] === t) || [t, t])[1];
  const fields = b => {
    const id = escapeHtml(b.id);
    if (b.type === "heading") return `<input type="text" value="${escapeHtml(b.text)}" maxlength="120" placeholder="Heading" oninput="blogEdit('${id}','text',this.value)">`;
    if (b.type === "text" || b.type === "quote") return `<textarea rows="3" maxlength="2000" placeholder="Write here" oninput="blogEdit('${id}','text',this.value)">${escapeHtml(b.text)}</textarea>`;
    if (b.type === "button") return `<input type="text" value="${escapeHtml(b.text)}" maxlength="60" placeholder="Button label" oninput="blogEdit('${id}','text',this.value)">
      <input type="text" value="${escapeHtml(b.url)}" maxlength="300" placeholder="Link (https://...)" oninput="blogEdit('${id}','url',this.value)">`;
    if (b.type === "image") return `
      <div class="blk-image">
        ${b.src ? `<img src="${escapeHtml(b.src)}" alt="">` : ""}
        <label class="file-btn">${b.src ? "Change image" : "Choose image"}<input type="file" accept="image/*" hidden onchange="blogImage('${id}', this)"></label>
      </div>
      <input type="text" value="${escapeHtml(b.text)}" maxlength="120" placeholder="Caption (optional)" oninput="blogEdit('${id}','text',this.value)">`;
    return `<p class="note">A dashed line to separate sections.</p>`;
  };

  return `
    <section class="page fit blog-page">
      <div class="page-head head-left">
        <h2>Blog <span>maker</span></h2>
        <button type="button" onclick="saveBlog()">Save</button>
        <button type="button" onclick="downloadBlog()">Download HTML</button>
      </div>
      ${messageBoxes()}
      <div class="blog-toggle">
        <button type="button" class="small ${blogMobile === "edit" ? "selected" : ""}" onclick="setBlogMobile('edit')">Edit</button>
        <button type="button" class="small ${blogMobile === "preview" ? "selected" : ""}" onclick="setBlogMobile('preview')">Preview</button>
      </div>
      <div class="fit-body blog-body show-${blogMobile}">
        <div class="blog-editor" id="blogEditor">
          <input type="text" id="blogTitle" value="${escapeHtml(blog.title)}" maxlength="60" placeholder="Page title" oninput="blogMeta('title', this.value)">
          <div class="opt-group"><div class="icon-label">Theme</div>
            <div class="swatches">${BLOG_THEMES.map(t => `
              <button type="button" class="swatch ${t.key === blog.theme ? "selected" : ""}" style="background:linear-gradient(135deg, ${t.bg} 50%, ${t.accent} 50%)"
                title="${t.label}" aria-label="${t.label}" onclick="blogMeta('theme','${t.key}', true)"></button>`).join("")}</div></div>
          <div class="opt-group"><div class="icon-label">Font</div>
            <div class="chips">${Object.keys(BLOG_FONTS).map(k => `<button type="button" class="chip ${k === blog.font ? "selected" : ""}" onclick="blogMeta('font','${k}', true)">${BLOG_FONTS[k][0]}</button>`).join("")}</div></div>
          <div class="opt-group"><div class="icon-label">Add a block</div>
            <div class="chips">${BLOCK_TYPES.map(t => `<button type="button" class="chip" onclick="blogAdd('${t[0]}')">+ ${t[1]}</button>`).join("")}</div></div>
          ${blog.blocks.map((b, i) => `
            <div class="blk">
              <div class="blk-head"><b>${typeName(b.type)}</b>
                <span>
                  <button type="button" class="small" ${i === 0 ? "disabled" : ""} onclick="blogMove('${escapeHtml(b.id)}', -1)" aria-label="Move up">\u2191</button>
                  <button type="button" class="small" ${i === blog.blocks.length - 1 ? "disabled" : ""} onclick="blogMove('${escapeHtml(b.id)}', 1)" aria-label="Move down">\u2193</button>
                  <button type="button" class="small danger" onclick="blogDelete('${escapeHtml(b.id)}')" aria-label="Delete block">\u2715</button>
                </span></div>
              ${fields(b)}
            </div>`).join("")}
          ${blog.blocks.length ? "" : `<p class="note">No blocks yet. Add one above.</p>`}
        </div>
        <div class="blog-preview" id="blogPreview">${blogSiteHtml(blog)}</div>
      </div>
    </section>`;
}

// Re-draw the page but keep the editor and preview where they were scrolled
function rerenderBlog() {
  const ed = document.getElementById("blogEditor"), pv = document.getElementById("blogPreview");
  const a = ed ? ed.scrollTop : 0, b = pv ? pv.scrollTop : 0;
  render(true);
  const ed2 = document.getElementById("blogEditor"), pv2 = document.getElementById("blogPreview");
  if (ed2) ed2.scrollTop = a;
  if (pv2) pv2.scrollTop = b;
}
function refreshBlogPreview() {
  const pv = document.getElementById("blogPreview");
  if (pv) { const top = pv.scrollTop; pv.innerHTML = blogSiteHtml(currentBlog()); pv.scrollTop = top; }
}
function setBlogMobile(v) { blogMobile = v; rerenderBlog(); }
function blogMeta(field, value, redraw) {
  const blog = currentBlog();
  if (field === "title") blog.title = String(value).slice(0, 60);
  if (field === "theme" && BLOG_THEMES.some(t => t.key === value)) blog.theme = value;
  if (field === "font" && BLOG_FONTS[value]) blog.font = value;
  state.successMsg = "";
  if (redraw) rerenderBlog(); else refreshBlogPreview();
}
function blogEdit(id, field, value) {
  const b = currentBlog().blocks.find(x => x.id === id);
  if (!b) return;
  b[field] = String(value).slice(0, field === "url" ? 300 : 2000);
  refreshBlogPreview();
}
function blogAdd(type) {
  const blog = currentBlog();
  if (blog.blocks.length >= 40) { state.errorMsg = "That's the most blocks a page can have (40)."; rerenderBlog(); return; }
  state.errorMsg = "";
  blog.blocks.push({ id: newId(), type: type, text: "", url: "", src: "" });
  rerenderBlog();
  const ed = document.getElementById("blogEditor");
  if (ed) ed.scrollTop = ed.scrollHeight;
}
function blogMove(id, dir) {
  const list = currentBlog().blocks, i = list.findIndex(x => x.id === id), j = i + dir;
  if (i < 0 || j < 0 || j >= list.length) return;
  [list[i], list[j]] = [list[j], list[i]];
  rerenderBlog();
}
function blogDelete(id) {
  const blog = currentBlog();
  blog.blocks = blog.blocks.filter(x => x.id !== id);
  rerenderBlog();
}
// Shrink the chosen picture so the page stays small enough to save in the browser
function blogImage(id, input) {
  const file = input.files && input.files[0];
  const b = currentBlog().blocks.find(x => x.id === id);
  if (!file || !b) return;
  if (!file.type.startsWith("image/")) { state.errorMsg = "Please choose an image file."; rerenderBlog(); return; }
  const reader = new FileReader();
  reader.onerror = () => { state.errorMsg = "Couldn't read that file."; rerenderBlog(); };
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => { state.errorMsg = "Couldn't open that image."; rerenderBlog(); };
    img.onload = () => {
      const scale = Math.min(1, 800 / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale); canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      b.src = canvas.toDataURL("image/jpeg", 0.75);
      state.errorMsg = "";
      rerenderBlog();
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}
function saveBlog() {
  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; rerenderBlog(); return; }
  account.blog = sanitizeBlog(currentBlog(), state.user.name);
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. The page may be too big: try fewer or smaller images."; state.successMsg = ""; rerenderBlog(); return; }
  state.user = userFromAccount(state.user.email, account);
  state.errorMsg = ""; state.successMsg = "Saved! Your page will be here next time.";
  rerenderBlog();
}
function downloadBlog() {
  const blog = sanitizeBlog(currentBlog(), state.user.name);
  const font = blog.font === "cute" ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;700&display=swap">` : "";
  const html = `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(blog.title || "My page")}</title>${font}<style>body{margin:0}${BLOG_CSS}</style></head>
<body>${blogSiteHtml(blog)}</body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = ((blog.title || "my-page").replace(/[^\w-]+/g, "-").replace(/^-+|-+$/g, "") || "my-page") + ".html";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

// ----- Crystal tunes: ask the crystal ball anything and it plays you a little melody -----
// The question is turned into a number, and that number decides the key, scale, speed, sound and
// every note, so the same question always gets the same tune. It's just for fun.
const CR_SCALES = [
  { name: "major", steps: [0, 2, 4, 5, 7, 9, 11], mood: "bright and hopeful" },
  { name: "minor", steps: [0, 2, 3, 5, 7, 8, 10], mood: "soft and dreamy" },
  { name: "pentatonic", steps: [0, 2, 4, 7, 9], mood: "calm and open" },
  { name: "dorian", steps: [0, 2, 3, 5, 7, 9, 10], mood: "warm and wandering" },
  { name: "lydian", steps: [0, 2, 4, 6, 7, 9, 11], mood: "floaty and magical" },
  { name: "blues", steps: [0, 3, 5, 6, 7, 10], mood: "cool and playful" },
  { name: "whole tone", steps: [0, 2, 4, 6, 8, 10], mood: "strange and shimmering" }
];
const CR_NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const CR_WAVES = ["sine", "triangle", "square"];
const CR_STEPS = 16;

let crystal = { phase: "ask", question: "", song: null };
let crPlay = null;          // the tune that is playing right now (null = silent)
let crCtx = null;           // one shared audio context

function hashText(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 ^ h2) >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSong(question) {
  const text = question.trim().toLowerCase() || ("surprise" + Date.now());
  const rand = mulberry32(hashText(text));
  const scale = CR_SCALES[Math.floor(rand() * CR_SCALES.length)];
  const len = scale.steps.length;
  const root = Math.floor(rand() * 12);
  const bpm = 72 + Math.floor(rand() * 60);
  const wave = CR_WAVES[Math.floor(rand() * CR_WAVES.length)];
  const notes = [];                       // for each of the 16 steps: a scale degree, or null for a rest
  let deg = len + Math.floor(rand() * len) - Math.floor(len / 2);
  for (let i = 0; i < CR_STEPS; i++) {
    if (i > 0 && rand() < 0.18) { notes.push(null); continue; }
    deg = Math.max(0, Math.min(len * 2 - 1, deg + Math.floor(rand() * 5) - 2));
    notes.push(deg);
  }
  notes[CR_STEPS - 1] = len;              // finish back at the root so the tune feels complete
  const longs = notes.map(() => rand() < 0.3);
  return { question: question.trim(), scale: scale, root: root, bpm: bpm, wave: wave, notes: notes, longs: longs };
}
function degreeToMidi(song, deg) {
  const steps = song.scale.steps, len = steps.length;
  return 48 + song.root + 12 * Math.floor(deg / len) + steps[deg % len];
}

function crNote(ctx, dest, midi, t, dur, type, vol) {
  const o = ctx.createOscillator(), g = ctx.createGain(), f = ctx.createBiquadFilter();
  f.type = "lowpass"; f.frequency.value = type === "sine" ? 4000 : 1700;
  o.type = type; o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.025);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(f); f.connect(g); g.connect(dest);
  o.start(t); o.stop(t + dur + 0.05);
}

function playCrystal() {
  const song = crystal.song;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!song || !AC) { state.errorMsg = "This browser can't play sound."; render(true); return; }
  stopCrystal(true);
  if (!crCtx) crCtx = new AC();
  if (crCtx.state === "suspended") crCtx.resume();
  const ctx = crCtx;
  const master = ctx.createGain(); master.gain.value = 0.5;
  const delay = ctx.createDelay(); delay.delayTime.value = 0.3;
  const feedback = ctx.createGain(); feedback.gain.value = 0.35;
  const wet = ctx.createGain(); wet.gain.value = 0.3;
  master.connect(ctx.destination); master.connect(delay);
  delay.connect(feedback); feedback.connect(delay); delay.connect(wet); wet.connect(ctx.destination);

  const stepSec = 60 / song.bpm / 2, t0 = ctx.currentTime + 0.12, loops = 2;
  for (let loop = 0; loop < loops; loop++) {
    for (let i = 0; i < CR_STEPS; i++) {
      const t = t0 + (loop * CR_STEPS + i) * stepSec;
      if (song.notes[i] !== null) crNote(ctx, master, degreeToMidi(song, song.notes[i]), t, stepSec * (song.longs[i] ? 1.9 : 0.95), song.wave, 0.22);
      if (i % 4 === 0) crNote(ctx, master, degreeToMidi(song, i % 8 === 0 ? 0 : Math.min(4, song.scale.steps.length - 1)) - 12, t, stepSec * 3.6, "sine", 0.2);
    }
  }
  crPlay = { master: master, ctx: ctx, t0: t0, stepSec: stepSec, total: CR_STEPS * loops, raf: 0 };
  render(true);
  crystalFrame();
}
function stopCrystal(silent) {
  if (!crPlay) return;
  const p = crPlay;
  crPlay = null;
  cancelAnimationFrame(p.raf);
  try { p.master.gain.setTargetAtTime(0, p.ctx.currentTime, 0.05); } catch (e) {}
  setTimeout(() => { try { p.master.disconnect(); } catch (e) {} }, 400);
  if (!silent && state.activeTab === "CRYSTAL") render(true);
}
// lights up the note that is playing right now
function crystalFrame() {
  const p = crPlay;
  if (!p) return;
  const pos = (p.ctx.currentTime - p.t0) / p.stepSec;
  if (pos >= p.total) { stopCrystal(); return; }
  const step = pos >= 0 ? Math.floor(pos) % CR_STEPS : -1;
  document.querySelectorAll(".cr-dot").forEach(d => d.classList.toggle("on", Number(d.dataset.step) === step));
  p.raf = requestAnimationFrame(crystalFrame);
}

function askCrystal() {
  const box = document.getElementById("crystalQ");
  if (box) crystal.question = box.value;
  crystal.song = makeSong(crystal.question);
  crystal.phase = "result";
  state.errorMsg = "";
  playCrystal();
}
function askAgain() {
  stopCrystal(true);
  crystal = { phase: "ask", question: "", song: null };
  render(true);
}
function toggleCrystal() { if (crPlay) stopCrystal(); else playCrystal(); }

// the crystal ball picture: a dotted glass ball on a halftone stand
function crystalBallSvg() {
  return `
    <svg viewBox="0 0 400 400" class="cr-svg" aria-hidden="true">
      <defs>
        <pattern id="crHalftone" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.7" fill="currentColor"/></pattern>
        <radialGradient id="crGlass" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="var(--cr-glass1)"/><stop offset="1" stop-color="var(--cr-glass2)"/></radialGradient>
      </defs>
      <path d="M95 372 L130 318 Q200 340 270 318 L305 372 Z" fill="url(#crHalftone)" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
      <path d="M130 318 Q200 340 270 318" fill="none" stroke="currentColor" stroke-width="4"/>
      <circle cx="200" cy="180" r="148" fill="url(#crGlass)"/>
      <circle cx="200" cy="180" r="148" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 11"/>
      <circle cx="200" cy="180" r="132" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 8" opacity="0.5"/>
      <path d="M96 128 Q120 76 178 56" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 10" opacity="0.7"/>
      <text x="338" y="70" font-size="30" fill="currentColor">\u2726</text><text x="40" y="250" font-size="22" fill="currentColor">\u2726</text>
      <text x="352" y="260" font-size="16" fill="currentColor">\u2727</text><text x="64" y="70" font-size="16" fill="currentColor">\u2727</text>
    </svg>`;
}
// the notes drawn as dots inside the ball (like a tiny piano roll)
function crystalRollSvg(song) {
  const rows = song.scale.steps.length * 2, W = 320, H = 150;
  const dx = W / CR_STEPS, dy = H / rows;
  let grid = "", hits = "";
  for (let c = 0; c < CR_STEPS; c++) for (let r = 0; r < rows; r += 1) grid += `<circle cx="${(c * dx + dx / 2).toFixed(1)}" cy="${(r * dy + dy / 2).toFixed(1)}" r="1" opacity="0.25"/>`;
  song.notes.forEach((deg, c) => {
    if (deg === null) return;
    hits += `<circle class="cr-dot" data-step="${c}" cx="${(c * dx + dx / 2).toFixed(1)}" cy="${((rows - 1 - deg) * dy + dy / 2).toFixed(1)}" r="${song.longs[c] ? 6 : 4.5}"/>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="cr-roll-svg" aria-hidden="true"><g fill="currentColor">${grid}${hits}</g></svg>`;
}

function renderCrystalTab() {
  const song = crystal.song, asking = crystal.phase === "ask";
  return `
    <section class="page fit crystal-page">
      <div class="page-head head-left"><h2>Crystal <span>tunes</span></h2></div>
      ${messageBoxes()}
      <div class="crystal-stage">
        <div class="crystal-ball">
          ${crystalBallSvg()}
          ${asking
            ? `<textarea id="crystalQ" class="crystal-q" maxlength="140" placeholder="What does the future hold for me?"
                 oninput="crystal.question = this.value"
                 onkeydown="if(event.key==='Enter' && !event.shiftKey){event.preventDefault();askCrystal()}">${escapeHtml(crystal.question)}</textarea>`
            : `<div class="crystal-roll">${crystalRollSvg(song)}</div>`}
        </div>
        ${asking
          ? `<button type="button" class="crystal-submit" onclick="askCrystal()">Submit</button>`
          : `<p class="crystal-info">${song.question ? "You asked \u201c" + escapeHtml(song.question) + "\u201d. " : ""}The crystal hears a <b>${escapeHtml(song.scale.mood)}</b> tune: ${CR_NOTES[song.root]} ${escapeHtml(song.scale.name)}, ${song.bpm} BPM.</p>
             <div class="form-row crystal-buttons">
               <button type="button" onclick="toggleCrystal()">${crPlay ? "\u25a0 Stop" : "\u25b6 Play again"}</button>
               <button type="button" class="small" onclick="askAgain()">Ask again</button>
             </div>`}
        <div class="crystal-reminder"><b>REMINDER!</b> It's all just for fun (trust your own inner guide!)</div>
      </div>
    </section>`;
}

// ---------- 6. ACTIONS (what buttons do) ----------

function switchView(view) {
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  state.view = view;
  state.errorMsg = "";
  state.successMsg = "";
  state.menuOpen = false;
  render();
}

function setActiveTab(tab) {
  if (tab !== "CRYSTAL") stopCrystal();
  state.fishSchool = false;
  state.zooOpen = false;
  state.editingHome = false;
  state.editingProject = null;
  state.editingInterest = null;
  state.openList = null;
  state.errorMsg = "";
  state.successMsg = "";
  state.activeTab = tab;
  state.menuOpen = false;
  try { sessionStorage.setItem("aconite_tab", tab); } catch (e) {}
  render();
}

function toggleMenu(event) {
  event.stopPropagation();
  if (state.view !== "app") return;        // the menu is only for logged-in visitors
  state.menuOpen = !state.menuOpen;
  render();
}

function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  try { localStorage.setItem("theme", state.theme); } catch (e) {}
  render();
}

async function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  try {
    startSession(await checkLogin(email, password));
  } catch (error) {
    state.errorMsg = error.message;
  }
  render();
}

async function handleSignup(event) {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;
  const confirm = document.getElementById("signupConfirm").value;

  if (password !== confirm) { state.errorMsg = "Passwords do not match."; render(); return; }
  try {
    startSession(await createAccount(name, email, password));
  } catch (error) {
    state.errorMsg = error.message;
  }
  render();
}

// Picture chosen in the edit form but not saved yet:
// undefined = unchanged, "" = remove it, otherwise a small image as a data URL
let pendingAvatar;

function setAvatarPreview(src) {
  const avatar = document.querySelector("#app .avatar");
  if (!avatar) return;
  const old = avatar.querySelector("img");
  if (old) old.remove();
  avatar.querySelector("span").style.display = "";
  if (src) {
    const img = document.createElement("img");
    img.alt = "Profile picture";
    img.src = src;
    avatar.insertBefore(img, avatar.firstChild);
  }
}

// Shrink the chosen image to a 200x200 square so it fits easily in browser storage
function handleAvatarFile(input) {
  const file = input.files && input.files[0];
  const note = document.getElementById("avatarNote");
  if (!file) return;
  if (!file.type.startsWith("image/")) { note.textContent = "Please choose an image file."; return; }

  const reader = new FileReader();
  reader.onerror = () => { note.textContent = "Couldn't read that file."; };
  reader.onload = () => {
    const img = new Image();
    img.onerror = () => { note.textContent = "Couldn't open that image."; };
    img.onload = () => {
      const size = 200;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
      const side = Math.min(img.width, img.height);   // crop to a centered square
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      pendingAvatar = canvas.toDataURL("image/jpeg", 0.85);
      setAvatarPreview(pendingAvatar);
      note.textContent = "Looks good! Press Save to keep it.";
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function removeAvatar() {
  pendingAvatar = "";
  setAvatarPreview("");
  const note = document.getElementById("avatarNote");
  if (note) note.textContent = "Picture removed. Press Save to keep that.";
}

function startEditInterest(id) {
  state.editingInterest = id;
  state.errorMsg = "";
  render();
  const title = document.getElementById("interestTitle");
  if (title) title.focus();
}

function cancelEditInterest() {
  state.editingInterest = null;
  state.errorMsg = "";
  render();
}

// Save the user's interests back to their own account.
// `removeListKey` (optional) also deletes that interest's checklist.
function saveInterestList(interests, removeListKey) {
  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  account.interests = interests;
  if (removeListKey && account.lists) delete account.lists[removeListKey];
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.email, account);
  return true;
}

function saveInterest(event) {
  event.preventDefault();
  const title = document.getElementById("interestTitle").value.trim();
  const text = document.getElementById("interestText").value.trim();
  const picked = document.querySelector('input[name="interestIcon"]:checked');
  const icon = picked ? CAT_ICONS[Number(picked.value)] : undefined;   // only icons from CAT_ICONS
  if (!title) { state.errorMsg = "Give your interest a name."; render(); return; }
  if (!icon) { state.errorMsg = "Pick one of the cat icons."; render(); return; }

  const interests = state.user.interests.slice();
  if (state.editingInterest === "new") {
    interests.push({ id: newId(), title: title, text: text, icon: icon });
  } else {
    const item = interests.find(x => x.id === state.editingInterest);
    if (item) { item.title = title; item.text = text; item.icon = icon; }
  }
  if (saveInterestList(interests)) { state.editingInterest = null; state.errorMsg = ""; }
  render();
}

function deleteInterest(id) {
  if (!confirm("Delete this interest and its checklist?")) return;
  saveInterestList(state.user.interests.filter(i => i.id !== id), "i-" + id);
  render();
}

// ----- Checklists -----

function openChecklist(key) {
  state.openList = key;
  state.editingInterest = null;
  state.errorMsg = "";
  render();
}

function closeChecklist() {
  state.openList = null;
  state.errorMsg = "";
  render();
}

// Save one interest's checklist to the signed-in account
function saveChecklist(key, items) {
  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  if (!account.lists || typeof account.lists !== "object") account.lists = {};
  account.lists[key] = items;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.email, account);
  return true;
}

function toggleItem(key, id) {
  const items = getChecklist(key).map(x => x.id === id ? { id: x.id, title: x.title, done: !x.done } : x);
  state.errorMsg = "";
  saveChecklist(key, items);
  render(true);
}

function addItem(event, key) {
  event.preventDefault();
  const title = document.getElementById("itemTitle").value.trim();
  if (!title) return;

  const items = getChecklist(key).slice();
  if (items.some(x => x.title.toLowerCase() === title.toLowerCase())) {
    state.errorMsg = "\"" + title + "\" is already on your list.";
    render(true);
    return;
  }
  items.push({ id: newId(), title: title, done: false });
  state.errorMsg = "";
  saveChecklist(key, items);
  render(true);
  const box = document.getElementById("itemTitle");
  if (box) box.focus();
}

function deleteItem(key, id) {
  state.errorMsg = "";
  saveChecklist(key, getChecklist(key).filter(x => x.id !== id));
  render(true);
}

// ----- Projects -----

function startEditProject(id) {
  state.editingProject = id;
  state.errorMsg = "";
  render();
  const title = document.getElementById("projectTitle");
  if (title) title.focus();
}

function cancelEditProject() {
  state.editingProject = null;
  state.errorMsg = "";
  render();
}

// Save the user's projects list back to their own account
function saveProjectList(projects) {
  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; return false; }
  account.projects = projects;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; return false; }
  state.user = userFromAccount(state.user.email, account);
  return true;
}

function saveProject(event) {
  event.preventDefault();
  const title = document.getElementById("projectTitle").value.trim();
  const text = document.getElementById("projectText").value.trim();
  const picked = document.querySelector('input[name="projectIcon"]:checked');
  const icon = picked ? FRUIT_ICONS[Number(picked.value)] : undefined;   // only icons from FRUIT_ICONS
  if (!title) { state.errorMsg = "Give your project a title."; render(); return; }
  if (!icon) { state.errorMsg = "Pick one of the fruit icons."; render(); return; }

  const projects = state.user.projects.slice();
  if (state.editingProject === "new") {
    projects.push({ id: newId(), title: title, text: text, icon: icon });
  } else {
    const p = projects.find(x => x.id === state.editingProject);
    if (p) { p.title = title; p.text = text; p.icon = icon; }
  }
  if (saveProjectList(projects)) { state.editingProject = null; state.errorMsg = ""; }
  render();
}

function deleteProject(id) {
  if (!confirm("Delete this project?")) return;
  saveProjectList(state.user.projects.filter(p => p.id !== id));
  render();
}

function startEditHome() {
  pendingAvatar = undefined;
  state.editingHome = true;
  state.errorMsg = "";
  render();
}

function cancelEditHome() {
  pendingAvatar = undefined;
  state.editingHome = false;
  state.errorMsg = "";
  render();
}

function saveHome(event) {
  event.preventDefault();
  const name = document.getElementById("editName").value.trim();
  const bio = document.getElementById("editBio").value.trim();
  if (!name) { state.errorMsg = "Your name can't be empty."; render(); return; }

  const users = loadUsers();
  const account = users[state.user.email];
  if (!account) { state.errorMsg = "Couldn't find your account."; render(); return; }
  account.name = name;
  account.bio = bio;
  if (pendingAvatar !== undefined) account.avatar = pendingAvatar;
  try { saveUsers(users); }
  catch (e) { state.errorMsg = "Couldn't save. Is browser storage turned off?"; render(); return; }

  state.user = userFromAccount(state.user.email, account);
  pendingAvatar = undefined;
  state.editingHome = false;
  state.errorMsg = "";
  render();
}

async function handleDelete(event) {
  event.preventDefault();
  const password = document.getElementById("deletePassword").value;
  try {
    const user = await checkLogin(state.user.email, password);   // confirm it's really them
    const users = loadUsers();
    delete users[user.email];
    saveUsers(users);
    endSession();
    state.errorMsg = "";
    state.successMsg = "Your account was deleted. You can sign up again.";
  } catch (error) {
    state.errorMsg = error.message === "Wrong email or password."
      ? "Wrong password." : error.message;
  }
  render();
}

function handleLogout() {
  endSession();
  render();
}

// Click anywhere else to close the dropdown
document.addEventListener("click", () => {
  if (state.menuOpen) {
    state.menuOpen = false;
    render();
  }
});


// ---------- 7. START ----------

const savedUser = restoreSession();
if (savedUser) {
  startSession(savedUser);   // still logged in from last time
} else {
  state.view = "login";
}
render();
