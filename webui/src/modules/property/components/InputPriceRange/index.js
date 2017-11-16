import React, { Component } from 'react';
import { Icon, Select } from 'antd';
import numeral from 'numeral';
import _ from 'lodash';

const Option = Select.Option;

class InputPriceRange extends Component {

  static defaultProps = {
    priceList: [500000, 1000000, 1500000, 2000000, 2500000,
      3000000, 3500000, 4000000, 4500000, 5000000,
      5500000, 6000000, 6500000, 7000000, 7500000,
      8000000, 8500000, 9000000, 9500000, 10000000,
      11000000, 12000000, 13000000, 14000000,
      15000000, 20000000, 50000000],
    value: {
      min: '',
      max: '',
    },
  }

  state = {
    expand: false,
  }

  /* Detect click Outside */
  componentDidMount() {
    document.addEventListener('mousedown', this._handleDetectClickOutside);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.priceList && nextProps.priceList)) {
      // if pricelist change, clear value
      // this.props.onChange('priceMin', undefined);
      // this.props.onChange('priceMax', undefined);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleDetectClickOutside);
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

  _handleDetectClickOutside = (e) => {
    if (this.component.contains(e.target)) return;

    // onClick Outside
    this.hideExpandPrice();
  }

  hideExpandPrice = () => {
    if (this.state.expand) {
      this.setState({
        expand: false,
      });
    }
  }

  handleExpandPrice = () => {
    this.setState({
      expand: !this.state.expand,
    });
  }

  handlePriceMin = (value) => {
    if (_.isNumber(_.get(this.props, 'value.max')) && _.isNumber(_.toNumber(value))) this.setState({ expand: false });
    this.props.onChange('priceMin', value);
  }

  handlePriceMax = (value) => {
    if (_.isNumber(_.get(this.props, 'value.min')) && _.isNumber(_.toNumber(value))) this.setState({ expand: false });
    this.props.onChange('priceMax', value);
  }

  render() {
    const { expand } = this.state;
    const { value } = this.props;
    const active = (value.min === parseInt(value.min, 10) && value.min) || (value.max === parseInt(value.max, 10) && value.max) ? 'active' : '';
    const priceMinActive = value.min === parseInt(value.min, 10) && value.min ? 'active' : '';
    const priceMaxActive = value.max === parseInt(value.max, 10) && value.max ? 'active' : '';
    return (
      <div className="SelectPrice" ref={c => this.component = c}>
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
            <div id="price-min" className={`price-min vcenter ${priceMinActive}`}>
              <Select
                placeholder="ขั้นต่ำ"
                value={value.min}
                onChange={this.handlePriceMin}
                getPopupContainer={() => document.getElementById('price-min')}
              >
                {this.getPrices('min')}
              </Select>
            </div>
            <div className="to vcenter">-</div>
            <div id="price-max" className={`price-max vcenter ${priceMaxActive}`}>
              <Select
                placeholder="ไม่เกิน"
                value={value.max}
                onChange={this.handlePriceMax}
                getPopupContainer={() => document.getElementById('price-max')}
              >
                {this.getPrices('max')}
              </Select>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default InputPriceRange;
