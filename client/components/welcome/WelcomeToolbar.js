import React, {Component} from 'react';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import {connect} from 'react-redux';
import $ from 'jquery';

class WelcomeToolbar extends Component {

  componentDidMount(props) {
    this.props.setToolbarHeight( $('.welcomeToolbar').height() );
  }

  render() {
    // Handle resizing of the window
    $(window).resize(() => {
      this.props.setToolbarHeight( $('.welcomeToolbar').height() );
    });
    return (
      <Toolbar
        className="welcomeToolbar"
      >
        <ToolbarTitle
          className="toolbarTitle"
          text={this.props.componentTitle}
          style={{
            width: '100%',
            textAlign: 'center',
            paddingRight: '0',
            paddingLeft: '0'
          }}
        />
      </Toolbar>
    )
  }
}



export default WelcomeToolbar;
