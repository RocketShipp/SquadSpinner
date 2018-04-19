import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/raisedButton';
import {Container, Row, Col} from 'react-grid-system';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
const colors = require('material-ui/styles/colors');
import './stylesheets/mySquads.scss';
import $ from 'jquery';

class MySquads extends Component {

  constructor() {
    super();

    this.state = {
      lobbiesJoined: {},
      lobbiesOwned: {}
    }
  }

  componentWillMount() {
    // Updates Component Title in the navbar
    this.props.updateComponentTitle('My Squads');
    // Sets authorization header
    axios.defaults.headers.common['authorization'] = this.props.userToken;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  componentDidMount() {
    this.setUser();
  }

  handleClick(action, id) {
    switch (action) {
      case 'JOIN':
        window.location = `/#/squad/${id}`;
        break;
      case 'DELETE':
        axios.delete(`/api/deleteLobby/${id}`).then(res => {
          // This filters the deleted lobby from the returned user object
          const foundUser = res.data.user;
          const lobbiesOwnedMap = foundUser.lobbiesOwned.map(mappedLobby => String(mappedLobby._id));
          const indexOfOwnedLobby = lobbiesOwnedMap.indexOf(id);
          const lobbyExists = indexOfOwnedLobby >= 0;
          if (lobbyExists) {
            foundUser.lobbiesOwned.splice(indexOfOwnedLobby, 1);
            this.setState({lobbiesOwned: foundUser.lobbiesOwned});
            this.props.setSuccessText(res.data.message);
          } else {
            this.props.setErrorText('Error deleting that lobby.')
          }
        })
        break;
      case 'LEAVE':
        axios.post(`/api/leaveLobby/${id}`).then(res => {
          const {lobbiesJoined, lobbiesOwned} = res.data.user;
          if (res.data.success) {
            this.setState({ lobbiesJoined, lobbiesOwned});
            this.props.setSuccessText(res.data.message);
          } else {
            this.props.setErrorText('Error leaving lobby.')
          }
        })
        break;
    }
  }

  setUser() {
    axios.post('/api/getUser/').then(res => {
      if (res.data.success) {
        this.setState({lobbiesJoined: res.data.user.lobbiesJoined, lobbiesOwned: res.data.user.lobbiesOwned})
      } else {
        this.props.setErrorText('Error fetching your profile data.');
      }
    })
  }

  renderOwnedLobbies() {
    let ownedLobbiesArray = [];
    // Create an array for each child of the owned lobbies card
    if (this.state.lobbiesOwned.length > 0) {
      this.state.lobbiesOwned.map(lobby => {
        ownedLobbiesArray.push(
          <Card
            key={lobby._id}
            className="squadCard"
            style={{ backgroundColor: colors.grey800 }}
          >
            <CardHeader
              title={lobby.lobbyName}
              className="squadTitle"
              actAsExpander={true}
              showExpandableButton={false}
            />
            <CardActions expandable={true} className="cardActions">
              <RaisedButton
                backgroundColor={colors.green500}
                label="Join"
                onClick={() => this.handleClick('JOIN', lobby.shortId)}
              />
              <RaisedButton
                backgroundColor={colors.red900}
                label="Delete"
                onClick={() => this.handleClick('DELETE', lobby._id)}
              />
            </CardActions>
          </Card>
        )
      })
      // Return card with children
      return (
        <Card className="topLevelCard">
          <CardHeader
            title="Owned"
            className="topCardHeader"
            children={ownedLobbiesArray}
          />
        </Card>
      )
    }
  }

  renderJoinedLobbies() {
    let joinedLobbiesArray = [];
    // Create an array for each child of the owned lobbies card
    if (this.state.lobbiesJoined.length > 0) {
      this.state.lobbiesJoined.map(lobby => {
        joinedLobbiesArray.push(
          <Card
            key={lobby._id}
            className="squadCard"
            style={{ backgroundColor: colors.grey800 }}
          >
            <CardHeader
              title={lobby.lobbyName}
              className="squadTitle"
              actAsExpander={true}
              showExpandableButton={false}
            />
            <CardActions expandable={true} className="cardActions">
              <RaisedButton
                backgroundColor={colors.green500}
                label="Join"
                onClick={() => this.handleClick('JOIN', lobby.shortId)}
              />
              <RaisedButton
                backgroundColor={colors.red900}
                label="Leave"
                onClick={() => this.handleClick('LEAVE', lobby.shortId)}
              />
            </CardActions>
          </Card>
        )
      })
      // Return card with children
      return (
        <Card className="topLevelCard">
          <CardHeader
            title="Joined"
            className="topCardHeader"
            children={joinedLobbiesArray}
          />
        </Card>
      )
    }
  }

  renderNoLobbies() {
    if (this.state.lobbiesOwned.length === 0 && this.state.lobbiesJoined.length === 0) {
      let message = `You aren't in any squads!`
      return (
        <Card className="topLevelCard">
          <CardHeader
            title={message}
            className="topCardHeader"
          />
          <CardActions className="cardActions">
            <RaisedButton
              secondary={true}
              label="Create A Squad"
              onClick={(event) => window.location = `/#/createsquad`}
            />
            <RaisedButton
              secondary={true}
              label="Join A Squad"
              onClick={(event) => window.location = `/#/joinsquad`}
            />
          </CardActions>
        </Card>
      )
    }
  }

  render(props) {
    return (
      <span>
        <Toolbar className="myToolbar">
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
        <Container fluid={true}
          className="mySquadsContainer"
          style={{ height: (this.props.clientWindow.height) }}>
          <Row className="mySquadsRow">
            <Col
              xs={12} md={8} lg={6}
              offset={{md: 2, lg:3}}
            >
              {this.renderOwnedLobbies()}
              {this.renderJoinedLobbies()}
              {this.renderNoLobbies()}
            </Col>
          </Row>
        </Container>
      </span>
    )
  }

}

export default MySquads;
