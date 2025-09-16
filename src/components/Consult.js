import React, { useState } from 'react';

const Consult = () => {
  const [room, setRoom] = useState('');
  const [iframeSrc, setIframeSrc] = useState('');

  const joinRoom = () => {
    if (!room.trim()) {
      alert('அறை பெயரை உள்ளிடவும்!');
      return;
    }
    setIframeSrc(`https://meet.jit.si/${room.trim()}`);
  };

  return (
    <div>
      <header>👩‍⚕️ மருத்துவர் ஆலோசனை</header>

      <section>
        <p>உங்கள் மருத்துவருடன் காணொலி அழைப்பில் இணையவும்.</p>

        <label htmlFor="room">அறை பெயர்:</label>
        <input
          id="room"
          placeholder="உதா: village123"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />
        <button onClick={joinRoom}>அழைப்பை தொடங்கு</button>

        <div id="videoContainer" style={{ marginTop: '20px' }}>
          {iframeSrc && (
            <iframe
              src={iframeSrc}
              allow="camera; microphone; fullscreen; display-capture"
              width="100%"
              height="600"
              style={{ borderRadius: '8px', border: 'none' }}
              title="Video Call"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Consult;
