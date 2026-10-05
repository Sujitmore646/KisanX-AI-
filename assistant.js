/**
 * KisanX AI - AI Farming Assistant Module
 */

let currentLang = 'en';
let chatHistory = [];

document.addEventListener('DOMContentLoaded', () => {
  if (!requireAuth()) return;
  renderNotifications();
  initAssistantChat();
  loadChatHistory();
  renderSuggestedQuestions();
});

function initAssistantChat() {
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const form = document.getElementById('chatForm');

  if (!input || !sendBtn) return;

  sendBtn.addEventListener('click', sendChatMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`Language: ${btn.textContent}`, 'info');
    });
  });

  // Set initial welcome
  addAIMessage(getWelcomeMessage());
}

function getWelcomeMessage() {
  const messages = {
    en: `Hello! 👋 I'm **KisanX AI**, your smart farming assistant.\n\nI can help you with:\n• 🌱 Crop recommendations\n• 🧪 Fertiliser advice\n• 🌦 Weather guidance\n• 💰 Market price insights\n• 🐛 Disease identification\n\nHow can I help you today?`,
    hi: `नमस्ते! 👋 मैं **KisanX AI** हूं, आपका स्मार्ट खेती सहायक।\n\nमैं इनमें मदद कर सकता हूं:\n• 🌱 फसल अनुशंसाएं\n• 🧪 उर्वरक सलाह\n• 🌦 मौसम मार्गदर्शन\n• 💰 बाजार भाव जानकारी\n\nआज मैं आपकी कैसे मदद करूं?`,
    mr: `नमस्कार! 👋 मी **KisanX AI** आहे, तुमचा स्मार्ट शेती सहाय्यक.\n\nमी यामध्ये मदत करू शकतो:\n• 🌱 पीक शिफारशी\n• 🧪 खत सल्ला\n• 🌦 हवामान मार्गदर्शन\n• 💰 बाजारभाव माहिती\n\nआज मी तुम्हाला कशी मदत करू?`,
  };
  return messages[currentLang] || messages.en;
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;

  addUserMessage(msg);
  input.value = '';

  // Show typing indicator
  const typingId = 'typing-' + Date.now();
  addTypingIndicator(typingId);

  // Get AI response
  setTimeout(() => {
    removeTypingIndicator(typingId);
    const response = AIEngine.askQuestion(msg);
    addAIMessage(response);
    saveChatHistory();
  }, 1200 + Math.random() * 800);
}

function addUserMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg user';
  msg.textContent = text;

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  chatHistory.push({ role: 'user', text, time: new Date().toISOString() });
}

function addAIMessage(text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msg = document.createElement('div');
  msg.className = 'chat-msg ai';

  // Format markdown-like text
  msg.innerHTML = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/• /g, '• ');

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;

  chatHistory.push({ role: 'ai', text, time: new Date().toISOString() });
}

function addTypingIndicator(id) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const indicator = document.createElement('div');
  indicator.className = 'chat-msg ai';
  indicator.id = id;
  indicator.innerHTML = `
    <div style="display:flex;align-items:center;gap:6px">
      <div class="kisan-spinner" style="width:16px;height:16px;border-width:2px"></div>
      <span style="color:var(--text-light);font-size:0.85rem">AI is thinking...</span>
    </div>`;

  container.appendChild(indicator);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function saveChatHistory() {
  saveToStorage('chatHistory', chatHistory.slice(-50)); // Keep last 50 messages
}

function loadChatHistory() {
  // Don't restore history for fresh start - just show welcome
}

function clearChat() {
  chatHistory = [];
  removeFromStorage('chatHistory');
  const container = document.getElementById('chatMessages');
  if (container) {
    container.innerHTML = '';
    addAIMessage(getWelcomeMessage());
  }
  showToast('Chat cleared', 'info');
}

function askSuggested(question) {
  document.getElementById('chatInput').value = question;
  sendChatMessage();
}

function renderSuggestedQuestions() {
  const container = document.getElementById('suggestedQuestions');
  if (!container) return;

  const questions = [
    { en: 'What fertiliser for tomato?', icon: '🧪' },
    { en: 'Current tomato market price', icon: '💰' },
    { en: 'How to prevent crop disease?', icon: '🐛' },
    { en: 'Weather advice for Nashik', icon: '🌦' },
    { en: 'Best time to harvest onion?', icon: '🧅' },
    { en: 'How to apply irrigation?', icon: '💧' },
    { en: 'Organic farming tips', icon: '🌿' },
    { en: 'Agricultural loan information', icon: '🏦' },
  ];

  container.innerHTML = questions.map(q => `
    <button class="btn btn-sm mb-2 me-2 py-1 px-3" 
      style="background:var(--bg-light);border:1px solid var(--border);border-radius:20px;color:var(--text-mid);font-size:0.8rem;cursor:pointer;transition:all 0.2s"
      onclick="askSuggested('${q.en}')"
      onmouseover="this.style.borderColor='var(--green-agri)';this.style.color='var(--green-agri)'"
      onmouseout="this.style.borderColor='var(--border)';this.style.color='var(--text-mid)'">
      ${q.icon} ${q.en}
    </button>`).join('');
}

function exportChat() {
  const text = chatHistory.map(m => `${m.role === 'user' ? 'You' : 'KisanX AI'}: ${m.text}`).join('\n\n---\n\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'KisanX-Chat-Export.txt';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Chat exported!', 'success');
}
