// ===== KrishiAI — App Interactivity + Firebase =====

document.addEventListener('DOMContentLoaded', () => {

  // ═══════════════════════════════════════════
  // ── Firebase Auth & UI Bindings ──
  // ═══════════════════════════════════════════
  const authOverlay   = document.getElementById('authOverlay');
  const authClose     = document.getElementById('authClose');
  const authForm      = document.getElementById('authForm');
  const authEmail     = document.getElementById('authEmail');
  const authPassword  = document.getElementById('authPassword');
  const authName      = document.getElementById('authName');
  const nameField     = document.getElementById('nameField');
  const authError     = document.getElementById('authError');
  const authSubmit    = document.getElementById('authSubmit');
  const authTabs      = document.querySelectorAll('.auth-tab');
  const googleSignIn  = document.getElementById('googleSignIn');

  const navSignIn     = document.getElementById('navSignIn');
  const navUser       = document.getElementById('navUser');
  const navUserBtn    = document.getElementById('navUserBtn');
  const navUserAvatar = document.getElementById('navUserAvatar');
  const navUserName   = document.getElementById('navUserName');
  const navDropdown   = document.getElementById('navDropdown');
  const navDropdownEmail = document.getElementById('navDropdownEmail');
  const navSignOut    = document.getElementById('navSignOut');

  let authMode = 'login'; // 'login' or 'signup'
  let currentUser = null;

  // ── Open / Close Auth Modal ──
  function openAuthModal() {
    authOverlay.classList.add('open');
    authError.textContent = '';
    authEmail.value = '';
    authPassword.value = '';
    authName.value = '';
  }

  function closeAuthModal() {
    authOverlay.classList.remove('open');
  }

  navSignIn?.addEventListener('click', openAuthModal);
  authClose?.addEventListener('click', closeAuthModal);
  authOverlay?.addEventListener('click', (e) => {
    if (e.target === authOverlay) closeAuthModal();
  });

  // ── Auth Tabs ──
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      authMode = tab.dataset.tab;
      authError.textContent = '';

      if (authMode === 'signup') {
        nameField.style.display = 'block';
        authSubmit.textContent = 'Create Account';
      } else {
        nameField.style.display = 'none';
        authSubmit.textContent = 'Sign In';
      }
    });
  });

  // ── Email Auth ──
  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    authError.textContent = '';
    authSubmit.disabled = true;
    authSubmit.textContent = 'Please wait...';

    const email = authEmail.value.trim();
    const password = authPassword.value;

    try {
      if (authMode === 'signup') {
        const cred = await auth.createUserWithEmailAndPassword(email, password);
        // Update display name
        const displayName = authName.value.trim() || email.split('@')[0];
        await cred.user.updateProfile({ displayName });
        // Save profile to Firestore
        await saveUserProfile(cred.user, displayName);
      } else {
        await auth.signInWithEmailAndPassword(email, password);
      }
      closeAuthModal();
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'This email is already registered. Try signing in.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/invalid-credential': 'Invalid credentials. Please check and try again.',
        'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
      };
      authError.textContent = messages[err.code] || err.message;
    } finally {
      authSubmit.disabled = false;
      authSubmit.textContent = authMode === 'signup' ? 'Create Account' : 'Sign In';
    }
  });

  // ── Google Sign-In ──
  googleSignIn?.addEventListener('click', async () => {
    authError.textContent = '';
    try {
      const result = await auth.signInWithPopup(googleProvider);
      // Save profile on first Google sign-in
      const docRef = db.collection('users').doc(result.user.uid);
      const doc = await docRef.get();
      if (!doc.exists) {
        await saveUserProfile(result.user, result.user.displayName);
      }
      closeAuthModal();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') {
        authError.textContent = err.message;
      }
    }
  });

  // ── Save User Profile to Firestore ──
  async function saveUserProfile(user, displayName) {
    try {
      await db.collection('users').doc(user.uid).set({
        uid: user.uid,
        name: displayName || user.displayName || 'Farmer',
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not save user profile:', e);
    }
  }

  // ── Auth State Listener ──
  auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    if (user) {
      // Show user profile in navbar
      navSignIn.style.display = 'none';
      navUser.style.display = 'block';
      navUserName.textContent = user.displayName || user.email.split('@')[0];
      navDropdownEmail.textContent = user.email;

      if (user.photoURL) {
        navUserAvatar.src = user.photoURL;
        navUserAvatar.alt = user.displayName || 'User';
      } else {
        // Generate initials avatar
        const initials = (user.displayName || user.email)[0].toUpperCase();
        navUserAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=3aa82a&color=fff&size=60&rounded=true&bold=true`;
        navUserAvatar.alt = initials;
      }

      // Load chat history
      await loadChatHistory(user.uid);
    } else {
      // Show sign-in button
      navSignIn.style.display = '';
      navUser.style.display = 'none';
    }
  });

  // ── Profile Dropdown ──
  navUserBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    navDropdown.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    navDropdown?.classList.remove('open');
  });

  // ── Sign Out ──
  navSignOut?.addEventListener('click', async () => {
    await auth.signOut();
    navDropdown.classList.remove('open');
    // Reset chat to default
    chatMessages.innerHTML = '';
    appendMessage(
      'Namaste! 🙏 I\'m your KrishiAI assistant. I can help you with crop advice, weather forecasts, pest detection, market prices, and government schemes. What would you like to know today?',
      'bot'
    );
  });


  // ═══════════════════════════════════════════
  // ── Firestore Chat Persistence ──
  // ═══════════════════════════════════════════
  async function saveChatHistory() {
    if (!currentUser) return;
    try {
      // Collect all visible messages
      const msgs = [];
      chatMessages.querySelectorAll('.chat-message').forEach(el => {
        const type = el.classList.contains('bot') ? 'bot' : 'user';
        const bubble = el.querySelector('.chat-bubble');
        if (bubble) {
          msgs.push({ type, html: bubble.innerHTML });
        }
      });
      await db.collection('chats').doc(currentUser.uid).set({
        uid: currentUser.uid,
        messages: msgs,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (e) {
      console.warn('Could not save chat:', e);
    }
  }

  async function loadChatHistory(uid) {
    try {
      const doc = await db.collection('chats').doc(uid).get();
      if (doc.exists && doc.data().messages && doc.data().messages.length > 0) {
        chatMessages.innerHTML = '';
        doc.data().messages.forEach(msg => {
          const msgDiv = document.createElement('div');
          msgDiv.className = `chat-message ${msg.type}`;

          const avatarDiv = document.createElement('div');
          avatarDiv.className = 'chat-msg-avatar';
          avatarDiv.textContent = msg.type === 'bot' ? '🌿' : '👨‍🌾';

          const bubbleDiv = document.createElement('div');
          bubbleDiv.className = 'chat-bubble';
          bubbleDiv.innerHTML = msg.html;

          msgDiv.appendChild(avatarDiv);
          msgDiv.appendChild(bubbleDiv);
          chatMessages.appendChild(msgDiv);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    } catch (e) {
      console.warn('Could not load chat history:', e);
    }
  }


  // ═══════════════════════════════════════════
  // ── Stat Counter Animation ──
  // ═══════════════════════════════════════════
  const counters = document.querySelectorAll('.counter');
  let countersDone = false;

  const animateCounters = () => {
    if (countersDone) return;
    counters.forEach(counter => {
      const target = +counter.dataset.target;
      const duration = 2000;
      const start = performance.now();

      const tick = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.round(target * eased);
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          counter.textContent = target;
        }
      };
      requestAnimationFrame(tick);
    });
    countersDone = true;
  };

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateCounters(); });
  }, { threshold: 0.3 });
  const heroEl = document.getElementById('hero');
  if (heroEl) heroObserver.observe(heroEl);


  // ═══════════════════════════════════════════
  // ── Soil Health Bar Animation ──
  // ═══════════════════════════════════════════
  const soilBars = document.querySelectorAll('.soil-bar-fill');

  const animateSoilBars = () => {
    soilBars.forEach(bar => {
      const width = bar.dataset.width;
      bar.style.width = width + '%';
    });
  };

  const soilObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateSoilBars(); });
  }, { threshold: 0.2 });
  const soilCard = document.getElementById('soilCard');
  if (soilCard) soilObserver.observe(soilCard);


  // ═══════════════════════════════════════════
  // ── Mobile Hamburger Menu ──
  // ═══════════════════════════════════════════
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.getElementById('navLinks');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const spans = hamburgerBtn.querySelectorAll('span');
      hamburgerBtn.classList.toggle('active');
      if (navLinks.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '1';
        spans[2].style.transform = '';
      }
    });
  }


  // ═══════════════════════════════════════════
  // ── Chatbot Logic ──
  // ═══════════════════════════════════════════
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  const quickReplies = document.querySelectorAll('.quick-reply-btn');
  const refreshChat = document.getElementById('refreshChat');

  const botResponses = {
    'Suggest best paddy varieties':
      '🌾 For Telangana, top-performing paddy varieties include:\n\n1. **RNR-15048 (Telangana Sona)** — Fine grain, high yield\n2. **JGL-11470 (Bathukamma)** — Short duration, pest resistant\n3. **MTU-1010** — Medium duration, good for clayey soils\n\nWould you like fertilizer recommendations for these?',
    'Show today\'s weather forecast':
      '🌤️ **Today\'s Forecast — Hyderabad**\n\n🌡️ High: 34°C · Low: 24°C\n🌧️ Rainfall: 40% chance in evening\n💨 Wind: 12 km/h NE\n💧 Humidity: 68%\n\n⚠️ Advisory: Avoid spraying pesticides today due to expected rain.',
    'How to detect pests in my crop?':
      '🐛 To detect pests in your crop:\n\n📸 **Step 1**: Take a clear photo of the affected leaf\n📤 **Step 2**: Upload it using the camera button below\n🔬 **Step 3**: Our AI will identify the pest/disease in seconds\n💊 **Step 4**: Get treatment recommendations\n\nYou can also describe symptoms — like "yellow spots on rice leaves" — and I\'ll help!',
    'What are today\'s market prices for rice?':
      '📈 **Rice Market Prices (Today)**\n\n| Mandi | Variety | Price (₹/qtl) |\n|---|---|---|\n| Nizamabad | Sona | ₹2,180 |\n| Warangal | BPT | ₹2,050 |\n| Karimnagar | HMT | ₹2,320 |\n\n💡 Tip: Prices are highest at Karimnagar today. Consider selling there!',
    'Tell me about PM-KISAN scheme':
      '🏛️ **PM-KISAN Samman Nidhi**\n\n💰 ₹6,000/year in 3 installments of ₹2,000 each\n👨‍🌾 Eligible: All small & marginal farmer families\n📋 Documents: Aadhaar, Bank A/C, Land records\n\n✅ Next installment: April 2026\n\nWant me to check your eligibility or help you apply?',
  };

  const defaultResponses = [
    '🤔 That\'s a great question! Let me look into that for you. In the meantime, try using quick-reply buttons for common queries.',
    '🌿 I\'m still learning, but I can definitely help with crop advice, weather, pest detection, and market prices. Could you rephrase your question?',
    '👨‍🌾 Thanks for asking! For best results, try asking specific questions like "best crop for black soil" or "today\'s tomato price".',
    '📚 I have detailed information about 120+ crop varieties, 15+ states\' weather, and live mandi prices. What specific information do you need?',
  ];

  function appendMessage(text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${type}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-msg-avatar';
    avatarDiv.textContent = type === 'bot' ? '🌿' : '👨‍🌾';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';
    bubbleDiv.innerHTML = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot';
    typingDiv.id = 'typingIndicator';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'chat-msg-avatar';
    avatarDiv.textContent = '🌿';

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'chat-bubble';
    bubbleDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `;

    typingDiv.appendChild(avatarDiv);
    typingDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    appendMessage(text, 'user');
    chatInput.value = '';

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const response = botResponses[text]
        || defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      appendMessage(response, 'bot');
      // Save to Firestore after bot replies
      saveChatHistory();
    }, 800 + Math.random() * 700);
  }

  sendBtn.addEventListener('click', () => handleUserMessage(chatInput.value));

  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserMessage(chatInput.value);
  });

  quickReplies.forEach(btn => {
    btn.addEventListener('click', () => {
      const msg = btn.dataset.msg;
      handleUserMessage(msg);
    });
  });

  // Refresh chat
  if (refreshChat) {
    refreshChat.addEventListener('click', () => {
      chatMessages.innerHTML = '';
      appendMessage(
        'Namaste! 🙏 I\'m your KrishiAI assistant. I can help you with crop advice, weather forecasts, pest detection, market prices, and government schemes. What would you like to know today?',
        'bot'
      );
      saveChatHistory();
    });
  }

  // Mic & Camera stubs
  document.getElementById('micBtn')?.addEventListener('click', () => {
    appendMessage('🎙️ Voice input activated...', 'user');
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      appendMessage('🎤 Voice input feature coming soon! For now, please type your question or use the quick-reply buttons.', 'bot');
      saveChatHistory();
    }, 1000);
  });

  document.getElementById('cameraBtn')?.addEventListener('click', () => {
    appendMessage('📷 Camera activated for leaf scan...', 'user');
    showTypingIndicator();
    setTimeout(() => {
      removeTypingIndicator();
      appendMessage('📸 Camera-based pest detection is coming soon! You can describe the symptoms of your crop and I\'ll help diagnose the issue.', 'bot');
      saveChatHistory();
    }, 1000);
  });


  // ═══════════════════════════════════════════
  // ── Feature Card Interactions ──
  // ═══════════════════════════════════════════
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('.feature-name')?.textContent;
      if (name && chatInput) {
        chatInput.value = `Tell me more about ${name}`;
        chatInput.focus();
        document.getElementById('chatbotPanel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ═══════════════════════════════════════════
  // ── Sidebar Nav Highlighting ──
  // ═══════════════════════════════════════════
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.sidebar-nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

});
