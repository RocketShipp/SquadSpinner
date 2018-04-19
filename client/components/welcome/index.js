import React, {Component} from 'react';
import axios from 'axios';
import {Container, Row} from 'react-grid-system';
import WelcomeToolbar from './WelcomeToolbar';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';
import DefaultView from './DefaultView';
import SignUpView from './SignUp';
import LogInView from './LogIn';
import AboutView from './About';
import './stylesheets/welcome.scss';

class Welcome extends Component {

  // activeView is what determines whether the Sign Up screen is shown, or the Log In screen is shown
  // By default it is null, therefore showing the initial welcome screen
  constructor(props){
    super(props);
    this.state = {
      activeView: null
    }
  }

  componentDidMount() {
    this.props.updateComponentTitle('SquadSpinner');
  }

  setView(view) {
    this.setState({activeView: view});
  }

  handleSignUp(credentials) {
    const { userName, email, password, confirmPassword} = credentials;
    const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    switch(true) {
      case (!userName.trim() || !email.trim() || !password.trim()):
        this.props.setErrorText('You must fill each field');
        break;
      case (password.trim() !== confirmPassword.trim()):
        this.props.setErrorText('Passwords must match');
        break;
      case (!email.trim().match(emailFormat)):
        this.props.setErrorText('Invalid email address');
        break;
      case ((userName.trim().length < 5) || (userName.trim().length > 15)):
        this.props.setErrorText('Your username must be between 5 and 15 characters');
        break;
      case ((password.trim().length < 5) || (password.trim().length > 15)):
        this.props.setErrorText('Your password must be between 5 and 15 characters');
        break;
      default:
        axios.post('/api/signup', {userName, email, password})
          .then(res => {
            if (res.data.success) {
              this.props.updateUserToken(res.data.token);
              this.props.setSuccessText('Successfully signed up!')
            } else {
              this.props.setErrorText(res.data.message);
            }
          })
          .catch(err => {
            if (err.message) return this.props.setErrorText(err.message);
          })
        break;
    }
  }

  handleLogin(credentials) {
    switch(true) {
      case (!credentials.email.trim() || !credentials.password.trim()):
        this.props.setErrorText('You must fill each field');
        break;
      default:
        axios.post('/api/login', credentials)
          .then(res => {
            if (res.data.success) {
              this.props.updateUserToken(res.data.token);
              this.props.setSuccessText('Successfully logged in!')
            } else {
              this.props.setErrorText(res.data.message);
            }
          })
          .catch(err => {
            this.props.setErrorText(res.message)
          })
        break;
    }
  }

  renderActiveView() {
    switch(this.state.activeView) {
      case null:
        return (
          <DefaultView
            clientHeight={this.props.clientWindow.height}
            setView={this.setView.bind(this)}
          />
        );
        break;
      case 'SIGN_UP':
        return (
          <SignUpView
            clientHeight={this.props.clientWindow.height}
            setView={this.setView.bind(this)}
            handleSignUp={this.handleSignUp.bind(this)}
          />
        );
        break;
      case 'LOG_IN':
        return (
          <LogInView
            clientHeight={this.props.clientWindow.height}
            setView={this.setView.bind(this)}
            handleLogin={this.handleLogin.bind(this)}
          />
        );
        break;
      case 'ABOUT':
        return (
          <AboutView
            clientHeight={this.props.clientWindow.height}
            setView={this.setView.bind(this)}
          />
        )
        break;
    }
  }

  render(props) {
    return (
      <span>
        <WelcomeToolbar
          componentTitle={this.props.componentTitle}
        />
        <Container
          className="welcomeInner"
          fluid={true}
        >
          <Row className="welcomeInnerRow" style={{height: this.props.clientWindow.height}}>
            {this.renderActiveView()}
          </Row>
        </Container>
      </span>
    )
  }
}

export default Welcome;
