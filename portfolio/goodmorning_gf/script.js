const messages = {
  sweet: [
    "Good morning, sunshine! ☀️ Hope your day is as lovely as you are!",
    "Woke up thinking about you 💭 Have a beautiful day 💛",
    "Sending you a warm morning hug 🤗 to start your day right!"
  ],
  funny: [
    "Rise and shine! Or just snooze 9 more times... your call 😴",
    "Morning! Let’s pretend we like being awake 😅☕",
    "Good morning! May your coffee be stronger than your Monday mood ☕💪"
  ],
  poetic: [
    "The sun peeks out, birds begin to sing, and I think of you — my everything 🌅❤️",
    "A gentle breeze, a golden light, good morning love, you’re my delight 🍃☀️",
    "Rays of light on your face, a perfect start, full of grace 🌞🌸"
  ]
};

function generateMessage() {
  const phone = document.getElementById('phone').value.trim();
  const category = document.getElementById('category').value;

  if (!phone) {
    alert("Please enter a valid phone number.");
    return;
  }

  savePhoneNumber(phone); // Save to localStorage

  const list = messages[category];
  const msg = list[Math.floor(Math.random() * list.length)];

  const encoded = encodeURIComponent(msg);
  const link = `sms:${phone}&body=${encoded}`;

  document.getElementById('smsLink').href = link;
  document.getElementById('smsLink').textContent = msg;
  document.getElementById('messageLink').style.display = 'block';
}

function savePhoneNumber(phone) {
  let saved = JSON.parse(localStorage.getItem('savedNumbers') || '[]');
  if (!saved.includes(phone)) {
    saved.push(phone);
    localStorage.setItem('savedNumbers', JSON.stringify(saved));
    populateSavedNumbers();
  }
}

function populateSavedNumbers() {
  const select = document.getElementById('savedNumbers');
  const saved = JSON.parse(localStorage.getItem('savedNumbers') || '[]');

  select.innerHTML = '<option value="">📇 Select saved number</option>';
  saved.forEach(num => {
    const opt = document.createElement('option');
    opt.value = num;
    opt.textContent = num;
    select.appendChild(opt);
  });
}

function loadSavedNumber() {
  const selected = document.getElementById('savedNumbers').value;
  if (selected) {
    document.getElementById('phone').value = selected;
  }
}

// Initialize dropdown on page load
populateSavedNumbers();
