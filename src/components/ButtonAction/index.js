import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import FontAwesome from 'react-fontawesome';

const ButtonWrapper = styled.div`
  background: #4d790a;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;

const ButtonIcon = styled(FontAwesome)`
  color: #ffffff;
  margin-right: 4px;
  font-size: 18;
  verticalAlign: middle;
`;

class ButtonAction extends Component {

  static propTypes = {
    font: T.string,
    text: T.string,
    onClick: T.func,
  }

  static defaultProps = {
    font: '',
    text: '',
    onClick: undefined,
  }

  handleOnClick = () => {
    this.props.onClick();
  }

  render() {
    const { font, text } = this.props;
    return (
      <ButtonWrapper className="ButtonAction" onClick={this.handleOnClick}>
        <ButtonIcon name={font} /> {text}
      </ButtonWrapper>
    );
  }
}

export default ButtonAction;
