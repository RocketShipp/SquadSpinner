import React from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import './stylesheets/squadToolbar.scss';

const styles = {
  iconButton: {
    height: 'auto',
    width: 'auto'
  },
  toolbarTitle: {
    textAlign: 'center',
    width: '100%'
  }
}

const SquadToolbar = (props) => {
    return (
      <Toolbar className="myToolbar">
        <IconButton
          className="menuIcon"
          style={styles.iconButton}
          onClick={props.drawerToggle}
        >
          <i className="material-icons">menu</i>
        </IconButton>
        <ToolbarTitle
          float="center"
          className="toolbarTitle"
          text={props.squadName}
          style={styles.toolbarTitle}
        />
      </Toolbar>
    )
  }

export default SquadToolbar;
