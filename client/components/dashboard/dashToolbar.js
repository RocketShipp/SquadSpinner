import React from 'react';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';

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

const Dashboard = (props) => {
  return (
    <Toolbar className="myToolbar">
      <ToolbarTitle
        float="center"
        className="toolbarTitle"
        text={props.componentTitle}
        style={styles.toolbarTitle}
      />
    </Toolbar>
  )
}

export default Dashboard;
