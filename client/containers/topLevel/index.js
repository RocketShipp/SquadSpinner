import React, {Component} from 'react';
import {HashRouter, Switch, Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';
import Snackbar from 'material-ui/Snackbar';
import Welcome from '../../components/welcome';
import SquadLobby from '../../components/squadLobby';
import ErrorPage from './errorPage';
import Dashboard from '../../components/dashboard';
import CreateSquad from '../../components/createSquad';
import JoinSquad from '../../components/joinSquad';
import MySquads from '../../components/mySquads';
import AccountSettings from '../../components/accountSettings';
import {
  setClientWindow,
  updateUserToken,
  getUserToken,
  removeUserToken,
  setErrorText,
  clearErrorText,
  setSuccessText,
  clearSuccessText,
  updateComponentTitle
} from '../../actions';

class App extends Component {

  componentWillMount() {
    this.props.getUserToken();
  }

  renderAlert() {
    let alertText = this.props.successText || this.props.errorText;
    if (alertText) {
      return (
        <Snackbar
          autoHideDuration={4000}
          bodyStyle={{
            backgroundColor: this.props.successText ? colors.green800 : colors.red900,
            textAlign: 'center'
          }}
          contentStyle={{
            color: 'white',
            fontWeight: 'bold'
          }}
          open={alertText ? true : false}
          message={alertText}
          onRequestClose={this.props.successText ? this.props.clearSuccessText : this.props.clearErrorText}
        />
      )
    }
  }

  renderWelcome() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/"
            render={() =>
              <Welcome
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                setErrorText={this.props.setErrorText}
                setSuccessText={this.props.setSuccessText}
                updateUserToken={this.props.updateUserToken}
                getUserToken={this.props.getUserToken}
                userToken={this.props.userToken}
                clientWindow={this.props.clientWindow}
              />
            }
          />
          <Route component={ErrorPage} />
        </Switch>
      </HashRouter>
    )
  }

  renderApp() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/"
            render={() =>
              <Dashboard
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
              />
            }
          />
          <Route exact path="/createsquad"
            render={() =>
              <CreateSquad
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
                setErrorText={this.props.setErrorText}
                setSuccessText={this.props.setSuccessText}
                userToken={this.props.userToken}
              />
            }
          />
          <Route exact path="/joinsquad"
            render={() =>
              <JoinSquad
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
                setErrorText={this.props.setErrorText}
                userToken={this.props.userToken}
              />
            }
          />
          <Route exact path="/mysquads"
            render={() =>
              <MySquads
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
                setErrorText={this.props.setErrorText}
                setSuccessText={this.props.setSuccessText}
                userToken={this.props.userToken}
              />
            }
          />
          <Route exact path="/account"
            render={() =>
              <AccountSettings
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
                setErrorText={this.props.setErrorText}
                setSuccessText={this.props.setSuccessText}
                userToken={this.props.userToken}
                removeUserToken={this.props.removeUserToken}
                updateUserToken={this.props.updateUserToken}
              />
            }
          />
          <Route path={"/squad/:shortId"}
            render={() =>
              <SquadLobby
                componentTitle={this.props.componentTitle}
                updateComponentTitle={this.props.updateComponentTitle}
                clientWindow={this.props.clientWindow}
                setErrorText={this.props.setErrorText}
                setSuccessText={this.props.setSuccessText}
                userToken={this.props.userToken}
              />
            }
          />
          <Route path={"*"} component={ErrorPage} />
        </Switch>
      </HashRouter>
    )
  }

  render() {

    // Material UI Dark Theme Overhaul
    darkBaseTheme.palette.primary1Color = colors.grey600;
    darkBaseTheme.palette.accent1Color = colors.grey100;
    darkBaseTheme.palette.accent2Color = colors.grey900;

    // Handle resizing of the window
    $(window).resize(() => {
      // Make sure browser doesn't fire multiple times resulting in resize lag
      clearTimeout($.data(this, 'resizeTimer'));
      $.data(this, 'resizeTimer', setTimeout(() => { this.props.setClientWindow() }, 200));
    });

    return (
      <span>
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)} >
          <span>
            {this.renderAlert()}
            {this.props.userToken ? this.renderApp() : this.renderWelcome() }
          </span>
        </MuiThemeProvider>
      </span>

    )
  }
}

function mapStateToProps(state) {
  return {
    clientWindow: state.clientWindow,
    userToken: state.userToken,
    errorText: state.errorText,
    successText: state.successText,
    componentTitle: state.componentTitle
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setClientWindow,
    updateUserToken,
    getUserToken,
    setErrorText,
    clearErrorText,
    setSuccessText,
    clearSuccessText,
    updateComponentTitle,
    removeUserToken
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
