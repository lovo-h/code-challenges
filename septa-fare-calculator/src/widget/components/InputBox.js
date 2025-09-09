import React from 'react';

function InputBox( { id, label, value, onChange, type = 'text', placeholder = '', ...rest } ) {
  return (
    <>
      <label htmlFor={ id } className="text-question">{ label }</label>
      <div className="input-box">
        <input
          id={ id }
          type={ type }
          value={ value || '' }
          onChange={ onChange }
          placeholder={ placeholder }
          { ...rest }
        />
      </div>
    </>
  );
}

export default InputBox;
