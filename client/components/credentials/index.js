import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import CredentialsToolbar from './CredentialsToolbar';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';
import {SSLogo, aboutText} from '../../resources';
import './stylesheets/credentials.scss';

class Credentials extends Component {

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


  getToolbarHeight(height) {
    this.setState({toolbarHeight: height});
  }

  defaultView() {
    return (
      <Col
        xs={12} sm={10} lg={8}
        offset={{lg:2, sm:1}}
        className="viewCol"
        style={{
          textAlign: 'center',
          maxHeight: this.state.clientHeight - this.state.toolbarHeight,
          overflowY: 'scroll'
        }}>
        <div>
        <p className="defaultViewSlogan">The Party Playlister</p>
        </div>
        <Col
          className="logoContainer"
          xs={8} md={10} xl={6} offset={{xs:2, md:1, xl:3}}
        >
          {SSLogo}
        </Col>
        <div>
          <RaisedButton
            className="credButton"
            label="Log In"
            labelStyle={{fontWeight: 'bold'}}
            secondary={true}
            onClick={() => {
              this.setState({ activeView: 'LOG_IN' });
            }}
          />
          <RaisedButton
            className="credButton"
            label="Sign Up"
            labelStyle={{color: 'white', fontWeight: 'bold'}}
            primary={true}
            onClick={() => {
              this.setState({ activeView: 'SIGN_UP' });
            }}
          />
        </div>
        <RaisedButton
          className="whatsThisButton"
          label="What is this?"
          onClick={() => {
            this.setState({ activeView: 'ABOUT' });
          }}
        />
      </Col>
    )
  }

  signUpView() {
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
          className="credentialsCard"
        >
          <CardTitle
            title="Sign Up"
            style={{
              padding: 'none'
            }}
          />
          <form onSubmit={(event) => event.preventDefault()}>
            <TextField
              className="credentialsInput"
              floatingLabelText="Username"
              fullWidth={true}
            />
            <TextField
              className="credentialsInput"
              floatingLabelText="E-mail"
              fullWidth={true}
            />
            <TextField
              className="credentialsInput"
              floatingLabelText="Password"
              fullWidth={true}
            />
            <RaisedButton
              className="credButton"
              label="Submit"
              labelStyle={{fontWeight: 'bold'}}
              secondary={true}
            />
            <RaisedButton
              className="credButton"
              label="Go Back"
              labelStyle={{color: 'white', fontWeight: 'bold'}}
              primary={true}
              onClick={(event) => this.setState({activeView: null})}
            />
          </form>
        </Card>
      </Col>
    )
  }

  logInView() {
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
          className="credentialsCard"
        >
          <CardTitle
            title="Log In"
            style={{
              padding: 'none'
            }}
          />
          <form onSubmit={(event) => event.preventDefault()}>
            <TextField
              className="credentialsInput"
              floatingLabelText="Username"
              fullWidth={true}
            />
            <TextField
              className="credentialsInput"
              floatingLabelText="E-mail"
              fullWidth={true}
            />
            <TextField
              className="credentialsInput"
              floatingLabelText="Password"
              fullWidth={true}
            />
            <TextField
              className="credentialsInput"
              floatingLabelText="Confirm Password"
              fullWidth={true}
            />
            <RaisedButton
              className="credButton"
              label="Submit"
              labelStyle={{fontWeight: 'bold'}}
              secondary={true}
            />
            <RaisedButton
              className="credButton"
              label="Go Back"
              labelStyle={{color: 'white', fontWeight: 'bold'}}
              primary={true}
              onClick={(event) => this.setState({activeView: null})}
            />
          </form>
        </Card>
      </Col>
    )
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
          className="credentialsCard"
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
        return this.defaultView();
        break;
      case 'SIGN_UP':
        return this.signUpView();
        break;
      case 'LOG_IN':
        return this.logInView();
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
        <CredentialsToolbar
          getToolbarHeight={this.getToolbarHeight.bind(this)}
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

export default Credentials;
