import React, { useState, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ color, onColorChange }) => {
  const [hue, setHue] = useState(249);
  const [saturation, setSaturation] = useState(78);
  const [lightness, setLightness] = useState(73);
  const [hex, setHex] = useState('#667eea');
  const [rgb, setRgb] = useState({ r: 102, g: 126, b: 234 });
  const [copied, setCopied] = useState(false);

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  };

  // Convert RGB to HEX
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Convert HEX to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
        default: h = 0;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Update color when HSL changes
  useEffect(() => {
    const newRgb = hslToRgb(hue, saturation, lightness);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setRgb(newRgb);
    setHex(newHex);
    onColorChange(newHex);
  }, [hue, saturation, lightness, onColorChange]);

  // Handle HEX input
  const handleHexChange = (e) => {
    const value = e.target.value;
    if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
      setHex(value);
      if (value.length === 7) {
        const newRgb = hexToRgb(value);
        if (newRgb) {
          setRgb(newRgb);
          const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
          setHue(hsl.h);
          setSaturation(hsl.s);
          setLightness(hsl.l);
          onColorChange(value);
        }
      }
    }
  };

  // Handle RGB input
  const handleRgbChange = (component, value) => {
    const numValue = parseInt(value) || 0;
    const clampedValue = Math.min(255, Math.max(0, numValue));
    const newRgb = { ...rgb, [component]: clampedValue };
    setRgb(newRgb);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setHex(newHex);
    onColorChange(newHex);
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return (
    <div className="color-picker-container">
      <div className="color-picker-card">
        {/* Color Preview */}
        <div className="color-preview-section">
          <div 
            className="color-preview" 
            style={{ backgroundColor: currentColor }}
          >
            <div className="color-overlay">
              <div className="color-info">
                <div className="color-hex-display">{hex.toUpperCase()}</div>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(hex)}
                  title="Copy HEX"
                >
                  {copied ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="color-controls">
          {/* Hue Slider */}
          <div className="control-group">
            <label className="control-label">
              <span>Hue</span>
              <span className="control-value">{hue}°</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(parseInt(e.target.value))}
                className="slider hue-slider"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 100%, 50%),
                    hsl(60, 100%, 50%),
                    hsl(120, 100%, 50%),
                    hsl(180, 100%, 50%),
                    hsl(240, 100%, 50%),
                    hsl(300, 100%, 50%),
                    hsl(360, 100%, 50%))`
                }}
              />
            </div>
          </div>

          {/* Saturation Slider */}
          <div className="control-group">
            <label className="control-label">
              <span>Saturation</span>
              <span className="control-value">{saturation}%</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(parseInt(e.target.value))}
                className="slider saturation-slider"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, 0%, ${lightness}%),
                    hsl(${hue}, 100%, ${lightness}%))`
                }}
              />
            </div>
          </div>

          {/* Lightness Slider */}
          <div className="control-group">
            <label className="control-label">
              <span>Lightness</span>
              <span className="control-value">{lightness}%</span>
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(parseInt(e.target.value))}
                className="slider lightness-slider"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(${hue}, ${saturation}%, 0%),
                    hsl(${hue}, ${saturation}%, 50%),
                    hsl(${hue}, ${saturation}%, 100%))`
                }}
              />
            </div>
          </div>

          {/* Color Inputs */}
          <div className="color-inputs">
            <div className="input-group">
              <label>HEX</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={hex}
                  onChange={handleHexChange}
                  className="color-input"
                  placeholder="#000000"
                />
                <button 
                  className="input-copy-btn"
                  onClick={() => copyToClipboard(hex)}
                  title="Copy"
                >
                  📋
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>RGB</label>
              <div className="rgb-inputs">
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="color-input small"
                    placeholder="R"
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="color-input small"
                    placeholder="G"
                  />
                </div>
                <div className="input-wrapper">
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="color-input small"
                    placeholder="B"
                  />
                </div>
                <button 
                  className="input-copy-btn"
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  title="Copy RGB"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          {/* Preset Colors */}
          <div className="preset-colors">
            <label>Preset Colors</label>
            <div className="preset-grid">
              {[
                '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2',
                '#F1948A', '#52BE80', '#F39C12', '#8E44AD'
              ].map((presetColor) => (
                <button
                  key={presetColor}
                  className="preset-color-btn"
                  style={{ backgroundColor: presetColor }}
                  onClick={() => {
                    const newRgb = hexToRgb(presetColor);
                    if (newRgb) {
                      setRgb(newRgb);
                      setHex(presetColor);
                      const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
                      setHue(hsl.h);
                      setSaturation(hsl.s);
                      setLightness(hsl.l);
                      onColorChange(presetColor);
                    }
                  }}
                  title={presetColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
