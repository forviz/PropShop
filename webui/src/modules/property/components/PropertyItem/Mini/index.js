import React, { Component } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import numeral from 'numeral';
import FontAwesome from 'react-fontawesome';

const PropertyRow = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  height: 100px;
  margin-bottom: 15px;
  background: white;
  padding: 10px;
  margin-left: 5px;
  margin-right: 5px;

  border: 1px solid #ccc;
  border-radius: 4px;
`;

const CoverImgWrapper = styled.div`
  display: flex;
  flex-grow: 0;
  width: 100px;
`;

const CoverImg = styled.div`
  width: 100%;
  height: auto;
  background: url(${props => props.image});
  background-size: cover;
  background-position: center;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding-left: 15px;
`;

const PropertyTitle = styled.h3`
  font-size: 12px;
  font-weight: bold;
`;

const PriceWrapper = styled.div`
  color: #76ac31;
  font-size: 14px;
  font-weight: bold;
`;

class Mini extends Component {

  static propTypes = {
    // mainImage: T.string,
    // price: T.number,
    // bedroom: T.number,
    // bathroom: T.number,
    item: T.shape().isRequired,
  }

  render() {
    const { item } = this.props;
    return (
      <PropertyRow>
        <CoverImgWrapper>
          <CoverImg image={`${item.mainImage.file.url}?h=100&fit=fill`} />
        </CoverImgWrapper>
        <ContentWrapper>
          <PropertyTitle>{item.project || item.topic}</PropertyTitle>
          <PriceWrapper>{numeral(item.price).format('0,0')}</PriceWrapper>
          <div className="address">{item.address} {item.street} {item.amphur} {item.distict} {item.province} {item.zipcode}</div>
          <ul>
            {item.bedroom > 0 &&
              <li style={{ display: 'inline-block' }}><FontAwesome name="bed" /> <span>{item.bedroom}</span></li>
            }
            {item.bathroom > 0 &&
              <li style={{ display: 'inline-block', marginLeft: 20 }}><FontAwesome name="bath" /> <span>{item.bathroom}</span></li>
            }
          </ul>
        </ContentWrapper>
      </PropertyRow>
    );
  }
}

export default Mini;
