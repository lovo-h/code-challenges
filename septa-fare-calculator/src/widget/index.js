import React, { useEffect, useMemo, useRef, useState } from 'react';
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
        const remainderCount = rideCount % 10;
        const remainderTotalPrice = fare.price * remainderCount;
        const totalPrice = bulkTotalPrice + remainderTotalPrice;

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
              remainder: {
                count: remainderCount,
                pricePerRide: fare.price,
                total: remainderTotalPrice,
              },
              savings: {
                total: ( ( bulkCount * 10 * fare.price ) + ( remainderCount * fare.price ) - totalPrice )
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
      <div className="layout-top-bar">
        <img className="logo" src={ SEPTALogo } alt="SEPTA Logo" />
        <div>Regional Rail Fares</div>
      </div>

      <div className="layout-content">
        <div className="text-question">Where are you going?</div>
        <Dropdown
          options={ zoneOptions }
          value={ inputs.destinationZone }
          onChange={ ( e ) => handleZoneChange( parseInt( e.target.value ) ) }
        />
        <div className="divider" />

        <div className="text-question">When are you riding?</div>
        <Dropdown
          options={ dayTypeOptions }
          value={ inputs.dayType }
          onChange={ ( e ) => handleInputsChange( 'dayType', e.target.value ) }
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
                onChange={ ( e ) => handleInputsChange( 'purchaseLocation', e.target.value ) }
              />
            ) )
          }
        </div>
        <div className="divider" />

        <div className="text-question">How many rides will you need?</div>
        <InputBox
          value={ inputs.rideCount }
          onChange={ ( e ) => handleInputsChange( 'rideCount', Math.max( 1, Math.min( 99, parseInt( e.target.value ) ) ) ) }
          type="number"
          min="1"
          max="99"
        />
      </div>

      <div className="layout-bottom-bar">
        <div>Your fare will cost</div>
        <div className="text-total-cost">
          { result ? `$${ result.totalPrice.toFixed( 2 ) }` : '$0.00' }
        </div>
        { result.breakdown && (
          <div className="total-breakdown">
            <div className="breakdown-title">
              Fare Breakdown
            </div>
            { result.breakdown.bulk && (
              <div className="breakdown-item">
                { result.breakdown.bulk.count } x 10-ticket anytime @
                ${ ( result.breakdown.bulk.pricePerRide ).toFixed( 2 ) } each =
                ${ ( result.breakdown.bulk.total ).toFixed( 2 ) }
              </div>
            ) }
            { result.breakdown.remainder && result.breakdown.remainder.count > 0 && (
              <div className="breakdown-item">
                { result.breakdown.remainder.count } x single tickets @
                ${ ( result.breakdown.remainder.pricePerRide ).toFixed( 2 ) } each =
                ${ ( result.breakdown.remainder.total ).toFixed( 2 ) }
              </div>
            ) }
            <div className="breakdown-item">
              You saved ${ result.breakdown.savings.total.toFixed( 2 ) } with bulk pricing!
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}

export default Widget;
