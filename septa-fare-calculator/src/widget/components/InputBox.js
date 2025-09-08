import React from 'react';

function InputBox( { value, onChange, type = 'text', placeholder = '', ...rest } ) {
  return (
    <div className="input-box">
      <input
        type={ type }
        value={ value }
        onChange={ onChange }
        placeholder={ placeholder }
        { ...rest }
      />
    </div>
  );
}

export default InputBox;
