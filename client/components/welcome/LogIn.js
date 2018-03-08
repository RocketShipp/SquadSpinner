import React, {Component} from 'react';
import {Row, Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardTitle} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

class LogIn extends Component {

  constructor() {
    super();

    this.state = {
      email: '',
      password: ''
    }
  }

  passCredentialsUp(event) {
    event.preventDefault();
    this.props.handleLogin(this.state);
    this.setState({password: ''});
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
            title="Log In"
            style={{
              padding: 'none'
            }}
          />
          <form onSubmit={(event) => this.passCredentialsUp(event)}>
            <TextField
              className="welcomeInput"
              name="email"
              floatingLabelText="E-mail"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.email}
            />
            <TextField
              className="welcomeInput"
              name="password"
              floatingLabelText="Password"
              type="password"
              fullWidth={true}
              onChange={(event) => this.handleChange(event)}
              value={this.state.password}
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

export default LogIn;
