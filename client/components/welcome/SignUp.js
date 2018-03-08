import React, {Component} from 'react';
import {Row, Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

class SignUp extends Component {

  constructor() {
    super();

    this.state = {
      userName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  }

  passCredentialsUp(event) {
    event.preventDefault();
    this.props.handleSignUp(this.state);
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState(() => ({
      [name]: value
    }));
  }

  render(props) {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg:3}}
        className="viewCol"
        style={{
          textAlign: 'center',
          maxHeight: this.props.clientHeight - this.props.toolbarHeight,
          overflowY: 'scroll'
        }}
      >
        <Card
          className="welcomeCard"
        >
          <CardTitle
            title="Sign Up"
            style={{
              padding: 'none'
            }}
          />
          <form onSubmit={(event) => this.passCredentialsUp(event)}>
            <TextField
              name="userName"
              className="welcomeInput"
              floatingLabelText="UserName"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.userName}
            />
            <TextField
              name="email"
              className="welcomeInput"
              floatingLabelText="E-mail"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.email}
            />
            <TextField
              name="password"
              type="password"
              className="welcomeInput"
              floatingLabelText="Password"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.password}
            />
            <TextField
              name="confirmPassword"
              type="password"
              className="welcomeInput"
              floatingLabelText="Confirm Password"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.confirmPassword}
            />
            <RaisedButton
              className="welcomeButton"
              type="submit"
              label="Submit"
              labelStyle={{fontWeight: 'bold'}}
              secondary={true}
            />
            <RaisedButton
              className="welcomeButton"
              label="Go Back"
              labelStyle={{color: 'white', fontWeight: 'bold'}}
              primary={true}
              onClick={(event) => this.props.setView(null)}
            />
          </form>
        </Card>
      </Col>
    )
  }
}

export default SignUp;
