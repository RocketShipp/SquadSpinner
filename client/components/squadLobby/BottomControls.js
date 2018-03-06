import React from 'react';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import $ from 'jquery';

const Controls = (props) => {

  const styles = {
    bottomToolbar: {
      width: '100%',
      textAlign: 'center',
      display: 'auto',
      color: 'white',
      bottom: '0',
      position: 'fixed'
    },
    iconButton : {
      height: 'auto',
      width: 'auto',
      color: 'white',
    }
  }

  const isPlaying = props.playing;

  return (
    <Toolbar style={styles.bottomToolbar} className="bottomControlsContainer">
      <IconButton style={styles.iconButton} onClick={ props.handlePlay }><i id="playArrow" className="material-icons">play_circle_outline</i></IconButton>
      <IconButton style={styles.iconButton} onClick={ props.handlePause }><i id="pause" className="material-icons">pause_circle_outline</i></IconButton>
      <IconButton style={styles.iconButton} onClick={ props.handleEnd }><i id="skipNext" className="material-icons">chevron_right</i></IconButton>
    </Toolbar>
  );

}

export default Controls;
