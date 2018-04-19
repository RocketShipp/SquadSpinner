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
import './stylesheets/joinSquad.scss';

class JoinSquad extends Component {
  constructor() {
    super();
    this.state = {
      squadShortID: ''
    }
  }

  componentWillMount() {
    // Updates Component Title in the navbar
    this.props.updateComponentTitle('Join Squad');
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

  handleSubmit(event) {
    event.preventDefault();
    const {squadShortID} = this.state;
    // Check to see if the length matches shortId format
    if (squadShortID.trim().length < 7 || squadShortID.trim().length > 11) return this.props.setErrorText('Please re-check that ID.');
    axios.post(`/api/joinLobby/${squadShortID}`).then(res => {
      if (res.data.success) {
        // Handle redirect
        window.location = `/#/squad/${squadShortID}`;
      } else {
        this.props.setErrorText(res.data.message)
      }
    }).catch(err => {
      if (err.message) return this.props.setErrorText(err.message);
    })
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
          className="joinSquadContainer"
          style={{ height: (this.props.clientWindow.height) }}>
          <Row className="joinSquadRow">
            <Col
              xs={12} md={8} lg={6}
              offset={{md: 2, lg:3}}
            >
              <Card className="joinSquadCard">
                <TextField
                  id="squadShortID"
                  name="squadShortID"
                  floatingLabelText="Squad ID"
                  fullWidth={true}
                  onChange={(event) => this.handleChange(event)}
                  value={this.state.squadShortID}
                  maxLength={11}
                />
                <RaisedButton
                  className="joinSquadButton"
                  label="Join Squad"
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

export default JoinSquad;
