import React from 'react';

const Home = () => {
  return (
    <div>
      <h1>🩺 ஸ்மார்ட் சுகாதார உதவி</h1>
      <p>கிராமப்புற மக்களுக்கான சுலபமான சுகாதார உதவி அமைப்பு.</p>

      <nav>
        <ul>
          <li><a href="/reminders">💊 நினைவூட்டல்கள்</a></li>
          <li><a href="/consult">👨‍⚕️ ஆலோசனை</a></li>
          <li><a href="/health">📖 சுகாதார குறிப்புகள்</a></li>
          <li><a href="/emergency">🚨 அவசர உதவி</a></li>
        </ul>
      </nav>

      <p style={{ marginTop: '20px' }}>உங்கள் ஆரோக்கியம் எங்கள் முன்னுரிமை 🌿</p>

      <footer>
        © 2025 ஸ்மார்ட் ஹெல்த்கேர் | தமிழ் சுகாதார ஆதரவு
      </footer>
    </div>
  );
};

export default Home;
