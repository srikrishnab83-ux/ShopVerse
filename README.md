<!DOCTYPE html>
<html lang="kn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Yakshagana Scratch & Win</title>
<style>
  body { font-family: Arial, sans-serif; text-align: center; background: #f8f4e3; }
  .login, .dashboard, .admin-panel { margin: 20px auto; padding: 20px; border: 1px solid #ccc; background: #fff; border-radius: 10px; max-width: 400px; }
  .card { width: 100px; height: 100px; margin: 10px; display: inline-block; background: #ccc; border-radius: 10px; line-height: 100px; font-size: 18px; cursor: pointer; position: relative; overflow: hidden; user-select: none; }
  .scratch-layer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #999; z-index: 2; }
  .scratched .scratch-layer { display: none; }
  input { padding: 10px; margin: 10px; width: 80%; }
  button { padding: 10px 20px; margin: 10px; cursor: pointer; }
</style>
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
let users = {};
let winners = [];
const totalCards = 20;
let prizes = Array.from({length: totalCards}, (_, i) => `Prize ${i+1}`);
let currentUser = '';

function login(){
  const num = document.getElementById('userNumber').value;
  if(!num) { alert('ದಯವಿಟ್ಟು ಸಂಖ್ಯೆ ನಮೂದಿಸಿ'); return; }
  currentUser = num;
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
    card.innerHTML = `<div class='scratch-layer'></div>${prizes[i]}`;
    card.addEventListener('click', () => scratchCard(i));
    container.appendChild(card);
  }
}

function scratchCard(index){
  if(users[currentUser]) { alert('ನೀವು ಈಗಾಗಲೇ ಕಾರ್ಡ್ ಸ್ಕ್ರ್ಯಾಚ್ ಮಾಡಿದ್ದಾರೆ'); return; }
  const cardEl = document.getElementById('card-'+index);
  cardEl.classList.add('scratched');
  users[currentUser] = prizes[index];
  winners.push({number: currentUser, prize: prizes[index]});
  renderWinners();
}

function renderWinners(){
  const list = document.getElementById('winnerList');
  list.innerHTML = winners.map(w => `ನಂಬರ್: ${w.number} - ಜಯ: ${w.prize}`).join('<br>');
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

function showAdminPanel(){
  document.getElementById('adminDiv').style.display = 'block';
}

function logoutAdmin(){
  document.getElementById('adminDiv').style.display = 'none';
  document.getElementById('editPrizes').style.display = 'none';
  document.getElementById('adminPass').value = '';
  alert('Admin logged out successfully');
}

/* Admin Panel */
function loginAdmin(){
  const pass = document.getElementById('adminPass').value;
  if(pass === 'admin123'){
    document.getElementById('editPrizes').style.display = 'block';
    renderPrizeEditor();
    renderUsersAdmin();
  } else {
    alert('Incorrect Password');
  }
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
  for(let i=0;i<totalCards;i++){
    const val = document.getElementById(`prizeInput${i}`).value;
    prizes[i] = val;
  }
  alert('Prizes updated successfully');
  renderCards();
}

function renderUsersAdmin(){
  const container = document.getElementById('usersContainer');
  container.innerHTML = '';
  if(Object.keys(users).length === 0){
    container.innerHTML = 'ಯಾವುದೇ ಬಳಕೆದಾರರ ಮಾಹಿತಿಯಿಲ್ಲ';
    return;
  }
  Object.keys(users).forEach(num => {
    const div = document.createElement('div');
    div.innerHTML = `Number: ${num} - Prize: ${users[num]} <button onclick="removeUser('${num}')">Remove</button>`;
    container.appendChild(div);
  });
}

function removeUser(num){
  delete users[num];
  winners = winners.filter(w => w.number !== num);
  renderUsersAdmin();
  renderWinners();
  alert(`Number ${num} can now scratch again`);
}
</script>

</body>
</html>
