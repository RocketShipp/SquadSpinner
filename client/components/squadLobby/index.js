import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import SquadDialog from './SquadDialog';
import BottomToolbar from './BottomToolbar';
import SquadDrawer from './SquadDrawer';
import SquadToolbar from './SquadToolbar'
import InnerContent from './InnerContent';
import RaisedButton from 'material-ui/raisedButton';
import ReactPlayer from 'react-player';
import axios from 'axios';
import $ from 'jquery';
import io from 'socket.io-client';
import './stylesheets/index.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shortId: this.props.match.params.shortId,
      isOwner: false,
      dialogOpen: false,
      drawerOpen: false,
      hideVideoPlayer: false,
      voteToSkipEnabled: false,
      requiredVotestoSkip: 1,
      songUrl: null,
      playing: true,
      volume: 1,
      playlist: [],
      results: []
    };
  }

  componentWillMount() {
    // Sets authorization header
    axios.defaults.headers.common['authorization'] = this.props.userToken;
    axios.defaults.headers.put['Content-Type'] = 'application/json';
    // Get lobby data and update states
    axios.post(`/api/getLobby/${this.state.shortId}`).then(res => {
      if (res.data.success) {
        // Updates Component Title in the navbar
        this.props.updateComponentTitle(res.data.lobby.lobbyName);

        const {hideVideoPlayer, voteToSkipEnabled, requiredVotestoSkip} = res.data.lobby.settings;

        // Check to see if user is owner of lobby
        axios.post('/api/getUser').then(user => {
          const isOwner = (user.data.user._id === res.data.lobby.users.ownerId);
          this.setState({isOwner, hideVideoPlayer, voteToSkipEnabled, requiredVotestoSkip, playlist: res.data.lobby.playlist})
        }).catch(err => this.setState({isOwner: false}));

        // If the playlist is not empty, update it
        if (res.data.lobby.playlist.length > 0) {
          const song = res.data.lobby.playlist[0];
          this.setState({ playlist: res.data.lobby.playlist, songUrl: song.songUrl, playing: true })
        }
      } else {
        this.props.setErrorText(res.data.message);
      }
    })
  }

  componentDidMount() {
    this.socketHandler();
    this.setPlayerRef();
  }

  socketHandler() {
    io.connect({
       query: 'shortId='+this.state.shortId
    });
    io({query: 'shortId='+this.state.shortId}).on('update_playlist', (data) => {
      this.props.setSuccessText(data.message);
      // Handle socket payload
      (data.playlist.length > 0) ?
      // If the playlist is not empty, update it
      this.setState({
        playlist: data.playlist,
        songUrl: data.playlist[0].songUrl
      }) :
      // If the playlist is empty, append the song, set songUrl, set playing to true
      this.setState({
        playlist: data.playlist,
        songUrl: data.playlist.length === 0 ? null : data.playlist[0].songUrl
      });
    });
    io({query: 'shortId='+this.state.shortId}).on('update_playing', (data) => {
      this.setState({playing: data});
    })
  }

  removeSong = (songId) => {
    // If playlist has a song in it, do this
    if (this.state.playlist.length > 0) {
      axios.put(`/api/removeSong/${songId}/fromSquad/${this.state.shortId}`).then(res => {
        if (res.data.success) {
          if (res.data.lobby.playlist.length > 0) {
            // Send out socket event with new playlist and success message
            return io({query: 'shortId='+this.state.shortId}).emit('update_playlist', {playlist: res.data.lobby.playlist, message: res.data.message});
          } else {
            // Send out socket event with new playlist and success message
            return io({query: 'shortId='+this.state.shortId}).emit('update_playlist', {playlist: [], message: res.data.message});
          }
        } else {
          this.props.setErrorText(res.data.message);
        }
      }).catch(err => this.props.setErrorText(err.message))
    }
  }

  drawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});

  drawerClose = () => this.setState({drawerOpen: false});

  dialogClose = () => this.setState({dialogOpen: false});

  handleMute = () => this.setState({volume: 0});

  handleUnmute = () => this.setState({volume: 1});

  handlePlay = () => {
    if (this.state.isOwner) return io({query: 'shortId='+this.state.shortId}).emit('update_playing', true);
  }

  handlePause = () => {
    if (this.state.isOwner) return io({query: 'shortId='+this.state.shortId}).emit('update_playing', false);
  }

  handleEnd = () => {
    if (this.state.playlist.length !== 0) {
      this.removeSong(this.state.playlist[0]._id);
      this.handlePlay();
    }
  }

  handleSearch = (results) => {
    this.setState({results, dialogOpen: true});
  };

  queueSong = (song) => {
    const {songTitle, songUrl} = song;

    if (!ReactPlayer.canPlay(songUrl)) {
      return this.props.setErrorText('Invalid link!');
    }

    axios.put(`/api/queueSong/${this.state.shortId}`, {songTitle, songUrl}).then(res => {
      if (res.data.success) {

        const socketPayload = {playlist: res.data.playlist, message: res.data.message}

        // Send out socket event with new playlist
        io({query: 'shortId='+this.state.shortId}).emit('update_playlist', socketPayload);
      } else {
        return this.props.setErrorText(res.data.message);
      }
    })
    .catch(err => console.log(err))

  }

  moveSongUp = (songId) => {
    let myPlaylist = [];
    this.state.playlist.map(song => myPlaylist.push(song));
    let songMap = [];
    myPlaylist.map(song => songMap.push(song._id));
    let indexOfSong = songMap.indexOf(songId);
    if (indexOfSong > 0) {
      myPlaylist.splice(indexOfSong, 1);
      myPlaylist.splice(indexOfSong - 1, 0, this.state.playlist[indexOfSong]);
      axios.put(`/api/updateLobbyPlaylist/${this.state.shortId}`, {playlist: myPlaylist}).then(res => {
        if (res.data.success) {
          io({query: 'shortId='+this.state.shortId}).emit('update_playlist', {playlist: res.data.lobby.playlist, message: res.data.message});
        } else {
          return this.props.setErrorText(res.message);
        }
      }).catch(err => this.props.setErrorText(err.message))
    }
  }

  moveSongDown = (songId) => {
    let myPlaylist = [];
    this.state.playlist.map(song => myPlaylist.push(song));
    let songMap = [];
    myPlaylist.map(song => songMap.push(song._id));
    let indexOfSong = songMap.indexOf(songId);
    if (indexOfSong < this.state.playlist.length - 1) {
      myPlaylist.splice(indexOfSong, 1);
      myPlaylist.splice(indexOfSong + 1, 0, this.state.playlist[indexOfSong]);
      axios.put(`/api/updateLobbyPlaylist/${this.state.shortId}`, {playlist: myPlaylist}).then(res => {
        if (res.data.success) {
          io({query: 'shortId='+this.state.shortId}).emit('update_playlist', {playlist: res.data.lobby.playlist, message: res.data.message});
        } else {
          return this.props.setErrorText(res.message);
        }
      }).catch(err => this.props.setErrorText(err.message))
    }
  }

  setPlayerRef = (player) => {
    if (player) {
      this.player = player;
    }
  }

  render() {
    return (
      <div>
        <SquadDialog
          queueSong={this.queueSong.bind(this)}
          results={this.state.results}
          dialogClose={this.dialogClose}
          dialogOpen={this.state.dialogOpen}
          clientWidth={this.props.clientWindow.width}
        />
        <SquadDrawer
          shortId={this.state.shortId}
          drawerOpen={this.state.drawerOpen}
          drawerClose={this.drawerClose.bind(this)}
          queueSong={this.queueSong.bind(this)}
          handleSearch={this.handleSearch.bind(this)}
          clientWidth={this.props.clientWindow.width}
        />
        <div>
          <SquadToolbar
            drawerToggle={this.drawerToggle.bind(this)}
            squadName={this.props.componentTitle}
          />
          <BottomToolbar
            playing={this.state.playing}
            handlePlay={this.handlePlay}
            handlePause={this.handlePause}
            handleEnd={this.handleEnd}
            isOwner={this.state.isOwner}
            playlist={this.state.playlist}
            volume={this.state.volume}
            handleMute={this.handleMute.bind(this)}
            handleUnmute={this.handleUnmute.bind(this)}
          />
          <InnerContent
            url={this.state.songUrl}
            height={this.props.clientWindow.height}
            onEnded={this.handleEnd.bind(this)}
            onError={this.handleEnd.bind(this)}
            handlePlay={this.handlePlay.bind(this)}
            handlePause={this.handlePause.bind(this)}
            playing={this.state.playing}
            playlist={this.state.playlist}
            hideVideoPlayer={this.state.hideVideoPlayer}
            isOwner={this.state.isOwner}
            setErrorText={this.props.setErrorText}
            volume={this.state.volume}
            removeSong={this.removeSong.bind(this)}
            moveSongUp={this.moveSongUp.bind(this)}
            moveSongDown={this.moveSongDown.bind(this)}
            setPlayerRef={this.setPlayerRef.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(App);
