import React from 'react';

function RadioSelect( { label, options, name, value, onChange } ) {

  return (
    <fieldset className="radio-select">
      <legend className="text-question">{ label }</legend>
      <div>
        {
          options.map( ( option ) => (
            <div key={ option.value } className="radio-button">
              <input
                id={ option.value }
                type="radio"
                name={ name }
                value={ option.value }
                checked={ value === option.value }
                onChange={ onChange }
              />
              {/* TODO: Use different value for id and htmlFor if needed. */}
              <label htmlFor={ option.value } className="radio-button-label">
                { option.label }
              </label>
            </div>
          ) )
        }
      </div>
    </fieldset>
  );
}

export default RadioSelect;
