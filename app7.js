// app.js
const API_URL = 'https://jsonplaceholder.typicode.com/users';

const usersEl = document.getElementById('users');
const statusEl = document.getElementById('status');
const reloadBtn = document.getElementById('reloadBtn');

function setStatus(msg, { show = true } = {}) {
  statusEl.textContent = msg;
  statusEl.hidden = !show;
}

function clearStatus() {
  statusEl.hidden = true;
  statusEl.textContent = '';
}

function showLoadingSkeleton(count = 6) {
  usersEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const sk = document.createElement('div');
    sk.className = 'skeleton';
    usersEl.appendChild(sk);
  }
}

function userCardHTML(u) {
  const addr = u.address;
  const fullAddr = `${addr.street}, ${addr.suite}, ${addr.city} - ${addr.zipcode}`;
  return `
    <article class="card">
      <h3>${u.name}</h3>
      <div class="muted">${u.email}</div>
      <div class="addr">${fullAddr}</div>
    </article>
  `;
}

function renderUsers(list) {
  usersEl.innerHTML = list.map(userCardHTML).join('');
}

async function fetchUsers() {
  try {
    reloadBtn.disabled = true;
    setStatus('Loading users…');
    showLoadingSkeleton();

    const res = await fetch(API_URL, { method: 'GET' });
    // fetch only rejects on network errors; check HTTP status:
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

    const data = await res.json();
    clearStatus();
    renderUsers(data);
  } catch (err) {
    setStatus(`Failed to load users: ${err.message}. Check your connection and try again.`, { show: true });
    usersEl.innerHTML = '';
  } finally {
    reloadBtn.disabled = false;
  }
}

reloadBtn.addEventListener('click', fetchUsers);
document.addEventListener('DOMContentLoaded', fetchUsers);
