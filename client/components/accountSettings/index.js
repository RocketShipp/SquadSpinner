import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {Container, Row, Col} from 'react-grid-system';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/raisedButton';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';
import './stylesheets/AccountSettings.scss';

class AccountSettings extends Component {

  constructor() {
    super();

    this.state = {
      userName: ''
    }
  }

  componentWillMount() {
    // Updates Component Title in the navbar
    this.props.updateComponentTitle('Account');
    // Sets authorization header
    axios.defaults.headers.common['authorization'] = this.props.userToken;
    axios.defaults.headers.put['Content-Type'] = 'application/json';
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;

    this.setState(() => ({
      [name]: value
    }));
  }

  handleSubmit() {
    const userName = this.state.userName.trim();
    if (!userName) {
      return this.props.setErrorText('You must provide a userName.');
    } else {
      axios.put('/api/editUser', {userName}).then(res => {
        if (res.data.success) {
          this.props.updateUserToken(res.data.token);
          this.props.setSuccessText(res.data.message);
        }
      })
    }

  }

  render(props) {
    return (
      <span>
        <Toolbar className="accountToolbar">
          <IconButton
            className="menuIcon"
          >
            <Link to="/"><i className="material-icons">arrow_back</i></Link>
          </IconButton>
          <ToolbarTitle
            float="center"
            className="toolbarTitle"
            text={this.props.componentTitle}
          />
        </Toolbar>
        <Container
          fluid={true}
          className="accountSettingsContainer"
          style={{ height: this.props.clientWindow.height - 56 }}
        >
          <Row className="accountSettingsRow">
            <Col
              xs={12} md={8} lg={6}
              offset={{md: 2, lg:3}}
              className="accountSettingsCol"
            >
              <Card className="accountCard">
                <span>
                  <TextField
                    name="userName"
                    floatingLabelText="Change Username"
                    fullWidth={true}
                    onChange={(event) => this.handleChange(event)}
                    value={this.state.userName}
                    maxLength={12}
                  />
                  <RaisedButton
                    label="Submit"
                    secondary={true}
                    onClick={() => this.handleSubmit()}
                  />
                </span>
              </Card>
              <RaisedButton
                className="logOutButton"
                label="Log Out"
                backgroundColor={colors.red900}
                onClick={() => this.props.removeUserToken()}
              />
            </Col>
          </Row>
        </Container>
      </span>
    )
  }

}

export default AccountSettings;
