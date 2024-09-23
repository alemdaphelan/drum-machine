import { useEffect } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import './App.css'
const dataSound = [
  {
    name:"heater-1",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3",
    keyCode:81,
    keyTrigger:"Q"
  },
  {
    name:"heater-2",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3",
    keyCode:87,
    keyTrigger:"W"
  },
  {
    name:"heater-3",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3",
    keyCode:69,
    keyTrigger:"E"
  },
  {
    name:"heater-4",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3",
    keyCode:65,
    keyTrigger:"A"
  },
  {
    name:"clap",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3",
    keyCode:83,
    keyTrigger:"S"
  },
  {
    name:"Open-HH",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3",
    keyCode:68,
    keyTrigger:"D"
  },
  {
    name:"Kick-n-Hats",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3",
    keyCode:90,
    keyTrigger:"Z"
  },
  {
    name:"Kick",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3",
    keyCode:88,
    keyTrigger:"X"
  },
  {
    name:"Close-HH",
    url:"https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3",
    keyCode:67,
    keyTrigger:"C"
  }
];
function App() {
  const [isChecked, setIsChecked] = useState(false);
  const [index, setIndex] = useState(0);
  const [volume, setVolume] = useState(1);

  const handleChecked = () => {
    setIsChecked(!isChecked);
  };

  const handleIndex = (keyCode) => {
    const playingIndex = dataSound.findIndex(item => item.keyCode === keyCode);
    if (playingIndex !== -1) {
      setIndex(playingIndex);
    }
  };

  return (
    <div id="drum-machine">
      <PlayButtonContainer
        handleIndex={handleIndex}
        data={dataSound}
        isChecked={isChecked}
        volume={volume}
      />
      <ControlButtonContainer
        data={dataSound}
        isChecked={isChecked}
        handleChecked={handleChecked}
        index={index}
        volume={volume}
        setVolume={setVolume}
      />
    </div>
  );
}

const PlayButtonContainer = (props) => {
  const [isActive, setIsActive] = useState(null);

  const playSound = useCallback((keyTrigger, keyCode) => {
    const audio = document.getElementById(keyTrigger);
    if (audio && props.isChecked) {
      props.handleIndex(keyCode);
      audio.currentTime = 0;
      audio.volume = props.volume;
      audio.play();
    }
  }, [props]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const pad = props.data.find(item => item.keyTrigger === key);
      if (pad) {
        playSound(pad.keyTrigger, pad.keyCode);
        setIsActive(pad.keyTrigger);
        console.log(`Key pressed: ${key}`);
      }
    };

    const handleKeyUp = () => {
      setIsActive(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playSound, props.data]);

  return (
    <div className="display">
      {props.data && props.data.map(({ name, url, keyCode, keyTrigger }, index) => (
        <button
          className={isActive === keyTrigger ? "drum-pad active" : "drum-pad"}
          id={name}
          key={index}
          onClick={() => playSound(keyTrigger, keyCode)}
        >
          {keyTrigger}
          <audio 
            id={keyTrigger} 
            src={url} 
            preload='auto' 
            onLoadedData={() => console.log(`${keyTrigger} loaded`)}
          ></audio>
        </button>
      ))}
    </div>
  );
};


const ControlButtonContainer = (props) => {
  const [currentVolume, setCurrentVolume] = useState('');

  const handleVolume = (e) => {
    const newVolume = e.target.value;
    props.setVolume(newVolume);
    setCurrentVolume(newVolume * 100);

    props.data.forEach(({ keyTrigger }) => {
      const audio = document.getElementById(keyTrigger);
      if (audio) {
        audio.volume = newVolume;
      }
    });

    setTimeout(() => {
      setCurrentVolume('');
    }, 1000);
  };

  return (
    <div className="control-container">
      <div className="power-container">
        <p className="power-name">power</p>
        <label className="switch">
          <input
            className="power-button"
            type="checkbox"
            checked={props.isChecked}
            onChange={props.handleChecked}
          />
          <span className="slider"></span>
        </label>
      </div>
      <div className="sound-name">
        {props.isChecked && (currentVolume ? `Volume: ${currentVolume}` : props.data[props.index].name)}
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={props.volume}
        onChange={handleVolume}
      />
    </div>
  );
};

export default App
