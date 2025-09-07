import React from 'react';
import SEPTALogo from './assets/SEPTA.svg';

import './widget.css';

function Widget() {
  return (
    <div id="widget">
      <div className="layout-top-bar">
        <img className="logo" src={ SEPTALogo } alt="SEPTA Logo" />
        <div>Regional Rail Fares</div>
      </div>

      <div className="layout-content">
        <div className="text-question">Where are you going?</div>
        <div>Dropdown: Zone 4</div>
        <div className="divider" />

        <div className="text-question">When are you riding?</div>
        <div>Dropdown: Weekdays</div>
        <div className="text-helper">
          This is a long helper text in order to test how the text wrapping will work.
        </div>
        <div className="divider" />

        <div className="text-question">Where will you purchase the fare?</div>
        <div>
          <div>Radio: Station Kiosk</div>
          <div>Radio: Onboard</div>
        </div>
        <div className="divider" />

        <div className="text-question">How many rides will you need?</div>
        <div>Input: 4</div>
      </div>

      <div className="layout-bottom-bar">
        <div>Your fare will cost</div>
        <div className="text-total-cost">$28.00</div>
      </div>
    </div>
  );
}

export default Widget;
