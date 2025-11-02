import React, { useState } from 'react';
import ColorPicker from './components/ColorPicker';
import './App.css';

function App() {
  const [color, setColor] = useState('#667eea');

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">
            <span className="gradient-text">Color</span> Picker
          </h1>
          <p className="app-subtitle">Choose your perfect color with style</p>
        </header>
        
        <ColorPicker 
          color={color} 
          onColorChange={handleColorChange} 
        />
      </div>
    </div>
  );
}

export default App;
