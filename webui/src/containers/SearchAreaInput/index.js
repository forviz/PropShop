import React, { Component } from 'react';
import { Input, Icon, AutoComplete } from 'antd';
import styled from 'styled-components';
import { connect } from 'react-redux';

const { Option, OptGroup } = AutoComplete;

const PropertyDetail = styled.span`
  position: absolute;
  right: 16px;
  color: #88b840;
`;


const mapStateToProps = (state) => {
  return {
    old_dataSource: [
      {
        title: 'Province',
        children: [
          { title: 'Bangkok', location: '13.7248946,100.4930242,11z' },
        ]
      },
      {
        title: 'Neighborhood',
        children: [
          { title: 'ม.เกษตร', location: '13.8465276,100.5625376,14z' },
          { title: 'ซอยเสนานิคม 1', location: '13.8325384,100.5767017,15.92z' },
          { title: 'รัชโยธิน', location: '13.8264438,100.5640438,15.97z' },
          { title: 'หมอชิต', location: '13.8014124,100.5498388,16z' },
          { title: 'สะพานควาย', location: '13.7935809,100.5474953,17z' },
          { title: 'อารีย์', location: '13.7796185,100.5422168,17z' },
          { title: 'สนามเป้า', location: '13.7726578,100.5398886,17z' },
          { title: 'อนุสาวรีย์ชัยสมรภูมิ', location: '13.7650299,100.5336123,16z' },
          { title: 'พญาไท', location: '13.756464,100.5294924,16z' },
          { title: 'ราชเทวี', location: '13.751936,100.5273681,16z' },
          { title: 'Siam Square', location: '13.7454609,100.5324483,17z' },
          { title: 'ราชประสงค์', location: '13.7451888,100.5376444,16.58z' },
          { title: 'Chidlom', location: '13.7442377,100.542221,17z' },
          { title: 'Ploenchit', location: '13.7426217,100.5462458,17z' },
          { title: 'Nana', location: '13.7408443,100.5521043,17z' },
          { title: 'Asoke', location: '13.7357541,100.5566995,16z' },
          { title: 'พร้อมพงษ์', location: '13.7304631,100.5647048,16z' },
          { title: 'ทองหล่อ', location: '13.7243972,100.5746183,16z' },
          { title: 'เอกมัย', location: '13.7252116,100.5844235,16z' },
          { title: 'พระโขนง', location: '13.7153778,100.5890691,17z' },
          { title: 'อ่อนนุช', location: '13.7071486,100.5956689,16z' },
          { title: 'บางจาก', location: '13.6978405,100.6016278,16z' },
          { title: 'ปุณณวิถี', location: '13.688986,100.6078008,16.14z' },
          { title: 'อุดมสุข', location: '13.6801312,100.6076645,16z' },
          { title: 'บางนา', location: '13.6689142,100.5974721,15z' },
          { title: 'แบริ่ง', location: '13.6607722,100.5992746,16z' },
          { title: 'ราชดำริ', location: '13.739411,100.5356314,16z' },
          { title: 'สีลม', location: '13.7266423,100.5289839,16z' },
          { title: 'ช่องนนทรี', location: '13.7229698,100.5278257,17z' },
          { title: 'สุรศักดิ์', location: '13.7188902,100.5180897,16z/' },
          { title: 'สะพานตากสิน', location: '13.7184877,100.5103311,16z' },
          { title: 'วงเวียนใหญ่', location: '13.7211257,100.4914626,16z' },
          { title: 'โพธิ์นิมิตร', location: '13.718656,100.4831202,16z' },
          { title: 'ตลาดพลู', location: '13.7137164,100.4736102,16z' },
          { title: 'วุฒากาศ', location: '13.7127102,100.4656067,16z' },
          { title: 'บางหว้า', location: '13.7206527,100.4547245,16z' },
        ]
      },
    ],
  }
}

export default connect(mapStateToProps)(
  class SearchInput extends Component {

    handleSelect = (value, option) => {
      this.props.onSelect({ value, key: option.props.key, location: option.props.location });
      // this.props.onChange(value);
    }

    handleFilter = (inputValue, option) => {
      return option.props.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    }

    render() {
      const { value, placeholder, dataSource } = this.props;

      const options = dataSource.map(group => (
        <OptGroup
          key={group.title}
          label={group.title}
        >
          {group.children.map(opt => (
            <Option key={opt.key} value={opt.key} location={opt.location}>
              {opt.title}
              <PropertyDetail>{group.title}</PropertyDetail>
            </Option>
          ))}
        </OptGroup>
      ));

      return (
        <div className="certain-category-search-wrapper" style={{ width: '100%', height: 38 }}>
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            dropdownStyle={{ width: 300, padding: 10 }}
            size="large"
            style={{ width: '100%' }}
            value={value}
            dataSource={options}
            placeholder={placeholder}
            optionLabelProp="value"
            filterOption={this.handleFilter}
            onSelect={this.handleSelect}
          >
            <Input size="large" suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
        </div>
      );
    }
  },
);
