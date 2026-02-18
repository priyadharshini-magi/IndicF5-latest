import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const VOICE_OPTIONS = {
  english: [
    "en-IN-NeerjaNeural",
    "en-IN-PrabhatNeural",
  ],
  tamil: ["ta-IN-PallaviNeural","ta-IN-ValluvarNeural","ta-LK-SaranyaNeural",],
  hindi: [
    "hi-IN-SwaraNeural",
    "hi-IN-MadhurNeural",],
  telugu: [
    "te-IN-ShrutiNeural",
    "te-IN-MohanNeural",
  ],
  kannada: [
    "kn-IN-SapnaNeural",
  ],
  malayalam: [
    "ml-IN-SobhanaNeural",
    "ml-IN-MidhunNeural"
  ]
};
const SPEED_OPTIONS = [
  { label: "0.75x", value: 0.75 },
  { label: "1x (Normal)", value: 1.0 },
  { label: "1.25x", value: 1.25 },
  { label: "1.5x", value: 1.5 }
];


function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("");
  // const [voice, setVoice] = useState(VOICE_OPTIONS.english[0]);
  const [voice, setVoice] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [speed, setSpeed] = useState("");

useEffect(() => {
  if (language && VOICE_OPTIONS[language]) {
    setVoice("");
  }
}, [language]);

  const generateAudio = async () => {
    if (!text.trim()) {
      alert("Please enter text");
      return;
    }
    if (!language || !voice || !speed) {
    alert("Please select language, voice and speed");
    return;
  }

    try {
      const response = await axios.post("http://localhost:8000/generate", {
        text,
        language,
        voice,
        speed
      });

      if (response.data.error) {
        alert(response.data.error);
        return;
      }

      setAudioUrl(`http://localhost:8000/audio/${response.data.file}`);
    } catch (error) {
      alert("Backend not reachable. Is FastAPI running?");
    }
  };

  return (
    <div className="container">
      <h2>Multi Language Text to Speech</h2>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="dropdown"
      >
      <option value="" disabled>Select a language</option>
        <option value="english">English</option>
        <option value="tamil">Tamil</option>
        <option value="hindi">Hindi</option>
        <option value="telugu">Telugu</option>
        <option value="kannada">Kannada</option>
        <option value="malayalam">Malayalam</option>
      </select>

    <select
  value={voice}
  onChange={(e) => setVoice(e.target.value)}
  className="dropdown"
  disabled={!language}
>
  <option value="" disabled>Choose a voice</option>
  {language &&
    VOICE_OPTIONS[language]?.map((v) => (
      <option key={v} value={v}>
        {v}
      </option>
    ))}
    </select>

  <select
  value={speed}
  onChange={(e) => setSpeed(parseFloat(e.target.value))}
  className="dropdown"
>
  <option value="" disabled>Select audio speed</option>
  {SPEED_OPTIONS.map((s) => (
    <option key={s.value} value={s.value}>
      {s.label}
    </option>
  ))}
  </select>


      <textarea
        className="textbox"
        placeholder="Type your sentence here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button className="btn" onClick={generateAudio}>
        Generate Audio
      </button>

      {audioUrl && (
  <div className="audio-section">
    <audio controls src={audioUrl} className="audio-player"></audio>

    <a href={audioUrl} download>
      <button className="download-btn">
        Download
      </button>
    </a>
  </div>
)}
    </div>
  );
}

export default App;
