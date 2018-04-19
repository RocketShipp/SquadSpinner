import React from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import './stylesheets/squadToolbar.scss';

const SquadToolbar = (props) => {
    return (
      <Toolbar
        className="squadToolbar"
      >
        <IconButton
          className="menuIcon"
          onClick={props.drawerToggle}
        >
          <i className="material-icons">menu</i>
        </IconButton>
        <ToolbarTitle
          float="center"
          className="toolbarTitle"
          text={props.squadName}
        />
      </Toolbar>
    )
  }

export default SquadToolbar;
