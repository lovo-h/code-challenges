import React from 'react';
import SEPTALogo from './assets/SEPTA.svg';
import { Dropdown, RadioButton, InputBox } from './components';

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
        <Dropdown
          options={ [
            { label: 'Zone 1', value: '1' },
            { label: 'Zone 2', value: '2' },
            { label: 'Zone 3', value: '3' },
          ] }
        />
        <div className="divider" />

        <div className="text-question">When are you riding?</div>
        <Dropdown
          options={ [
            { label: 'Weekdays', value: '1' },
            { label: 'Weekends & Evenings', value: '2' },
          ] }
        />
        <div className="text-helper">
          This is a long helper text in order to test how the text wrapping will work.
        </div>
        <div className="divider" />

        <div className="text-question">Where will you purchase the fare?</div>
        <div>
          <RadioButton
            label="Station Kiosk"
            name="purchaseLocation"
            value="advance_purchase"
          />
          <RadioButton
            label="Onboard"
            name="purchaseLocation"
            value="onboard_purchase"
          />
        </div>
        <div className="divider" />

        <div className="text-question">How many rides will you need?</div>
        <InputBox
          type="number"
          min="1"
          max="100"
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
