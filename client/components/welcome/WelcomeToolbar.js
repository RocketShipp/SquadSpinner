import React from 'react';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import $ from 'jquery';

const WelcomeToolbar = (props) => {
  return (
    <Toolbar
      className="welcomeToolbar"
    >
      <ToolbarTitle
        className="toolbarTitle"
        text={props.componentTitle}
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



export default WelcomeToolbar;
