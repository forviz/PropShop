import React, { Component } from 'react';
import T from 'prop-types';
import _ from 'lodash';
import { Row, Col, Icon } from 'antd';
import styled from 'styled-components';

import filterOptions from './utils/filterOptions';

import Option from './Option';

const InputAreaSearchWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const CategoryLegend = styled.div`
  position: absolute;
  top: 7px;
  left: 12px;
`;

const InputArea = styled.input`
  padding: 7px 16px;
  padding-left: ${props => (props.hasCategory ? '50px' : '16px')};
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 100%;
`;

const SuggestionWrapper = styled.div`
  position: absolute;
  top:40px;
  left: 0;
  right: 0;
  max-height: 400px;
  z-index: 3;
  overflow: scroll;
`;

const SuggestionList = styled.ul`
  padding-left: 0;
  list-style: none;
  background: white;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const SuggestionItem = styled.li`
  border-bottom: 1px solid #ececec;
  cursor: pointer;

  > div {
    padding: 6px 12px;
    background-color: ${props => (props.isFocus ? '#D6EAB9' : 'transparent')};
    color: ${props => (props.isFocus ? '#000' : '#333')};
  }
`;

const ListButton = styled.button`
  border: none;
  background: transparent;
  position: absolute;
  width: 37px;
  height: 37px;
  top: 0;
  right: 0;
  outline: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const AreaListWrapper = styled.div`
  position: absolute;
  top:40px;
  right: 0;
  width: 560px;
  max-height: 400px;
  z-index: 3;
  overflow: scroll;
  background: white;
  border: 1px solid #ccc;
`;

const AreaListContent = styled.div`
  padding: 15px;
`;

const AreaListHeader = styled.div`
  color: #88b840;
`;

const AreaListItem = styled.a`
  padding: 5px 0;
  font-size: 14px;
  color: #787878;
  display: block;
  &:hover {
    text-decoration: underline;
  }
`;

const OptionCategory = styled.span`
  color: #88b840;
  margin-right: 15px;
  display: inline-block;
  font-size: 0.8em;
  font-weight: bold;
`;

export const renderCategory = (category) => {
  switch (category) {
    case 'PROVINCE': return <OptionCategory>จังหวัด</OptionCategory>;
    case 'DISTRICT': return <OptionCategory>เขต</OptionCategory>;
    case 'SUBDISTRICT': return <OptionCategory>แขวง</OptionCategory>;
    case 'NEIGHBORHOOD': return <OptionCategory>ย่าน</OptionCategory>;
    default: return <OptionCategory>{category}</OptionCategory>;
  }
};


const getOptionLabel = option => _.get(option, 'label', '');

class InputAreaSearch extends Component {

  static propTypes = {
    value: T.shape({
      value: T.string,
      label: T.sring,
    }),
    options: T.arrayOf(T.shape({
      value: T.string,
      label: T.string,
    })),
    disabled: T.bool.isRequired,
    onChange: T.func,
  }
  static defaultProps = {
    value: {
      value: '',
      label: '',
    },
    disabled: false,
    options: [],
    onChange: (option) => { console.log(option); },
  }

  constructor(props) {
    super(props);
    this.state = {
      showSuggestion: false,
      showAreaList: false,
      searchValue: getOptionLabel(props.value),
      focusAtIndex: 0,
    };
  }

  componentWillReceiveProps = (nextProps) => {
    if (!_.isEqual(nextProps.value, this.props.value)) {
      this.setState({
        searchValue: getOptionLabel(nextProps.value),
      });
    }
  }

