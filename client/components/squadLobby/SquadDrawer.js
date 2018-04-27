import React, {Component} from 'react';
import './stylesheets/squadDrawer.scss';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/raisedButton';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {youtubeKey} from '../../resources/index.js';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';

const styles = {
  ytInputUnderlineFocus: {
    borderColor: colors.redA700
  },
  linkInputUnderlineFocus: {
    borderColor: colors.orange500
  }
}

class SquadDrawer extends Component {

  constructor(){
    super();
    this.state = {
      ytSearch: '',
      urlField: ''
    }
  }

  determineWidth = () => {
    return (this.props.clientWidth < 350) ? '100%' : 350;
  }

  handleYouTubeSearch = (props) => {
    let apiKey = youtubeKey;
    let term = $('#ytSearchInput').val().replace(/ /g, '+');
    if (term !== '') {
      $.ajax(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&order=relevance&q=${term}&type=video&videoEmbeddable=true&videoSyndicated=true&key=${apiKey}`, {
        success: (response) => {
          let newResults = [];
          response.items.forEach(item => {
            newResults.push({
              songUrl: `https://www.youtube.com/embed/${item.id.videoId}`,
              songTitle: `[${item.snippet.channelTitle}] - ${item.snippet.title}`,
              image: `${item.snippet.thumbnails.medium.url}`
            })
          })
          this.props.handleSearch(newResults);
          $(`#ytSearchInput`).val('');
          this.props.drawerClose();
        }
      })
    }
  };
  handleLink = (props) => {
    let linkValue = $(`.link input`).val();
    let song = {
      songUrl: linkValue,
      songTitle: linkValue
    }
    this.props.queueSong(song);
    $(`.link input`).val('');
    this.props.drawerClose();
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState(() => ({
      [name]: value
    }));
  }

  handleYouTubeForm = (e) => {
    e.preventDefault();
    this.handleYouTubeSearch();
  }
  handleLinkForm = (e) => {
    e.preventDefault();
    this.handleLink();
  }

  render(props) {
    return (
      <div>
        <Drawer
          width={ this.determineWidth() }
          open={this.props.drawerOpen}
          className="drawerContents"
          openSecondary={true}
        >
          <Card>
            <AppBar
              className="dialogAppBar"
              title={'Squad ID: ' + this.props.shortId}
              iconElementLeft={<span></span>}
              iconElementRight={
                <RaisedButton
                  onClick={ this.props.drawerClose }
                  className="closeButton"
                >
                  <i className="material-icons">close</i>
                </RaisedButton>
              }
            />
          </Card>
          <MenuItem className="menuItem">
            <Card>
              <CardHeader
                title="Search YouTube"
                className="menuItemHeader"
              />
              <form onSubmit={(e) => this.handleYouTubeForm(e)}>
                <TextField
                  id="ytSearchInput"
                  name="ytSearch"
                  onChange={(event) => this.handleChange(event)}
                  value={this.state.ytSearch}
                  hintText="Electric Avenue"
                  floatingLabelText="Search youtube for a song"
                  underlineFocusStyle={styles.ytInputUnderlineFocus}
                />
              </form>
              <CardActions>
              <FlatButton
                className="searchButton"
                fullWidth={false}
                label="Search"
                onClick={this.handleYouTubeSearch}
                backgroundColor={colors.redA700}
                fullWidth={true}
              />
              </CardActions>
            </Card>
          </MenuItem>
          <MenuItem className="menuItem">
            <Card>
              <CardHeader
                title="SoundCloud | Vimeo | Twitch | Vidme"
                className="menuItemHeader"
              />
              <form onSubmit={(e) => this.handleLinkForm(e)}>
                <TextField
                  name="urlField"
                  onChange={(event) => this.handleChange(event)}
                  value={this.state.urlField}
                  className="link"
                  hintText="soundcloud.com/rich-the-kid/plug-walk-1"
                  floatingLabelText="Use a direct URL"
                  underlineFocusStyle={styles.linkInputUnderlineFocus}
                />
              </form>
              <CardActions>
              <FlatButton
                className="searchButton"
                fullWidth={false}
                label="Submit"
                onClick={this.handleLink}
                backgroundColor={colors.orange500}
                fullWidth={true}
              />
              </CardActions>
            </Card>
          </MenuItem>
        </Drawer>
      </div>
    )
  }
}

export default SquadDrawer;
