import React, { Component } from 'react';
import T from 'prop-types';
import { Icon, Dropdown, Menu } from 'antd';
import _ from 'lodash';

class Sort extends Component {

  static propTypes = {
    lists: T.array.isRequired,
    current: T.string.isRequired,
    onChange: T.func.isRequired,
  }

  static defaultProps = {
    current: 'newest',
    lists: [
      { label: 'ใหม่ล่าสุด', value: 'newest' },
      { label: 'ราคาน้อย - มาก', value: 'lowprice' },
      { label: 'ราคามาก - น้อย', value: 'heightprice' },
    ],
  }

  getList = () => {
    const { lists } = this.props;
    const menus = _.map(lists, (list) => {
      return (
        <Menu.Item key={list.value}>{list.label}</Menu.Item>
      );
    });
    const list = (
      <Menu onClick={this.handleSort}>
        {menus}
      </Menu>
    );
    return list;
  }

  getLabel = () => {
    const { lists, current } = this.props;
    return _.find(lists, ['value', current]).label;
  }

  handleSort = (params) => {
    this.props.onChange(params.key);
  }

  render() {
    return (
      <div className="Sort">
        <Dropdown overlay={this.getList()} trigger={['click']}>
          <a className="ant-dropdown-link">
            {this.getLabel()} <Icon type="down" />
          </a>
        </Dropdown>
      </div>
    );
  }
}

export default Sort;
