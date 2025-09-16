import React from 'react';

const Emergency = () => {
  return (
    <div className="emergency">
      <h1>அவசர உதவி</h1>
      <p>உங்களுக்கு உடனடி உதவி தேவைப்பட்டால், கீழே உள்ள பொத்தான்களை அழுத்தவும்.</p>

      <a href="tel:108" className="btn">🚑 ஆம்புலன்ஸ் (108)</a><br />
      <a href="tel:100" className="btn">👮 போலீஸ் (100)</a><br />
      <a href="tel:112" className="btn">📞 அவசர எண் (112)</a><br />

      <p>உங்கள் இடத்தை தெளிவாகச் சொல்லுங்கள். விரைவில் உதவி வரும்.</p>

      <br />
      <a href="/">⬅️ முதன்மை பக்கம்</a>
    </div>
  );
};

export default Emergency;
