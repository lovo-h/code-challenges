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

function RadioSelect( { label, options, name, value, onChange  } ) {

  return (
    <>
      <div className="text-question">{ label }</div>
      <div>
        {
          options.map( ( option ) => (
            <RadioButton
              key={ option.value }
              label={ option.label }
              name={ name }
              value={ option.value }
              checked={ value === option.value }
              onChange={ ( e ) => onChange( e ) }
            />
          ) )
        }
      </div>
    </>
  );
}

export default RadioSelect;
