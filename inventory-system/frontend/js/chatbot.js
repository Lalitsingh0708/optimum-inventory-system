/* ══════════════════════════════════════════════
   SpareCo AI Assistant — Floating Chatbot Widget
   Powered by Google Gemini API
   ══════════════════════════════════════════════ */

const GEMINI_API_KEY = 'AIzaSyBCcxgBDn_Whxl26BHOsEdAA7WxbBj99t8'; // ← replace with your key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;


/* ── INJECT CSS ── */
const chatCSS = document.createElement('style');
chatCSS.textContent = ` 
  /* Floating button */
  #sparecoChatBtn {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c0392b, #e74c3c);
    border: none;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(192,57,43,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    z-index: 10000;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    animation: chatPulse 2.5s infinite;
  }
  #sparecoChatBtn:hover {
    transform: scale(1.1);
    box-shadow: 0 10px 32px rgba(192,57,43,0.55);
  }
  #sparecoChatBtn .chat-badge {
    position: absolute;
    top: -4px; right: -4px;
    background: #22c55e;
    width: 14px; height: 14px;
    border-radius: 50%;
    border: 2px solid #fff;
    animation: blink 1.6s infinite;
  }
  @keyframes chatPulse {
    0%,100% { box-shadow: 0 6px 24px rgba(192,57,43,0.45); }
    50%      { box-shadow: 0 8px 32px rgba(192,57,43,0.7); }
  }
  @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

  /* Chat panel */
  #sparecoChatPanel {
    position: fixed;
    bottom: 100px;
    right: 28px;
    width: 380px;
    max-height: 580px;
    border-radius: 18px;
    background: #fff;
    box-shadow: 0 20px 60px rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
    z-index: 10001;
    overflow: hidden;
    transform: translateY(20px) scale(0.97);
    opacity: 0;
    pointer-events: none;
    transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
  }
  #sparecoChatPanel.open {
    transform: translateY(0) scale(1);
    opacity: 1;
    pointer-events: all;
  }

  /* Header */
  .chat-header {
    background: linear-gradient(135deg, #1e293b, #0f172a);
    padding: 16px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }
  .chat-avatar {
    width: 38px; height: 38px;
    background: linear-gradient(135deg,#c0392b,#e74c3c);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem;
    flex-shrink: 0;
  }
  .chat-header-info { flex:1; }
  .chat-header-name { color: #fff; font-weight: 700; font-size: 0.9rem; }
  .chat-header-sub  { color: #64748b; font-size: 0.68rem; margin-top: 2px; display:flex; align-items:center; gap:5px; }
  .chat-online-dot  { width:7px; height:7px; background:#22c55e; border-radius:50%; }
  .chat-close-btn {
    background: rgba(255,255,255,0.1);
    border: none;
    color: #fff;
    width: 28px; height: 28px;
    border-radius: 50%;
    cursor: pointer;
    display: flex; align-items:center; justify-content:center;
    font-size: 0.85rem;
    transition: background 0.2s;
  }
  .chat-close-btn:hover { background: rgba(255,255,255,0.2); }

  /* Messages area */
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f8fafc;
    scrollbar-width: thin;
    scrollbar-color: #e2e8f0 transparent;
  }

  /* Bubble */
  .chat-bubble {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 14px;
    font-size: 0.82rem;
    line-height: 1.6;
    word-break: break-word;
  }
  .chat-bubble.bot {
    background: #fff;
    color: #1e293b;
    border: 1px solid #e2e8f0;
    border-radius: 4px 14px 14px 14px;
    align-self: flex-start;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .chat-bubble.user {
    background: linear-gradient(135deg,#c0392b,#e74c3c);
    color: #fff;
    border-radius: 14px 14px 4px 14px;
    align-self: flex-end;
    box-shadow: 0 4px 12px rgba(192,57,43,0.3);
  }
  .chat-bubble.bot b  { color: #c0392b; }
  .chat-bubble.bot ul { margin: 6px 0 0 16px; padding:0; }
  .chat-bubble.bot li { margin-bottom: 3px; }

  /* Typing dots */
  .chat-typing {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 4px 14px 14px 14px;
    width: fit-content;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .chat-typing span {
    width: 7px; height: 7px;
    background: #94a3b8;
    border-radius: 50%;
    animation: typingBounce 1.2s infinite;
  }
  .chat-typing span:nth-child(2) { animation-delay: 0.2s; }
  .chat-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); }
    30%          { transform: translateY(-6px); }
  }

  /* Suggested prompts */
  .chat-suggestions {
    padding: 8px 16px;
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    background: #f8fafc;
    border-top: 1px solid #f1f5f9;
    flex-shrink: 0;
  }
  .chat-chip {
    font-size: 0.7rem;
    padding: 5px 10px;
    border-radius: 100px;
    background: #fff;
    border: 1px solid #e2e8f0;
    cursor: pointer;
    color: #475569;
    font-weight: 600;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .chat-chip:hover { background: #fff8f8; border-color: #e74c3c; color: #c0392b; }

  /* Input bar */
  .chat-inputbar {
    display: flex;
    gap: 8px;
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    flex-shrink: 0;
  }
  .chat-input {
    flex: 1;
    border: 1px solid #e5e7eb;
    border-radius: 100px;
    padding: 9px 16px;
    font-size: 0.82rem;
    outline: none;
    font-family: inherit;
    transition: border 0.2s;
    background: #f8fafc;
    color: #1e293b;
  }
  .chat-input:focus { border-color: #e74c3c; background: #fff; }
  .chat-send-btn {
    width: 36px; height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg,#c0392b,#e74c3c);
    border: none;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
    font-size: 0.9rem;
    transition: transform 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  .chat-send-btn:hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(192,57,43,0.4); }
  .chat-send-btn:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }

  @media (max-width: 440px) {
    #sparecoChatPanel { width: calc(100vw - 20px); right: 10px; bottom: 90px; }
  }
`;
document.head.appendChild(chatCSS);

