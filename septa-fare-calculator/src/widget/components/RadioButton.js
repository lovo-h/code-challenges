import React from 'react';

function RadioButton( { label, name, value, checked, onChange } ) {
  return (
    <div className="radio-button">
      <label>
        <input
          type="radio"
          name={ name }
          value={ value }
          checked={ checked }
          onChange={ onChange }
        />
        <span className="radio-button-label">
          { label }
        </span>
      </label>
    </div>
  );
}

export default RadioButton;
