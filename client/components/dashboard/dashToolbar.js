import React from 'react';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';

const Dashboard = (props) => {
  return (
    <Toolbar className="dashToolbar">
      <ToolbarTitle
        float="center"
        className="toolbarTitle"
        text={props.componentTitle}
      />
    </Toolbar>
  )
}

export default Dashboard;
