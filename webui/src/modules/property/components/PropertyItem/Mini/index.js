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

const CoverImg = styled.img`
  width: 100%;
  height: auto;
`;

const ContentWrapper = styled.div`
  flex-grow: 1;
  padding: 15px;
`;

const PropertyTitle = styled.h3`
  font-size: 22px;
`;

const PriceWrapper = styled.div`
  display: flex;
  flex-grow: 0;
  width: 200px;
  text-align: right;
`;

class Mini extends Component {

  static propTypes = {
    mainImage: T.string,
    price: T.number,
    bedroom: T.number,
    bathroom: T.number,
  }

  render() {
    const { mainImage, price, bedroom, bathroom } = this.props;
    return (
      <PropertyRow>
        <CoverImgWrapper>
          <CoverImg src={`${mainImage}?h=100&fit=fill`} alt="" />
        </CoverImgWrapper>
        <ContentWrapper>
          <PropertyTitle>{'title'}</PropertyTitle>
          <div>
            <FontAwesome name="bed" /><span>{bedroom}</span>
            <FontAwesome name="bath" /><span>{bathroom}</span>
          </div>
        </ContentWrapper>
        <PriceWrapper>{numeral(price).format('0,0')}</PriceWrapper>
      </PropertyRow>
    );
  }
}

export default Mini;
