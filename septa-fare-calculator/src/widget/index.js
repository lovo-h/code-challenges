import React from 'react';

import './widget.css';

function Widget() {
  return (
    <div id="widget">
      <div>
        <div>Icon</div>
        <div>Regional Rail Fares</div>
      </div>

      <div>Where are you going?</div>
      <div>Dropdown: Zone 4</div>
      <div>Horizontal bar</div>

      <div>When are you riding?</div>
      <div>Dropdown: Weekdays</div>
      <div>Helper text</div>
      <div>Horizontal bar</div>

      <div>Where will you purchase the fare?</div>
      <div>
        <div>Radio: Station Kiosk</div>
        <div>Radio: Onboard</div>
      </div>
      <div>Horizontal bar</div>

      <div>How many rides will you need?</div>
      <div>Input: 4</div>

      <div>
        <div>Your fare will cost</div>
        <div>$28.00</div>
      </div>
    </div>
  );
}

export default Widget;
