import React from 'react';
import { createRoot } from 'react-dom/client';
import Widget from './widget';
import './index.css';

const root = createRoot( document.getElementById( 'root' ) );
root.render( <Widget /> );
