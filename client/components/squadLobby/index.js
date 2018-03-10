import React, { Component } from 'react';
import SquadDialog from './SquadDialog';
import BottomControls from './BottomControls';
import SquadDrawer from './SquadDrawer';
import SquadToolbar from './SquadToolbar'
import InnerContent from './InnerContent';
import RaisedButton from 'material-ui/RaisedButton';
import $ from 'jquery';
import './stylesheets/index.scss';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isOwner: true,
      dialogOpen: false,
      drawerOpen: false,
      songUrl: null,
      playing: false,
      playlist: [],
      results: []
    };
  }

  componentDidMount() {
    this.props.updateComponentTitle('Lobby Name');
    if (this.state.playlist.length >= 1) {
      this.setState({
        songUrl: this.state.playlist[0].url
      })
    }
  }
  drawerToggle = () => this.setState({drawerOpen: !this.state.drawerOpen});
  drawerClose = () => this.setState({drawerOpen: false});
  dialogClose = () => this.setState({dialogOpen: false});
  handlePlay = () => this.setState({playing: true});
  handlePause = () => this.setState({playing: false});
  handleEnd = () => {
    let list = this.state.playlist;
    // If the playlist has an item, remove it
    if (list.length > 0) { list.shift() }
    // If the playlist has another song lined up, update the songUrl and playlist
    (list.length > 0) ? this.setState({ playing: true, songUrl: list[0].url, playlist: list }) :
    // If the playlist is empty, pause the player and update playlist & songUrl
    this.setState({ playing: false, songUrl: null, playlist: [] })
  }
  handleSearch = (results) => {
    this.setState({results, dialogOpen: true});
  };
  queueSong = (song) => {
    if (this.state.playlist.length >= 1) {
      this.setState({ playlist: [...this.state.playlist, song] });
    } else {
      this.setState({ playlist: [song], songUrl: song.url, playing: true });
    }
  }

  render() {
    return (
      <div>
        <SquadDrawer
          squadShortID={'DA3jKI42'}
          drawerOpen={this.state.drawerOpen}
          drawerClose={this.drawerClose.bind(this)}
          queueSong={this.queueSong.bind(this)}
          handleSearch={this.handleSearch.bind(this)}
        />
        <SquadDialog
          queueSong={this.queueSong.bind(this)}
          results={this.state.results}
          dialogClose={this.dialogClose}
          dialogOpen={this.state.dialogOpen}
          clientWidth={this.props.clientWindow.width}
        />
        <SquadToolbar
          drawerToggle={this.drawerToggle.bind(this)}
          squadName={this.props.componentTitle}
        />
        <BottomControls
          playing={this.state.playing}
          handlePlay={this.handlePlay}
          handlePause={this.handlePause}
          handleEnd={this.handleEnd}
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
        />
      </div>
    );
  }
}

export default App;
