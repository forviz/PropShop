import React from 'react';
import styled from 'styled-components';

const Color = require('color');

const bgColor = Color.rgb(209, 0, 24);
const hoverColor = bgColor.lighten(0.1);
const activeColor = bgColor.darken(0.15);
const bgColorStr = bgColor.string();


const ButtonPrimary = styled.button`
  background: ${bgColor};
  background: -moz-radial-gradient(center, ellipse cover, ${bgColorStr} 0%, rgba(225,0,26,1) 100%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, ${bgColorStr}), color-stop(100%, rgba(225,0,26,1)));
  background: -webkit-radial-gradient(center, ellipse cover, ${bgColorStr} 0%, rgba(225,0,26,1) 100%);
  background: -o-radial-gradient(center, ellipse cover, ${bgColorStr} 0%, rgba(225,0,26,1) 100%);
  background: -ms-radial-gradient(center, ellipse cover, ${bgColorStr} 0%, rgba(225,0,26,1) 100%);
  background: radial-gradient(ellipse at center, ${bgColorStr} 0%, rgba(225,0,26,1) 100%);
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#d10018', endColorstr='#e1001a', GradientType=1 );
  border: 1px solid #b40014;
  color: #ffffff;
  font-size: 16px;
  padding: 6px 24px;
  border-radius: 3px;
  cursor: pointer;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  -webkit-box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.25);
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.25);
  outline: none;

  &:hover {
    background: ${hoverColor.string()};
  }

  &:active {
    background: ${activeColor.string()};
  }
`;

export default ({ children }) => (
  <ButtonPrimary>{children}</ButtonPrimary>
);
