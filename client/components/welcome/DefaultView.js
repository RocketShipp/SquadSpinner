import React, {Component} from 'react';
import {Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {SSLogo} from '../../resources';


class DefaultView extends Component {

  render() {
    return (
      <Col
        xs={12} sm={10} lg={8}
        offset={{lg:2, sm:1}}
        className="viewCol"
        style={{
          textAlign: 'center',
          maxHeight: this.props.clientHeight - this.props.toolbarHeight,
          overflowY: 'scroll'
        }}
      >
        <p className="defaultViewSlogan">The Party Playlister</p>
        <Col
          className="logoContainer"
          xs={8} md={10} xl={6} offset={{xs:2, md:1, xl:3}}
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
                this.props.setView('LOG_IN');
              }}
            />
            <RaisedButton
              className="welcomeButton"
              label="Sign Up"
              labelStyle={{color: 'white', fontWeight: 'bold'}}
              primary={true}
              onClick={() => {
                this.props.setView('SIGN_UP');
              }}
            />
          </div>
          <RaisedButton
            className="whatsThisButton"
            label="What is this?"
            onClick={() => {
              this.props.setView('ABOUT');
            }}
          />
        </span>
      </Col>
    )
  }
}

export default DefaultView;
