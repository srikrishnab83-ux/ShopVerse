<!DOCTYPE html>
<html lang="kn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yakshagana Scratch & Win</title>
<style>
  body { font-family: Arial, sans-serif; text-align: center; background: #f8f4e3; margin:0; padding:0; }
  .login, .dashboard, .admin-panel { margin: 20px auto; padding: 20px; border: 1px solid #ccc; background: #fff; border-radius: 15px; max-width: 400px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
  .card { width: 100px; height: 100px; margin: 10px; display: inline-block; background: #ccc; border-radius: 15px; line-height: 100px; font-size: 18px; cursor: pointer; position: relative; overflow: hidden; user-select: none; transition: transform 0.2s; }
  .card:hover { transform: scale(1.05); }
  .scratch-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #999; z-index: 2; transition: opacity 0.3s; border-radius: 15px; }
  .scratched .scratch-layer { opacity: 0; }
  input { padding: 10px; margin: 10px; width: 80%; border-radius: 8px; border: 1px solid #aaa; }
  button { padding: 10px 20px; margin: 10px; cursor: pointer; border-radius: 8px; border: none; background: #ff6f61; color: white; font-weight: bold; }
  button:hover { background: #ff4c3b; }
  h1, h3, h4 { color: #333; }
  #cardsContainer { display: flex; flex-wrap: wrap; justify-content: center; }
</style>

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js"></script>
</head>
<body>

<h1>ಯಕ್ಷಗಾನ Scratch & Win</h1>

<div class="login" id="loginDiv">
  <h3>WhatsApp ಸಂಖ್ಯೆ ನಮೂದಿಸಿ</h3>
  <input type="text" id="userNumber" placeholder="WhatsApp Number">
  <button onclick="login()">Login</button>
</div>

<div class="dashboard" id="dashboardDiv" style="display:none;">
  <h3>Scratch Cards</h3>
  <div id="cardsContainer"></div>
  <button id="submitBtn">Prize Submit to WhatsApp</button>
  <h3>Winners Dashboard</h3>
  <div id="winnerList"></div>
  <button onclick="showAdminPanel()">Admin Panel</button>
</div>

<div class="admin-panel" id="adminDiv" style="display:none;">
  <h3>Admin Panel</h3>
  <input type="password" id="adminPass" placeholder="Admin Password">
  <button onclick="loginAdmin()">Login</button>
  <div id="editPrizes" style="display:none;">
    <h4>Edit Prizes</h4>
    <div id="prizesContainer"></div>
    <button onclick="updatePrizes()">Update Prizes</button>
    <button onclick="logoutAdmin()">Logout</button>
    <h4>Manage Users</h4>
    <div id="usersContainer"></div>
  </div>
</div>

<script>
const firebaseConfig = {
  apiKey: "AIzaSyCcGujjBbE9j8G4-9yNnZcIncUDwCMNvDI",
  authDomain: "luckywin-c8365.firebaseapp.com",
  databaseURL: "https://luckywin-c8365-default-rtdb.firebaseio.com/",
  projectId: "luckywin-c8365",
  storageBucket: "luckywin-c8365.appspot.com",
  messagingSenderId: "542970385202",
  appId: "1:542970385202:web:ca949d82b00aca9c2a7d2b",
  measurementId: "G-4FSDQHFR8N"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let totalCards = 20;
let prizes = Array.from({length: totalCards}, (_, i) => `Prize ${i+1}`);
let users = {};
let winners = [];
let userDetails = [];
let currentUser = '';

function loadDataFromFirebase(){
  database.ref('prizes').once('value', snapshot => { if(snapshot.exists()) prizes = snapshot.val(); renderCards(); });
  database.ref('winners').once('value', snapshot => { if(snapshot.exists()) winners = Object.values(snapshot.val()); renderCards(); renderWinners(); });
  database.ref('users').once('value', snapshot => { if(snapshot.exists()) users = snapshot.val(); });
}
window.onload = loadDataFromFirebase;

function login(){
  const num = document.getElementById('userNumber').value;
  if(!num) { alert('ದಯವಿಟ್ಟು ಸಂಖ್ಯೆ ನಮೂದಿಸಿ'); return; }
  if(users[num]) { alert('ನೀವು ಈಗಾಗಲೇ ಕಾರ್ಡ್ ಸ್ಕ್ರ್ಯಾಚ್ ಮಾಡಿದ್ದೀರಿ. Admin ಮೂಲಕ ರೀಸೆಟ್ ಆಗುವವರೆಗೆ ಮತ್ತೆ ಸ್ಕ್ರ್ಯಾಚ್ ಮಾಡಲು ಸಾಧ್ಯವಿಲ್ಲ.'); return; }
  currentUser = num;
  if(!userDetails.some(u => u.number === num)) userDetails.push({number: num, prize: null});
  document.getElementById('loginDiv').style.display = 'none';
  document.getElementById('dashboardDiv').style.display = 'block';
  renderCards();
}

function renderCards(){
  const container = document.getElementById('cardsContainer');
  container.innerHTML = '';
  for(let i=0;i<totalCards;i++){
    const card = document.createElement('div');
    card.className = 'card';
    card.id = 'card-'+i;
    const winner = winners.find(w => w.index === i);
    const prizeText = winner ? winner.prize : prizes[i];
    if(winner) card.classList.add('scratched');
    card.innerHTML = `<div class='scratch-layer'></div><span class='prize-text'>${prizeText}</span>`;
    card.addEventListener('click', () => scratchCard(i));
    container.appendChild(card);
  }
}

function scratchCard(index){
  if(users[currentUser]) { alert('ನೀವು ಈಗಾಗಲೇ ಕಾರ್ಡ್ ಸ್ಕ್ರ್ಯಾಚ್ ಮಾಡಿದ್ದೀರಿ'); return; }
  const winner = winners.find(w => w.index === index);
  if(winner) { alert('ಈ ಕಾರ್ಡ್ ಈಗಾಗಲೇ ಸ್ಕ್ರ್ಯಾಚ್ ಆಗಿದೆ'); return; }
  const cardEl = document.getElementById('card-'+index);
  cardEl.classList.add('scratched');
  users[currentUser] = prizes[index];
  const user = userDetails.find(u => u.number === currentUser);
  if(user) user.prize = prizes[index];
  const winnerData = {index: index, prize: prizes[index], number: currentUser};
  winners.push(winnerData);
  database.ref('users/' + currentUser).set({prize: prizes[index], cardIndex: index});
  database.ref('winners/' + index).set(winnerData);
  renderCards();
  renderWinners();
}

function renderWinners(){
  const list = document.getElementById('winnerList');
  list.innerHTML = winners.map(w => `ಜಯ: ${w.prize}`).join('<br>');
}

function submitPrize(){
  const prize = users[currentUser];
  if(!prize) { alert('ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಕಾರ್ಡ್ ಸ್ಕ್ರ್ಯಾಚ್ ಮಾಡಿಲ್ಲ'); return; }
  const whatsappNumber = '9148014768';
  const message = encodeURIComponent(`ನನ್ನ ಜಯ: ${prize} (WhatsApp: ${currentUser})`);
  const a = document.createElement('a');
  a.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

document.getElementById('submitBtn').addEventListener('click', submitPrize);

function showAdminPanel(){ document.getElementById('adminDiv').style.display = 'block'; }
function logoutAdmin(){
  document.getElementById('adminDiv').style.display = 'none';
  document.getElementById('editPrizes').style.display = 'none';
  document.getElementById('adminPass').value = '';
  document.getElementById('dashboardDiv').style.display = 'none';
  document.getElementById('loginDiv').style.display = 'block';
  currentUser = '';
  alert('Admin logged out. Please enter a new WhatsApp number to scratch again.');
}

function loginAdmin(){
  const pass = document.getElementById('adminPass').value;
  if(pass === 'admin123'){
    document.getElementById('editPrizes').style.display = 'block';
    renderPrizeEditor();
    renderUsersAdmin();
  } else { alert('Incorrect Password'); }
}

function renderPrizeEditor(){
  const container = document.getElementById('prizesContainer');
  container.innerHTML = '';
  prizes.forEach((p,i)=>{
    const input = document.createElement('input');
    input.value = p;
    input.id = `prizeInput${i}`;
    container.appendChild(document.createTextNode(`Card ${i+1}: `));
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
  });
}

function updatePrizes(){
  for(let i=0;i<totalCards;i++) prizes[i] = document.getElementById(`prizeInput${i}`).value;
  database.ref('prizes').set(prizes);
  alert('Prizes updated successfully');
  renderCards();
}

function renderUsersAdmin(){
  const container = document.getElementById('usersContainer');
  container.innerHTML = '';
  if(userDetails.length === 0){ container.innerHTML = 'ಯಾವುದೇ ಬಳಕೆದಾರರ ಮಾಹಿತಿಯಿಲ್ಲ'; return; }
  userDetails.forEach(u => {
    const div = document.createElement('div');
    div.innerHTML = `Number: ${u.number} - Prize: ${u.prize || '-'} <button onclick="removeUser('${u.number}')">Remove</button>`;
    container.appendChild(div);
  });
}

function removeUser(num){
  delete users[num];
  const user = userDetails.find(u => u.number === num);
  if(user) user.prize = null;
  winners = winners.filter(w => w.number !== num);
  database.ref('users/' + num).remove();
  winners.forEach(w => { if(w.number === num) database.ref('winners/' + w.index).remove(); });
  renderUsersAdmin();
  renderWinners();
  renderCards();
  alert(`Number ${num} can now scratch again`);
}
</script>

</body>
</html>
