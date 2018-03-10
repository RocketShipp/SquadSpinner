import React from 'react';
import {Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {SSLogo} from '../../resources';


const DefaultView = (props) => {
  return (
    <Col
      xs={12} lg={10}
      offset={{lg:1}}
      className="viewCol"
      style={{
        textAlign: 'center',
        maxHeight: props.clientHeight - props.toolbarHeight,
        overflowY: 'scroll'
      }}
    >
      <p className="defaultViewSlogan">The Party Playlister</p>
      <Col
        className="logoContainer"
        xs={8} md={6} xl={4} offset={{xs:2, md:3, xl:4}}
      >
        {SSLogo}
      </Col>
      <span id="defaultButtons">
        <div>
          <RaisedButton
            className="welcomeButton"
            label="Log In"
            labelStyle={{fontWeight: 'bold'}}
            secondary={true}
            onClick={() => {
              props.setView('LOG_IN');
            }}
          />
          <RaisedButton
            className="welcomeButton"
            label="Sign Up"
            labelStyle={{color: 'white', fontWeight: 'bold'}}
            primary={true}
            onClick={() => {
              props.setView('SIGN_UP');
            }}
          />
        </div>
        <RaisedButton
          className="whatsThisButton"
          label="What is this?"
          onClick={() => {
            props.setView('ABOUT');
          }}
        />
      </span>
    </Col>
  )
}

export default DefaultView;
