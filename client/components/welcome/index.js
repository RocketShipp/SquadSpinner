import React, {Component} from 'react';
import axios from 'axios';
import {Container, Row, Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import WelcomeToolbar from './WelcomeToolbar';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';
import {aboutText} from '../../resources';
import DefaultView from './DefaultView';
import SignUpView from './SignUp';
import LogInView from './LogIn';
import './stylesheets/welcome.scss';

class Welcome extends Component {

  // activeView is what determines whether the Sign Up screen is shown, or the Log In screen is shown
  // By default it is null, therefore showing the initial welcome screen
  constructor(props){
    super(props);
    this.state = {
      toolbarHeight: null,
      clientHeight: null,
      activeView: null
    }
  }

  componentDidMount() {
    this.setState({clientHeight: $(window).height()})
    this.props.updateComponentTitle('SquadSpinner');
  }


  setToolbarHeight(height) {
    this.setState({toolbarHeight: height});
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
            } else {
              this.props.setErrorText(res.data.message);
            }
          })
          .catch(err => {
            console.log(err);
          })
        break;
    }


  }

  aboutView() {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg:3}}
        className="viewCol"
        style={{
          textAlign: 'center',
          maxHeight: this.state.clientHeight - this.state.toolbarHeight,
          overflowY: 'scroll'
        }}
      >
        <Card
          className="welcomeCard"
        >
          <CardTitle
            title="What is SquadSpinner?"
            style={{
              padding: 'none',
              fontWeight: 'bold'
            }}
          />
          <CardText className="aboutText">
            {aboutText}
          </CardText>
        </Card>
      </Col>
    )
  }

  renderActiveView() {
    switch(this.state.activeView) {
      case null:
        return (
          <DefaultView
            toolbarHeight={this.state.toolbarHeight}
            clientHeight={this.state.clientHeight}
            setView={this.setView.bind(this)}
          />
        );
        break;
      case 'SIGN_UP':
        return (
          <SignUpView
            toolbarHeight={this.state.toolbarHeight}
            clientHeight={this.state.clientHeight}
            setView={this.setView.bind(this)}
            handleSignUp={this.handleSignUp.bind(this)}
          />
        );
        break;
      case 'LOG_IN':
        return (
          <LogInView
            toolbarHeight={this.state.toolbarHeight}
            clientHeight={this.state.clientHeight}
            setView={this.setView.bind(this)}
            handleLogin={this.handleLogin.bind(this)}
          />
        );
        break;
      case 'ABOUT':
        return this.aboutView();
        break;
    }
  }


  render(props) {

    // Handle resizing of the window
    $(window).resize(() => {
      this.setState({clientHeight: $(window).height()})
    });

    return (
      <span>
        <WelcomeToolbar
          setToolbarHeight={this.setToolbarHeight.bind(this)}
          componentTitle={this.props.componentTitle}
        />
        <Container fluid={true} style={{
          height: (this.state.clientHeight - this.state.toolbarHeight),
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
          paddingLeft: 'none',
          paddingRight: 'none'
        }}>
          <Row style={{width: '100%'}}>
            {this.renderActiveView()}
          </Row>
        </Container>
      </span>
    )
  }
}

export default Welcome;
