import React from 'react';
import IconButton from 'material-ui/IconButton';
import {Link} from 'react-router-dom';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import './stylesheets/squadToolbar.scss';

const SquadToolbar = (props) => {
    return (
      <Toolbar
        className="squadToolbar"
      >
        <Link to={'/'}>
        <IconButton
          className="menuIcon"
        >
          <i className="material-icons">home</i>
        </IconButton>
        </Link>
        <ToolbarTitle
          float="center"
          className="toolbarTitle"
          text={props.squadName}
        />
        <IconButton
          className="menuIcon"
          onClick={props.drawerToggle}
        >
          <i className="material-icons">menu</i>
        </IconButton>
      </Toolbar>
    )
  }

export default SquadToolbar;