/* ── INJECT HTML ── */
const chatHTML = `
  <!-- Floating Button -->
  <button id="sparecoChatBtn" onclick="toggleChat()" title="SpareCo AI Assistant">
    <span id="chatBtnIcon">🤖</span>
    <span class="chat-badge"></span>
  </button>

  <!-- Chat Panel -->
  <div id="sparecoChatPanel">
    <!-- Header -->
    <div class="chat-header">
      <div class="chat-avatar">🤖</div>
      <div class="chat-header-info">
        <div class="chat-header-name">SpareCo AI Assistant</div>
        <div class="chat-header-sub">
          <span class="chat-online-dot"></span>
          Online · Inventory Intelligence
        </div>
      </div>
      <button class="chat-close-btn" onclick="toggleChat()">✕</button>
    </div>

    <!-- Messages -->
    <div class="chat-messages" id="chatMessages"></div>

    <!-- Suggestions -->
    <div class="chat-suggestions" id="chatSuggestions">
      <span class="chat-chip" onclick="sendChip(this)">📦 Low stock alerts</span>
      <span class="chat-chip" onclick="sendChip(this)">📊 What is EOQ?</span>
      <span class="chat-chip" onclick="sendChip(this)">📋 Active orders</span>
      <span class="chat-chip" onclick="sendChip(this)">🏢 List suppliers</span>
      <span class="chat-chip" onclick="sendChip(this)">💡 Safety stock tips</span>
    </div>

    <!-- Input -->
    <div class="chat-inputbar">
      <input id="chatInput" class="chat-input" placeholder="Ask about inventory, orders, EOQ..." 
             onkeydown="if(event.key==='Enter') sendChat()">
      <button class="chat-send-btn" id="chatSendBtn" onclick="sendChat()">➤</button>
    </div>
  </div>
`;
document.body.insertAdjacentHTML('beforeend', chatHTML);

/* ── STATE ── */
let chatOpen = false;
let chatHistory = []; // { role, parts: [{text}] }
let liveContext = {};

/* ── TOGGLE ── */
function toggleChat() {
  chatOpen = !chatOpen;
  const panel = document.getElementById('sparecoChatPanel');
  const icon  = document.getElementById('chatBtnIcon');
  panel.classList.toggle('open', chatOpen);
  icon.textContent = chatOpen ? '✕' : '🤖';

  if (chatOpen && document.getElementById('chatMessages').children.length === 0) {
    addBotMessage("👋 Hi! I'm **SpareCo AI**, your inventory intelligence assistant.\n\nI can help you with:\n• 📦 Stock levels & low-stock alerts\n• 📋 Active purchase orders\n• 🏢 Supplier information\n• 📊 EOQ, Safety Stock & ROP calculations\n• 💡 Inventory optimization tips\n\nWhat would you like to know?");
    fetchLiveContext();
  }
}

/* ── FETCH LIVE INVENTORY DATA ── */
async function fetchLiveContext() {
  try {
    const [sparesRes, ordersRes, suppliersRes] = await Promise.all([
      fetch('/api/spares'),
      fetch('/api/orders'),
      fetch('/api/suppliers')
    ]);
    const spares    = await sparesRes.json();
    const orders    = await ordersRes.json();
    const suppliers = await suppliersRes.json();

    const lowStock  = spares.filter(s => s.currentStock <= s.minimumStock);
    const pending   = orders.filter(o => o.status === 'Pending');

    liveContext = {
      totalSpares:    spares.length,
      lowStockParts:  lowStock.map(s => `${s.name} (stock: ${s.currentStock}/${s.minimumStock})`),
      totalSuppliers: suppliers.length,
      supplierNames:  suppliers.map(s => `${s.name} (${s.email || 'no email'})`),
      pendingOrders:  pending.map(o => `PO: ${o.sparePart?.name || 'Part'} × ${o.quantityOrdered} units from ${o.supplier?.name || 'Supplier'}, ₹${o.agreedPrice}`),
      receivedOrders: orders.filter(o => o.status === 'Received').length,
      sparesSummary:  spares.slice(0, 10).map(s => `${s.name} (₹${s.unitPrice}/unit, stock: ${s.currentStock})`),
    };
  } catch(e) {
    liveContext = { error: 'Could not fetch live data' };
  }
}

