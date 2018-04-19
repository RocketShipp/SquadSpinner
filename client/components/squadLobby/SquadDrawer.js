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

  handleYouTubeSearch = (props) => {
    let apiKey = youtubeKey;
    let term = $('#ytSearchInput').val().replace(/ /g, '+');
    if (term !== '') {
      $.ajax(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&order=relevance&q=${term}&type=video&videoEmbeddable=true&videoSyndicated=true&key=${apiKey}`, {
        success: (response) => {
          let newResults = [];
          response.items.forEach(item => {
            newResults.push({
              songUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              songTitle: `${item.snippet.title}`,
              image: `${item.snippet.thumbnails.medium.url}`,
              uploader: `${item.snippet.channelTitle}`
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
      songTitle: linkValue,
      uploader: ''
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
          width={ 350 }
          open={this.props.drawerOpen}
          className = "drawerContents"
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
              <CardHeader title="Search YouTube" />
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
                id="ytSearchButton"
                className="searchButton"
                fullWidth={true}
                label="Submit"
                onClick={this.handleYouTubeSearch}
              />
              </CardActions>
            </Card>
          </MenuItem>
          <MenuItem className="menuItem">
            <Card>
              <CardHeader title="SoundCloud / Vimeo / Twitch / Vidme" />
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
                id="scLinkPaste"
                onClick={this.handleLink}
                fullWidth={true}
                label="Submit"
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