  /* Detect click Outside */
  componentDidMount() {
    document.addEventListener('mousedown', this._handleDetectClickOutside);
    window.addEventListener('load', this.handleChangeOptionPosition);
    window.addEventListener('scroll', this.handleChangeOptionPosition);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleDetectClickOutside);
    window.removeEventListener('scroll', this.handleChangeOptionPosition);
  }

  _handleDetectClickOutside = (e) => {
    if (this.component.contains(e.target)) return;
    this.hideSuggestion();
    this.hideAreaList();
  }
  /* End of Detect click Outside */


  showSuggestion = () => {
    this.setState({
      showSuggestion: true,
    });
  }

  hideSuggestion = () => {
    this.setState({
      showSuggestion: false,
    });
  }

  showAreaList = () => {
    this.setState({
      showAreaList: true,
    });
  }

  hideAreaList = () => {
    this.setState({
      showAreaList: false,
    });
  }

  handleMouseDown = (event) => {
    // if the event was triggered by a mousedown and not the primary
    // button, or if the component is disabled, ignore it.
    if (this.props.disabled || (event.type === 'mousedown' && event.button !== 0)) {
      return;
    }

    if (event.target.tagName === 'INPUT') {
      return;
    }

    // prevent default event handlers
    event.stopPropagation();
    event.preventDefault();

    if (!this.state.showSuggestion) this.showSuggestion();
    else {
      this.hideSuggestion();
      this.hideAreaList();
    }
  }


  handleSelectOption = (option) => {
    const { onChange } = this.props;
    this.setState({
      searchValue: option.label,
    });

    onChange(option);

    /* Close options */
    this.hideSuggestion();
    this.hideAreaList();
  }

  handleSelectOptionAtIndex = (index) => {
    const option = this.props.options[index];
    this.handleSelectOption(option);
  }

  focusAtOption = (toIndex) => {
    let _targetIndex;
    if (toIndex < 0) _targetIndex = 0;
    else if (toIndex > this.props.options.length - 1) _targetIndex = this.props.options.length - 1;
    else _targetIndex = toIndex;

    this.setState({
      focusAtIndex: _targetIndex,
    });
  }

  handleInputFocus = (e) => {
    // Select All Text
    this.searchInput.setSelectionRange(0, this.searchInput.value.length);

    // Open Suggestion
    this.showSuggestion();
  }

  handleSearchInputChange = (e) => {
    const searchValue = e.target.value;
    this.setState({
      searchValue,
    });

    if (searchValue !== '') {
      this.showSuggestion();
    }
  }

  render() {
    const { value, options } = this.props;
    const { searchValue, showSuggestion, showAreaList, focusAtIndex } = this.state;
    const suggestions = filterOptions(options, searchValue);

    // AreaList
    const btsAreas = _.filter(options, opt => opt.category === 'BTS');
    const btsCol1 = _.slice(btsAreas, 0, 10);
    const btsCol2 = _.slice(btsAreas, 10, 20);
    const btsCol3 = _.slice(btsAreas, 20, 30);

    const col2 = _.filter(options, opt => opt.category === 'SUBDISTRICT');

    const showCategory = !_.isEmpty(value.category) && !_.isEmpty(searchValue);
    return (
      <InputAreaSearchWrapper innerRef={c => this.component = c}>
        { showCategory && <CategoryLegend>{renderCategory(value.category)}</CategoryLegend>}
        <InputArea
          hasCategory={showCategory}
          value={searchValue}
          placeholder="ค้นหาทำเล"
          innerRef={c => this.searchInput = c}
          onFocus={this.handleInputFocus}
          onChange={this.handleSearchInputChange}
        />
        {
          showSuggestion &&
            <SuggestionWrapper>
              <SuggestionList>
                {_.map(suggestions, (area, index) =>
                  (<SuggestionItem
                    key={`option-${index}`}
                    isFocus={focusAtIndex === index}
                  >
                    <Option
                      option={area}
                      key={`option-${index}`}
                      index={index}
                      onFocus={this.focusAtOption}
                      onSelect={this.handleSelectOption}
                    />
                  </SuggestionItem>
                ))}
              </SuggestionList>
            </SuggestionWrapper>
        }
        <ListButton type="button" onClick={showAreaList ? this.hideAreaList : this.showAreaList}>
          <Icon type="bars" />
        </ListButton>
        {
          showAreaList &&
            <AreaListWrapper>
              <AreaListContent>
                <Row>
                  <Col span={16}>
                    <AreaListHeader>BTS</AreaListHeader>
                    <Row>
                      <Col span={8}>
                        {_.map(btsCol1, area => <AreaListItem onClick={() => this.handleSelectOption(area)}>{area.title.th}</AreaListItem>)}
                      </Col>
                      <Col span={8}>
                        {_.map(btsCol2, area => <AreaListItem onClick={() => this.handleSelectOption(area)}>{area.title.th}</AreaListItem>)}
                      </Col>
                      <Col span={8}>
                        {_.map(btsCol3, area => <AreaListItem onClick={() => this.handleSelectOption(area)}>{area.title.th}</AreaListItem>)}
                      </Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <AreaListHeader>แขวง</AreaListHeader>
                    {_.map(col2, area => <AreaListItem onClick={() => this.handleSelectOption(area)}>{area.title.th}</AreaListItem>)}
                  </Col>
                </Row>
              </AreaListContent>
            </AreaListWrapper>
        }
      </InputAreaSearchWrapper>
    );
  }
}

export default InputAreaSearch;