/* ── BUILD SYSTEM PROMPT with live context ── */
function buildSystemPrompt() {
  const ctx = liveContext;
  return `You are SpareCo AI, an intelligent assistant for the SpareCo Inventory Management System — an industrial machine spare parts management platform.

CURRENT LIVE INVENTORY DATA (as of right now):
- Total spare parts registered: ${ctx.totalSpares ?? 'unknown'}
- Low stock / critical parts: ${ctx.lowStockParts?.length ? ctx.lowStockParts.join(', ') : 'None — all parts are adequately stocked'}
- Total suppliers: ${ctx.totalSuppliers ?? 'unknown'}
- Suppliers: ${ctx.supplierNames?.join(', ') || 'none'}
- Pending purchase orders: ${ctx.pendingOrders?.length ? ctx.pendingOrders.join(' | ') : 'None'}
- Received orders: ${ctx.receivedOrders ?? 'unknown'}
- Spare parts sample: ${ctx.sparesSummary?.join(', ') || 'none'}

YOUR CAPABILITIES:
1. Answer questions about inventory levels, low stock, suppliers, orders
2. Explain EOQ (Economic Order Quantity), Safety Stock, Reorder Point formulas
3. Give inventory optimization advice
4. Help interpret the live data
5. Guide users through system features

PERSONALITY: Professional, helpful, concise. Use bullet points for lists. Keep responses under 200 words unless a detailed explanation is needed. Use ₹ for currency. Always be accurate about numbers from the live data above.

If asked to calculate EOQ: EOQ = √(2DS/H) where D=annual demand, S=ordering cost, H=holding cost per unit per year.
If asked to calculate Safety Stock: SS = Z × σ × √L where Z=service level factor, σ=demand std dev, L=lead time.
If asked to calculate ROP: ROP = (d̄ × L) + SS where d̄=avg daily demand, L=lead time.`;
}

/* ── ADD MESSAGES ── */
function addBotMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-bubble bot';
  div.innerHTML = formatBotText(text);
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'chat-bubble user';
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.id = 'typingIndicator';
  div.className = 'chat-typing';
  div.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return div;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

/* ── FORMAT BOT TEXT ── */
function formatBotText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\*(.*?)\*/g, '<i>$1</i>')
    .replace(/^• (.+)$/gm, '<li>$1</li>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/\n/g, '<br>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
}

/* ── SEND CHAT ── */
async function sendChat() {
  const input = document.getElementById('chatInput');
  const text  = input.value.trim();
  if (!text) return;

  // Clear input
  input.value = '';
  document.getElementById('chatSendBtn').disabled = true;

  // Show user message
  addUserMessage(text);

  // Hide chips after first user message
  document.getElementById('chatSuggestions').style.display = 'none';

  // Show typing
  const typing = showTyping();

  // Add to history
  chatHistory.push({ role: 'user', parts: [{ text }] });

  // Keep history to last 10 turns for token efficiency
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

  try {
    // Refresh live context silently
    await fetchLiveContext();

    const payload = {
      system_instruction: { parts: [{ text: buildSystemPrompt() }] },
      contents: chatHistory
    };

    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBCcxgBDn_Whxl26BHOsEdAA7WxbBj99t8", {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'API error');
    }

    const data    = await res.json();
    const botText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";

    // Add bot response to history
    chatHistory.push({ role: 'model', parts: [{ text: botText }] });

    removeTyping();
    addBotMessage(botText);

  } catch (err) {
    console.error('Chatbot error:', err);
    removeTyping();
    addBotMessage(`❌ **API Errs:** ${err.message || 'Unknown error. Check console for details.'}`);
  }

  document.getElementById('chatSendBtn').disabled = false;
  document.getElementById('chatInput').focus();
}

/* ── CHIP CLICK ── */
function sendChip(el) {
  const input = document.getElementById('chatInput');
  // Map chips to full natural questions
  const chipMap = {
    '📦 Low stock alerts':  'Which spare parts are currently low on stock or critical?',
    '📊 What is EOQ?':      'Explain the Economic Order Quantity formula and how to use it.',
    '📋 Active orders':     'Show me all the active pending purchase orders.',
    '🏢 List suppliers':    'List all registered suppliers with their conta2ct details.',
    '💡 Safety stock tips': 'Give me tips on optimizing safety stock levels for my inventory.',
  };
  input.value = chipMap[el.textContent.trim()] || el.textContent.trim();
  sendChat();
}
