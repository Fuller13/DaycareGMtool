// Local Storage for Input Persistence
function saveInput(element) {
  localStorage.setItem(element.id, element.value);
}
function loadInputs() {
  document.querySelectorAll('input, textarea').forEach(el => {
    const saved = localStorage.getItem(el.id);
    if (saved) el.value = saved;
  });
}
// Hope/Fear Counters
let hopeCount = 0, fearCount = 0;
function incrementCounter(type) {
  if (type === 'hope' && hopeCount < 50) hopeCount++;
  if (type === 'fear' && fearCount < 120) fearCount++;
  updateCounterDisplay(type);
  localStorage.setItem(`${type}Count`, type === 'hope' ? hopeCount : fearCount);
}
function decrementCounter(type) {
  if (type === 'hope' && hopeCount > 0) hopeCount--;
  if (type === 'fear' && fearCount > 0) fearCount--;
  updateCounterDisplay(type);
  localStorage.setItem(`${type}Count`, type === 'hope' ? hopeCount : fearCount);
}
function updateCounterDisplay(type) {
  document.getElementById(`${type}-count`).textContent = type === 'hope' ? hopeCount : fearCount;
}
function loadCounters() {
  hopeCount = parseInt(localStorage.getItem('hopeCount') || 0);
  fearCount = parseInt(localStorage.getItem('fearCount') || 0);
  updateCounterDisplay('hope');
  updateCounterDisplay('fear');
}
// Dice Roller
function rollDualityDice() {
  const hope = Math.floor(Math.random() * 12) + 1;
  const fear = Math.floor(Math.random() * 12) + 1;
  const total = hope + fear;
  const outcome = hope > fear ? 'Hope' : fear > hope ? 'Fear' : 'Critical (Doubles)';
  const result = `Total: ${total} (${hope} Hope, ${fear} Fear) - ${outcome}${hope === fear ? ' - Gain 1 Hope, Clear 1 Stress' : ''}`;
  document.getElementById('dice-result').textContent = result;
}
function rollGMDie() {
  const roll = Math.floor(Math.random() * 20) + 1;
  document.getElementById('dice-result').textContent = `GM Die (d20): ${roll}`;
}
function rollDamageDice() {
  const dice = prompt('Enter damage dice (e.g., 1d6, 2d8):');
  if (!dice) return;
  const match = dice.match(/(\d+)d(\d+)/);
  if (!match) {
    document.getElementById('dice-result').textContent = 'Invalid format';
    return;
  }
  const count = parseInt(match[1]), sides = parseInt(match[2]);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  document.getElementById('dice-result').textContent = `Damage Roll (${dice}): ${total}`;
}
// Countdown Timer
let timerInterval, timeLeft = 0;
function startTimer() {
  const input = document.getElementById('timer-seconds').value;
  if (!input || isNaN(input)) return;
  timeLeft = parseInt(input);
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      document.getElementById('timer-display').textContent = '00:00';
      alert('Countdown Complete!');
      return;
    }
    timeLeft--;
    updateTimerDisplay();
  }, 1000);
  updateTimerDisplay();
}
function pauseTimer() {
  clearInterval(timerInterval);
}
function resetTimer() {
  clearInterval(timerInterval);
  timeLeft = 0;
  document.getElementById('timer-seconds').value = '';
  document.getElementById('timer-display').textContent = '00:00';
}
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById('timer-display').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
// Adversary Tracker
function addAdversary() {
  const adversaryDiv = document.createElement('div');
  adversaryDiv.className = 'adversary';
  adversaryDiv.innerHTML = `
    <input type="text" placeholder="Name" oninput="saveAdversary(this)">
    <input type="number" placeholder="HP" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Evasion" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Armor" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Agility" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Strength" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Finesse" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Instinct" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Presence" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Knowledge" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Minor Threshold" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Major Threshold" min="0" oninput="saveAdversary(this)">
    <input type="number" placeholder="Severe Threshold" min="0" oninput="saveAdversary(this)">
    <textarea placeholder="Abilities/Notes" oninput="saveAdversary(this)"></textarea>
  `;
  document.getElementById('adversaries').appendChild(adversaryDiv);
}
function saveAdversary(element) {
  const adversaryDiv = element.closest('.adversary');
  const inputs = adversaryDiv.querySelectorAll('input, textarea');
  const index = Array.from(adversaryDiv.parentNode.children).indexOf(adversaryDiv);
  const data = {
    name: inputs[0].value,
    hp: inputs[1].value,
    evasion: inputs[2].value,
    armor: inputs[3].value,
    agility: inputs[4].value,
    strength: inputs[5].value,
    finesse: inputs[6].value,
    instinct: inputs[7].value,
    presence: inputs[8].value,
    knowledge: inputs[9].value,
    minor: inputs[10].value,
    major: inputs[11].value,
    severe: inputs[12].value,
    notes: inputs[13].value
  };
  localStorage.setItem(`adversary${index}`, JSON.stringify(data));
}
function loadAdversaries() {
  const adversaries = document.getElementById('adversaries');
  let index = 0;
  while (localStorage.getItem(`adversary${index}`)) {
    if (index > 0) addAdversary();
    const data = JSON.parse(localStorage.getItem(`adversary${index}`));
    const adversaryDiv = adversaries.children[index];
    const inputs = adversaryDiv.querySelectorAll('input, textarea');
    inputs[0].value = data.name;
    inputs[1].value = data.hp;
    inputs[2].value = data.evasion;
    inputs[3].value = data.armor;
    inputs[4].value = data.agility;
    inputs[5].value = data.strength;
    inputs[6].value = data.finesse;
    inputs[7].value = data.instinct;
    inputs[8].value = data.presence;
    inputs[9].value = data.knowledge;
    inputs[10].value = data.minor;
    inputs[11].value = data.major;
    inputs[12].value = data.severe;
    inputs[13].value = data.notes;
    index++;
  }
}
// Toggle Panels with Outside Click Close
function togglePanel(panelId) {
  document.querySelectorAll('.toggle-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');
}
document.addEventListener('click', function(event) {
  const activePanel = document.querySelector('.toggle-panel.active');
  if (activePanel && !activePanel.contains(event.target) && !event.target.classList.contains('toggle-button')) {
    activePanel.classList.remove('active');
  }
});
// Disclaimer Pop-Up
window.onload = () => {
  document.getElementById('disclaimer').style.display = 'block';
  loadInputs();
  loadCounters();
  loadAdversaries();
};
