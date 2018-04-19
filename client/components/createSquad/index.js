import React, {Component} from 'react';
import axios from 'axios';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import {Container, Row, Col} from 'react-grid-system';
import {Card} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/dropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/raisedButton';
const colors = require('material-ui/styles/colors');
import {Link} from 'react-router-dom';
import $ from 'jquery';
import './stylesheets/createSquad.scss';

class CreateSquad extends Component {
  constructor() {
    super();
    this.state = {
      squadName: '',
      voteToSkipEnabled: false,
      requiredVotesToSkip: 1,
      hideVideoPlayer: false
    }
  }

  componentWillMount() {
    // Updates Component Title in the navbar
    this.props.updateComponentTitle('Create Squad');
    // Sets authorization header
    axios.defaults.headers.common['authorization'] = this.props.userToken;
    axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;

    this.setState(() => ({
      [name]: value
    }));
  }

  renderrequiredVotesToSkip() {
    return (
      <div id="requiredVotesToSkip">
        <p>How many votes?</p>
        <p>{this.state.requiredVotesToSkip}</p>
        <DropDownMenu
          disabled={!this.state.voteToSkipEnabled}
          underlineStyle={{color: 'transparent'}}
          style={{marginTop: '-25px', marginRight: '-20px'}}
        >
          <MenuItem value={1} primaryText="1" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={2} primaryText="2" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={3} primaryText="3" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={4} primaryText="4" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={5} primaryText="5" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={6} primaryText="6" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={7} primaryText="7" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={8} primaryText="8" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={9} primaryText="9" onClick={(event) => this.handleDropDownItemClick(event)} />
          <MenuItem value={10} primaryText="10" onClick={(event) => this.handleDropDownItemClick(event)} />
        </DropDownMenu>
      </div>
    )
  }

  handleDropDownItemClick(event) {
    event.preventDefault();

    this.setState(() => ({
      requiredVotesToSkip: parseInt($(event.target).text())
    }))
  }

  handleSubmit(event) {
    event.preventDefault();

    const requestBody = {
      lobbyName: this.state.squadName.trim(),
      settings: {
        voteToSkip: {
          voteToSkipEnabled: this.state.voteToSkipEnabled,
          requiredVotesToSkip: this.state.requiredVotesToSkip
        },
        hideVideoPlayer: this.state.hideVideoPlayer
      }
    };

    if (this.state.squadName.trim().length < 3) {
      return this.props.setErrorText('Squad Name must be at least 3 characters')
    } else if (this.state.squadName.trim().length < 20) {
      axios.post('/api/createLobby', requestBody)
        .then(res => {
          if (res.data.success) {
            // Handle redirect
            window.location = `/#/squad/${res.data.shortId}`;
            this.props.setSuccessText(res.data.message);
          } else {
            this.props.setErrorText(res.data.message)
          }
        })
        .catch(err => {
          if (err.message) return this.props.setErrorText(err.message);
        })
    } else {
      this.props.setErrorText('Squad Name must be less than 20 characters')
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
          className="createSquadContainer"
          style={{ height: (this.props.clientWindow.height) }}>
          <Row className="createSquadRow">
            <Col
              xs={12} md={8} lg={6}
              offset={{md: 2, lg:3}}
            >
              <Card className="createSquadCard" style={{textAlign: 'left'}}>
                <TextField
                  id="squadName"
                  name="squadName"
                  floatingLabelText="Squad Name"
                  fullWidth={true}
                  onChange={(event) => this.handleChange(event)}
                  value={this.state.squadName}
                />
                <Toggle
                  className="hideVideoPlayer"
                  label="Hide video player?"
                  thumbSwitchedStyle={{backgroundColor: colors.blue900}}
                  trackSwitchedStyle={{backgroundColor: colors.grey500}}
                  toggled={this.state.hideVideoPlayer}
                  onToggle={ () => this.setState({hideVideoPlayer: !this.state.hideVideoPlayer}) }
                />
                <RaisedButton
                  className="createSquadButton"
                  label="Spin it up!"
                  labelStyle={{fontWeight: 'bold'}}
                  fullWidth={true}
                  backgroundColor={colors.green500}
                  onClick={(event) => this.handleSubmit(event)}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </span>
    )
  }

}

export default CreateSquad;
