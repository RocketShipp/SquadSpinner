import React, {Component} from 'react';
import './stylesheets/squadDrawer.scss';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {youtubeKey} from '../../resources/index.js';
const colors = require('material-ui/styles/colors');
import $ from 'jquery';

const styles = {
  dialogAppBar: {
    backgroundColor: 'transparent'
  },
  closeButton: {
    minWidth: '50px'
  },
  ytInputUnderlineFocus: {
    borderColor: colors.redA700
  },
  linkInputUnderlineFocus: {
    borderColor: colors.orange500
  }
}

class SquadDrawer extends Component {

  handleYouTubeSearch = (props) => {
    let apiKey = youtubeKey;
    let term = $('#ytSearchInput').val().replace(/ /g, '+');
    if (term !== '') {
      $.ajax(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&order=relevance&q=${term}&type=video&videoEmbeddable=true&videoSyndicated=true&key=${apiKey}`, {
        success: (response) => {
          let newResults = [];
          response.items.forEach(item => {
            newResults.push({
              url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              title: `${item.snippet.title}`,
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
    let link = {
      url: linkValue,
      title: linkValue,
      uploader: ''
    }
    this.props.queueSong(link);
    $(`.link input`).val('');
    this.props.drawerClose();
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
              title={'Squad ID: ' + this.props.squadShortID}
              style={styles.dialogAppBar}
              iconElementLeft={<i></i>}
              iconElementRight={
                <RaisedButton
                  onClick={ this.props.drawerClose }
                  className="closeButton"
                  style={styles.closeButton}
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
                  hintText="Search Term"
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
              <CardHeader title="SoundCloud, Vimeo or Twitch Link" />
              <form onSubmit={(e) => this.handleLinkForm(e)}>
                <TextField
                  className="link"
                  hintText="https://soundcloud.com/song"
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
