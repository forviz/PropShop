import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { renderCategory } from './index';

const OptionLabel = styled.span`
  display: inline-block;
`;

const defaultRenderOption = option => (
  <div>
    {renderCategory(option.category)}
    <OptionLabel>{_.get(option, 'title.en')}</OptionLabel>
  </div>
);

class Option extends Component {

  static propTypes = {
    index: PropTypes.number,
    option: PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      disabled: PropTypes.bool,
    }),

    isFocus: PropTypes.bool,

    onFocus: PropTypes.func,
    onSelect: PropTypes.func,

    customRenderOption: PropTypes.func,
  }

  // Do focus option when mouse enter
  handleMouseEnter = (event) => {
    this.props.onFocus(this.props.index);
  }

  // MouseDown for mouse & TouchStart for touch devices
  // set dragging to false, back to normal.
  handleMouseDown = (e) => {
    this.dragging = false;
    this.pressing = true;
    this.pressY = e.screenY;
  }
  handleTouchStart = (e) => { this.handleMouseDown(e.touches[0]); }

  // MouseMove for mouse & TouchMove for touch devices
  // If start moving while pressing, set dragging = true;
  handleMouseMove = (e) => {
    if (this.pressing && Math.abs(this.pressY - e.screenY) > 40) {
      this.dragging = true;
    }
  }
  handleTouchMove = (e) => { this.handleMouseMove(e.touches[0]); }

  // MouseUp for mouse & TouchEnd for touch devices
  // If mouseUp/TouchEnd if user was draggin then not fire handleSelectOption;
  handleMouseUp = (e) => {
    this.pressing = false;
    if (this.dragging) return;

    // TODO: Not sure why, but this prevent double selectOption from touch devices
    e.preventDefault();
    e.stopPropagation();

    this.handleSelectOption(e);
  }
  handleTouchEnd = (e) => {
    this.handleMouseUp(e);
  }

  handleSelectOption = (e) => {
    this.props.onSelect(this.props.option);
  }

  optionRender = () => {
    return this.props.customRenderOption || defaultRenderOption;
  }

  render() {
    const { option } = this.props;

    const optionRenderer = this.optionRender();

    return (
      <div
        role="option"
        onMouseEnter={this.handleMouseEnter}
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
        onMouseMove={this.handleMouseMove}
        onTouchMove={this.handleTouchMove}
        onMouseUp={this.handleMouseUp}
        onTouchEnd={this.handleTouchEnd}
      >{optionRenderer(option)}</div>
    );
  }
}

export default Option;
