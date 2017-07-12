import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

class RealEstateItem extends Component {

  render() {
    const { type, item } = this.props;

    if (!item) return (<div />);

    const background = {
      background: `url(${item.mainImage})`,
      backgroundSize: 'cover',
    };

    if (type === 'detail') {
      return (
        <div className="RealEstateItem detail">
          <div className="row">
            <div className="col-md-3">
              <div className="image">
                <img src={item.mainImage} alt={item.project} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="address">{item.street} - {item.province}</div>
              {(item.bedroom > 0 || item.bathroom > 0) &&
                <div className="option">
                  <ul>
                    {item.bedroom > 0 &&
                      <li><FontAwesome name="bed" /><span>{item.bedroom}</span></li>
                    }
                    {item.bathroom > 0 &&
                      <li><FontAwesome name="bath" /><span>{item.bathroom}</span></li>
                    }
                  </ul>
                </div>
              }
              <div style={{ marginTop: '15px' }}>
                {item.soldOut === 1 &&
                  <span className="for sold_out">ขายแล้ว</span>
                }
                {item.soldOut === 0 && item.type === 'sell' &&
                  <span className="for sell">สำหรับขาย</span>
                }
                {item.soldOut === 0 && item.type === 'rent' &&
                  <span className="for rent">สำหรับเช่า</span>
                }
              </div>
            </div>
            <div className="col-md-3">
              <div className="price">{numeral(item.price).format('0,0')} บาท</div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="RealEstateItem sell">
        <NavLink exact to={`/realestate/${item.id}`}>
          <div className="background" style={background}>
            <div className="gradient"></div>
            <div className="content">
              <div className="price">{numeral(item.price).format('0,0')} บาท</div>
              <div className="place">{item.street} - {item.province}</div>
              {(item.bedroom > 0 || item.bathroom > 0) &&
                <div className="option">
                  <ul>
                    {item.bedroom > 0 &&
                      <li><FontAwesome name="bed" /><span>{item.bedroom}</span></li>
                    }
                    {item.bathroom > 0 &&
                      <li><FontAwesome name="bath" /><span>{item.bathroom}</span></li>
                    }
                  </ul>
                </div>
              }
            </div>
          </div>
        </NavLink>
      </div>
    );
  }
}

export default RealEstateItem;
