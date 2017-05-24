import React, { Component } from 'react';
import { Button } from 'antd';

class ButtonBuyRent extends Component {

  handleClick = (type) => {
    this.props.onSelect(type);
  }

  render() {
    const { type } = this.props;
    return (
      <div className="ButtonBuyRent">
        <Button.Group>
          <Button type={type === 'buy' ? 'primary' : 'default'} onClick={e => this.handleClick('buy')}>ซื้อ</Button>
          <Button type={type === 'rent' ? 'primary' : 'default'} onClick={e => this.handleClick('rent')}>เช่า</Button>
        </Button.Group>
      </div>
    );
  }
}

export default ButtonBuyRent;