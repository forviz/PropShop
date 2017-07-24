import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';

import RealEstateItem from '../../components/RealEstateItem';

class LandingPage extends Component {

  render() {
    const { banner } = this.props;

    return (
      <div className="result">
        {Object.keys(banner.condo).length > 0 &&
          <div className="list clearfix">
            <h3>คอนโด</h3>
            <ul>
              {
                _.map(banner.condo, (row, index) => {
                  const rowMD = 12 / Object.keys(row).length;
                  return (
                    <li key={index}>
                      <ul>
                        {
                          _.map(row, (item, index2) => {
                            return (
                              <li key={index2} className={`item col-sm-${rowMD} col-md-6 col-lg-${rowMD}`}>
                                <RealEstateItem item={item} type="sell" />
                              </li>
                            );
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        }
        {Object.keys(banner.house).length > 0 &&
          <div className="list clearfix">
            <h3>บ้าน</h3>
            <ul>
              {
                _.map(banner.house, (row, index) => {
                  const rowMD = 12 / Object.keys(row).length;
                  return (
                    <li key={index}>
                      <ul>
                        {
                          _.map(row, (item, index2) => {
                            return (
                              <li key={index2} className={`item col-sm-${rowMD} col-md-6 col-lg-${rowMD}`}>
                                <RealEstateItem item={item} type="sell" />
                              </li>
                            );
                          })
                        }
                      </ul>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        }
      </div>
    );
  }
}

export default LandingPage;
