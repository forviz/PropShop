import React, { Component } from 'react';
import { Icon, Select } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';

const Option = Select.Option;

class SelectPrice extends Component {

  static defaultProps = {
    priceList: [500000, 1000000, 1500000, 2000000, 2500000,
      3000000, 3500000, 4000000, 4500000, 5000000,
      5500000, 6000000, 6500000, 7000000, 7500000,
      8000000, 8500000, 9000000, 9500000, 10000000,
      11000000, 12000000, 13000000, 14000000,
      15000000, 20000000, 50000000],
    value: {},
  }

  state = {
    expand: false,
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.expand === true) {
      const { value } = nextProps;
      if ((value.min === parseInt(value.min, 10) && value.min) && (value.max === parseInt(value.max, 10) && value.max)) {
        this.setState({
          expand: false,
        });
      }
    }
  }

  getPrices = (operation) => {
    const { priceList, value } = this.props;
    return _.map(priceList, (price, index) => {
      let disabled = false;
      if (operation === 'min') {
        if (value.max === parseInt(value.max, 10) && value.max) {
          if (price >= value.max) {
            disabled = true;
          }
        }
      } else if (operation === 'max') {
        if (value.min === parseInt(value.min, 10) && value.min) {
          if (price <= value.min) {
            disabled = true;
          }
        }
      }
      return <Option key={index} disabled={disabled} value={price.toString()}>{numeral(price).format('0,0')} ฿</Option>;
    });
  }

  handleExpandPrice = () => {
    this.setState({
      expand: !this.state.expand,
    });
  }

  handlePriceMin = (value) => {
    this.props.onChange('priceMin', value);
  }

  handlePriceMax = (value) => {
    this.props.onChange('priceMax', value);
  }

  render() {
    const { expand } = this.state;
    const { value } = this.props;
    const active = (value.min === parseInt(value.min, 10) && value.min) || (value.max === parseInt(value.max, 10) && value.max) ? 'active' : '';
    const priceMinActive = value.min === parseInt(value.min, 10) && value.min ? 'active' : '';
    const priceMaxActive = value.max === parseInt(value.max, 10) && value.max ? 'active' : '';
    return (
      <div className="SelectPrice">
        <div role="button" tabIndex="0" className={`ant-select-selection--single ${active}`} onClick={this.handleExpandPrice}>
          <div className="clearfix">
            <div className="pull-left">
              <span className="text">
                {active ? (
                  <span>
                    {((priceMinActive && !priceMaxActive) || (value.min === value.max)) &&
                      <span>เริ่มต้น </span>
                    }
                    {!priceMinActive && priceMaxActive &&
                      <span>ไม่เกิน </span>
                    }
                    {priceMinActive &&
                      <span>{numeral(value.min).format('0,0')}</span>
                    }
                    {((priceMinActive && priceMaxActive) && (value.max !== value.min)) &&
                      <span style={{ margin: '0 2px' }}>-</span>
                    }
                    {(priceMaxActive) && (value.max !== value.min) &&
                      <span>{numeral(value.max).format('0,0')}</span>
                    }
                    <span> ฿</span>
                  </span>
                ) : (
                  <span>ราคาประมาณ</span>
                )}
              </span>
            </div>
            <div className="pull-right">
              <span className="icon"><Icon type="down" /></span>
            </div>
          </div>
        </div>
        {expand &&
          <div className="price-lenght-block clearfix">
            <div className={`price-min vcenter ${priceMinActive}`}>
              <Select placeholder="ขั้นต่ำ" value={value.min} onChange={this.handlePriceMin}>
                {this.getPrices('min')}
              </Select>
            </div>
            <div className="to vcenter">-</div>
            <div className={`price-max vcenter ${priceMaxActive}`}>
              <Select placeholder="ไม่เกิน" value={value.max} onChange={this.handlePriceMax}>
                {this.getPrices('max')}
              </Select>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SelectPrice;
