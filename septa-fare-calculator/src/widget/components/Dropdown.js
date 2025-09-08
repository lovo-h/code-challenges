import React from 'react';

function DropDown( { options, value, onChange } ) {
  // Return early if no options.
  if ( ! options || options.length === 0 ) {
    return null;
  }

  return (
    <select className="dropdown" value={ value } onChange={ onChange }>
      { options.map( ( option ) => (
        <option key={ option.value } value={ option.value }>
          { option.label }
        </option>
      ) ) }
    </select>
  );
}

export default DropDown;
