import React, { Component } from 'react';
import T from 'prop-types';
import FontAwesome from 'react-fontawesome';

class DisplayType extends Component {

  static propTypes = {
    active: T.string.isRequired,
    onChange: T.func.isRequired,
  }

  static defaultProps = {
    active: 'thumbnail', // list, thumbnail
  }

  handleDisplayType = (displayType) => {
    this.props.onChange(displayType);
  }

  render() {
    const { active } = this.props;
    return (
      <div className="DisplayType">
        <ul>
          <li className={active === 'thumbnail' ? 'active' : ''}>
            <FontAwesome name="th-large" onClick={() => this.handleDisplayType('thumbnail')} />
          </li>
          <li className={active === 'list' ? 'active' : ''}>
            <FontAwesome name="th-list" onClick={() => this.handleDisplayType('list')} />
          </li>
        </ul>
      </div>
    );
  }
}

export default DisplayType;
