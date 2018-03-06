import React, {Component} from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const colors = require('material-ui/styles/colors');
import Snackbar from 'material-ui/Snackbar';
import Credentials from '../../components/credentials';
import SquadLobby from '../../components/squadLobby';
import ErrorPage from './errorPage';
import {updateUserToken, getUserToken, setErrorText, clearErrorText, updateComponentTitle} from '../../actions';

class App extends Component {

  componentWillMount() {
    this.props.getUserToken(localStorage.getItem('token') || null);
    console.log('Token: ' + this.props.userToken);
  }

  handleSignUp(credentials) {
      const { email, userName, password, confirmPassword} = credentials;
      if (!email.trim() || !userName.trim() || !password.trim() || password.trim() !== confirmPassword.trim()) {
        this.props.setErrorText('Please fill all fields and make sure the passwords match.')
      } else {
        axios.post('/api/signup', credentials)
          .then(resp => {
            const { token } = resp.data;
            localStorage.setItem('token', token);
            this.props.clearErrorText();
            this.props.updateUserToken(token);
          })
          .catch(err => console.log(err));
      }
    }

  renderErrorAlert() {
    return (
      (this.props.errorText) ?
        <Snackbar
          open={this.props.errorText ? true : false}
          message={this.props.errorText}
          autoHideDuration={5000}
          onRequestClose={this.props.clearErrorText}
        /> : null
    )
  }

  renderCredentials() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" render={() => <Credentials componentTitle={this.props.componentTitle} updateComponentTitle={this.props.updateComponentTitle} />} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    )
  }

  renderApp() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={SquadLobby} />
          <Route component={ErrorPage} />
        </Switch>
      </BrowserRouter>
    )
  }

  render() {

    // Material UI Dark Theme Overhaul
    darkBaseTheme.palette.primary1Color = colors.grey600;
    darkBaseTheme.palette.accent1Color = colors.grey100;
    darkBaseTheme.palette.accent2Color = colors.grey900;

    return (
      <span>
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
        <span>
          {this.renderErrorAlert()}
          {this.props.userToken ? this.renderApp() : this.renderCredentials() }
        </span>
      </MuiThemeProvider>
      </span>

    )
  }
}

function mapStateToProps(state) {
  return {
    userToken: state.userToken,
    errorText: state.errorText,
    componentTitle: state.componentTitle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    updateUserToken,
    getUserToken,
    setErrorText,
    clearErrorText,
    updateComponentTitle
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
