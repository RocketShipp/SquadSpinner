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
      />
    </Toolbar>
  )
}



export default WelcomeToolbar;
