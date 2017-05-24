import React from 'react';
import ReactDOM from 'react-dom';
import Propshop from './Propshop';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Propshop />, div);
});
