import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

class ButtonAction extends Component {

	handleOnClick = () => {
		this.props.onClick();
	}

  render() {

  	const { font, text } = this.props;

  	const styleButton = {
  		background: '#4d790a',
	    color: '#ffffff',
	    padding: '8px 16px',
	    borderRadius: 4,
      cursor: 'pointer',
  	}

  	const styleIcon = {
  		color: '#ffffff',
	    marginRight: 4,
	    fontSize: 18,
	    verticalAlign: 'middle',
  	}

    return (
      <div className="ButtonAction" onClick={this.handleOnClick} style={styleButton} >
      	<FontAwesome name={font} style={styleIcon} /> {text}
      </div>
    );
  }
}

export default ButtonAction;