import React, { useState, useEffect } from 'react';

const Reminders = () => {
  const [medName, setMedName] = useState('');
  const [time, setTime] = useState('');
  const [reminderText, setReminderText] = useState('');
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    const storedReminders = JSON.parse(localStorage.getItem('reminders') || '[]');
    setReminders(storedReminders);
  }, []);

  const saveReminder = (e) => {
    e.preventDefault();
    if (!medName || !time) {
      alert('மருந்து பெயர் மற்றும் நேரத்தை உள்ளிடவும்');
      return;
    }
    const newReminder = { med: medName, time };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
    setMedName('');
    setTime('');
    alert('நினைவூட்டல் சேமிக்கப்பட்டது!');
  };

  const setReminderTextHandler = () => {
    if (reminderText.trim()) {
      const newReminder = { med: reminderText.trim(), time: '' };
      const updatedReminders = [...reminders, newReminder];
      setReminders(updatedReminders);
      localStorage.setItem('reminders', JSON.stringify(updatedReminders));
      setReminderText('');
      alert('நினைவூட்டல் சேமிக்கப்பட்டது!');
    }
  };

  return (
    <div>
      <header>💊 மருந்து நினைவூட்டல்</header>

      <section>
        <form id="reminderForm" onSubmit={saveReminder}>
          <label>மருந்து பெயர்</label>
          <input
            id="medName"
            required
            placeholder="உதா: பாராசிட்டமால்"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
          />

          <label>நேரம் (YYYY-MM-DD HH:MM)</label>
          <input
            id="time"
            type="datetime-local"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button type="submit">சேமிக்க</button>
        </form>

        <h1>💊 நினைவூட்டல்கள்</h1>

        <input
          type="text"
          id="reminderText"
          placeholder="உங்கள் நினைவூட்டலை எழுதவும்"
          value={reminderText}
          onChange={(e) => setReminderText(e.target.value)}
        />
        <button onClick={setReminderTextHandler}>நினைவூட்டலை சேமிக்க</button>

        <ul id="reminderList">
          {reminders.map((r, index) => (
            <li key={index}>
              {r.med} {r.time && `- ${r.time}`}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Reminders;
