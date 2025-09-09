import React, { useEffect, useMemo, useRef, useState } from 'react';
import SEPTALogo from './assets/SEPTA.svg';
import { DropdownSelect, RadioSelect, InputBox } from './components';
import FareService from './services/fares';
import { dayTypeLabelLookup, purchaseLabelLookup } from './utils/common';

import './widget.css';


// Cost component.
function Cost( { result } ) {
  const fmt = useMemo( () => new Intl.NumberFormat( undefined, { style: 'currency', currency: 'USD' } ), [] );
  const money = ( val ) => fmt.format( val );
  const bulk = result?.breakdown?.bulk;
  const single = result?.breakdown?.single;
  const savings = result?.breakdown?.savings;

  return (
    <>
      <div>Your fare will cost</div>
      <div className="text-total-cost">
        { result ? `${ money( result.totalPrice ) }` : money( 0 ) }
      </div>
      { result.breakdown && (
        <div className="total-breakdown">
          <div className="breakdown-title">
            Fare Breakdown
          </div>
          { bulk && (
            <div className="breakdown-item">
              { bulk.count } x 10-ticket anytime @ { money( bulk.pricePerRide ) } each = { money( bulk.total ) }
            </div>
          ) }
          { single && single.count > 0 && (
            <div className="breakdown-item">
              { single.count } x single tickets @ { money( single.pricePerRide ) } each = { money( single.total ) }
            </div>
          ) }
          <div className="breakdown-item">
            You saved { money( savings.total ) } with bulk pricing!
          </div>
        </div>
      ) }
    </>
  );
}

// Main widget component.
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

  function handleInputsChange( key, value ) {
    setInputs( prevInputs => ( {
      ...prevInputs,
      [ key ]: value,
    } ) );
  }

  function handleZoneChange( zoneValue ) {
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

      handleZoneChange( rawFareData.current.zones[ 0 ][ 'zone' ] );
    } );
  }, [] );

  // Recalculate the result any time the inputs change.
  const result = useMemo( () => {
    // TODO: Need unit tests for this function's logic.
    const { destinationZone, dayType, purchaseLocation, rideCount } = inputs;
    // Validate inputs.
    if ( ! rawFareData.current || ! destinationZone || ! dayType || ! purchaseLocation || ! rideCount ) {
      return { totalPrice: 0 };
    }

    const zone = rawFareData.current.zones.find( zone => zone.zone === destinationZone );
    if ( ! zone ) {
      return { totalPrice: 0 };
    }

    const fare = zone.fares.find( fare =>
      fare.type === dayType && fare.purchase === purchaseLocation
    );
    if ( ! fare ) {
      return { totalPrice: 0 };
    }

    /*
    * TODO: This shouldn't be hardcoded.
    *    This logic assumes that if a bulk discount is available, it will be
    *    for 10 rides at a time. It also assumes that the bulk discount is
    *    only available for advance_purchase fares.
    * */
    if ( purchaseLocation === 'advance_purchase' && rideCount >= 10 ) {
      const bulkFare = zone.fares.find( fare =>
        fare.purchase === 'advance_purchase' && fare.trips === 10
      );

      // Ensure bulk fare exists before using it.
      if ( bulkFare ) {
        const bulkCount = Math.floor( rideCount / 10 );
        const bulkTotalPrice = bulkFare.price * bulkCount;
        const singleCount = rideCount % 10;
        const singleTotalPrice = fare.price * singleCount;
        const totalPrice = bulkTotalPrice + singleTotalPrice;

        const isBulkCheaper = totalPrice < fare.price * rideCount;
        if ( isBulkCheaper ) {
          return {
            totalPrice,
            breakdown: {
              bulk: {
                count: bulkCount,
                pricePerRide: bulkFare ? bulkFare.price : 0,
                total: bulkTotalPrice
              },
              single: {
                count: singleCount,
                pricePerRide: fare.price,
                total: singleTotalPrice,
              },
              savings: {
                total: ( ( bulkCount * 10 * fare.price ) + ( singleCount * fare.price ) - totalPrice )
              },
            }
          };
        }
      }
    }

    // Default return if no bulk discount applied.
    return {
      totalPrice: fare.price * rideCount
    };
  }, [ inputs ] );

  return (
    <div id="widget">
      <header className="layout-top-bar">
        <img className="logo" src={ SEPTALogo } alt="SEPTA Logo" />
        <h1>Regional Rail Fares</h1>
      </header>

      <main className="layout-content">
        <DropdownSelect
          id="destinationZone"
          label="Where are you going?"
          options={ zoneOptions }
          value={ inputs.destinationZone }
          onChange={ ( e ) => handleZoneChange( parseInt( e.target.value ) ) }
        />
        <div className="divider" />

        <DropdownSelect
          id="dayType"
          label="When are you riding?"
          helperText={ rawFareData?.current?.info[ inputs.dayType ] }
          options={ dayTypeOptions }
          value={ inputs.dayType }
          onChange={ ( e ) => handleInputsChange( 'dayType', e.target.value ) }
        />
        <div className="divider" />

        <RadioSelect
          label="Where will you purchase the fare?"
          options={ purchaseLocationOptions }
          name="purchaseLocation"
          value={ inputs.purchaseLocation }
          onChange={ ( e ) => handleInputsChange( 'purchaseLocation', e.target.value ) }
        />
        <div className="divider" />

        {/* TODO: Confirm whether there should be a max limit of 99. */}
        <InputBox
          id="rideCount"
          label="How many rides will you need?"
          value={ inputs.rideCount }
          onChange={ ( e ) => handleInputsChange( 'rideCount', Math.max( 1, Math.min( 99, parseInt( e.target.value ) ) ) ) }
          type="number"
          min="1"
          max="99"
        />
      </main>

      <footer className="layout-bottom-bar">
        <Cost result={ result } />
      </footer>
    </div>
  );
}

export default Widget;
