import React, { useEffect, useRef, useState } from 'react';
import SEPTALogo from './assets/SEPTA.svg';
import { Dropdown, RadioButton, InputBox } from './components';
import FareService from './services/fares';
import { dayTypeLabelLookup, purchaseLabelLookup } from './utils/common';

import './widget.css';

function Widget() {
  let rawFareData = useRef( null );
  const [ zoneOptions, setZoneOptions ] = useState( [] );
  const [ dayTypeOptions, setDayTypeOptions ] = useState( [] );
  const [ purchaseLocationOptions, setPurchaseLocationOptions ] = useState( [] );
  const [ inputs, setInputs ] = useState( {
    destinationZone: null,
    dayType: null,
    purchaseLocation: null,
    rideCount: 1,
  } );

  function setInputsHelper( key, value ) {
    setInputs( prevInputs => ( {
      ...prevInputs,
      [ key ]: value,
    } ) );
  }

  function setZone( zoneValue ) {
    const zoneData = rawFareData.current.zones.find( z => z.zone === zoneValue );
    const fareData = zoneData ? zoneData.fares : [];
    const fareOptions = [
      ...new Set(
        fareData
          .filter( fare => fare.type !== 'anytime' )
          .map( fare => fare.type )
      ),
    ];
    const purchaseOptions = [
      ...new Set( fareData.map( fare => fare.purchase ) ),
    ];

    // Set zone options.
    setZoneOptions( rawFareData.current.zones.map( zone => ( {
      label: zone.name,
      value: zone.zone
    } ) ) );

    // Set day type options.
    setDayTypeOptions( fareOptions.map( option => ( {
      label: dayTypeLabelLookup[ option ] || option,
      value: option
    } ) ) );

    // Set purchase location options.
    setPurchaseLocationOptions( purchaseOptions.map( option => ( {
      label: purchaseLabelLookup[ option ] || option,
      value: option
    } ) ) );

    // Reset dependent inputs.
    setInputs( prevInputs => ( {
      ...prevInputs,
      destinationZone: zoneValue,
      dayType: fareOptions[ 0 ] || null,
      purchaseLocation: purchaseOptions[ 0 ] || null,
    } ) );
  }

  useEffect( () => {
    // Retrieve fare data from remote.
    FareService.getFares().then( fareData => {
      // Store raw fare data for this session.
      rawFareData.current = fareData;

      setZone( rawFareData.current.zones[ 0 ][ 'zone' ] );
    } );
  }, [] );

  return (
    <div id="widget">
      <div className="layout-top-bar">
        <img className="logo" src={ SEPTALogo } alt="SEPTA Logo" />
        <div>Regional Rail Fares</div>
      </div>

      <div className="layout-content">
        <div className="text-question">Where are you going?</div>
        <Dropdown
          options={ zoneOptions }
          value={ inputs.destinationZone }
          onChange={ ( e ) => setZone( parseInt( e.target.value ) ) }
        />
        <div className="divider" />

        <div className="text-question">When are you riding?</div>
        <Dropdown
          options={ dayTypeOptions }
          value={ inputs.dayType }
          onChange={ ( e ) => setInputsHelper( 'dayType', e.target.value ) }
        />
        <div className="text-helper">
          { rawFareData?.current?.info[ inputs.dayType ] }
        </div>
        <div className="divider" />

        <div className="text-question">Where will you purchase the fare?</div>
        <div>
          {
            purchaseLocationOptions.map( ( option ) => (
              <RadioButton
                key={ option.value }
                label={ option.label }
                name="purchaseLocation"
                value={ option.value }
                checked={ inputs.purchaseLocation === option.value }
                onChange={ ( e ) => setInputsHelper( 'purchaseLocation', e.target.value ) }
              />
            ) )
          }
        </div>
        <div className="divider" />

        <div className="text-question">How many rides will you need?</div>
        <InputBox
          value={ inputs.rideCount }
          onChange={ ( e ) => setInputsHelper( 'rideCount', Math.max( 1, Math.min( 99, parseInt( e.target.value ) || 1 ) ) ) }
          type="number"
          min="1"
          max="99"
        />
      </div>

      <div className="layout-bottom-bar">
        <div>Your fare will cost</div>
        <div className="text-total-cost">$28.00</div>
      </div>
    </div>
  );
}

export default Widget;
