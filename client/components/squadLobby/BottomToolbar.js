import React from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarTitle} from 'material-ui/Toolbar';
import $ from 'jquery';

const BottomToolBar = (props) => {

  const renderButtons = () => {
    return (
      <span>
        {
          props.volume ?
          <IconButton className="iconButton" onClick={ props.handleMute }><i id="pause" className="material-icons">volume_up</i></IconButton> :
          <IconButton className="iconButton" onClick={ props.handleUnmute }><i id="pause" className="material-icons">volume_off</i></IconButton>
        }
        {
          props.playing ?
          <IconButton className="iconButton" onClick={ props.handlePause }><i id="pause" className="material-icons">pause</i></IconButton> :
          <IconButton className="iconButton" onClick={ props.handlePlay }><i id="playArrow" className="material-icons">play_arrow</i></IconButton>
        }
        <IconButton className="iconButton" onClick={ props.handleEnd }><i id="skipNext" className="material-icons">skip_next</i></IconButton>
      </span>
    )
  }

  const renderNowPlaying = () => {


    if (props.playlist.length === 0) {
      return  <ToolbarTitle text='No media playing' />
    } else {
      let toolbarText = props.playing ? `Playing: ${props.playlist[0].songTitle}` : `Paused: ${props.playlist[0].songTitle}`;
      return <ToolbarTitle text={toolbarText} />
    }
  }

  return (
    <Toolbar className="bottomToolbarContainer">
      {props.isOwner ? renderButtons() : renderNowPlaying()}
    </Toolbar>
  );

}

export default BottomToolBar;
