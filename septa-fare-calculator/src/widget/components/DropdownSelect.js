import React, { useEffect, useRef } from 'react';
import { dayTypeLabelLookup } from '../utils/common';

function DropDownSelect( { label, options, value, helperText, onChange } ) {
  const spanRef = useRef();
  const [ width, setWidth ] = React.useState( 'auto' );
  useEffect( () => {
    if ( ! spanRef.current ) {
      return;
    }

    setWidth( spanRef.current.offsetWidth + 100 );
  }, [ value ] );

  // Return early if no options.
  if ( ! options || options.length === 0 ) {
    return null;
  }


  const spanStyle = {
    // TODO: fontSize should not be hardcoded but derived from CSS.
    fontSize: '1.6rem',
    position: 'absolute',
    visibility: 'hidden',
    whiteSpace: 'nowrap',
    font: 'inherit'
  };

  return (
    <>
      <div className="text-question">{ label }</div>
      <select className="dropdown" style={ { width } } value={ value } onChange={ onChange }>
        { options.map( ( option ) => (
          <option key={ option.value } value={ option.value }>
            { option.label }
          </option>
        ) ) }
      </select>
      { helperText && <div className="text-helper">{ helperText }</div> }
      <span ref={ spanRef } style={ spanStyle }>
        { dayTypeLabelLookup[ value ] || value }
      </span>
    </>
  );
}

export default DropDownSelect;
