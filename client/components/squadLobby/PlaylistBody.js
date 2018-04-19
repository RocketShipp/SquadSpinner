import React from 'react';
import {Card, CardHeader, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import {Row, Col} from 'react-grid-system';

const PlaylistBody = props => {
  return (
    <div>
      {
        props.playlist.map(song => {
          return (
            <Card key={song._id}>
              <CardHeader
                className="cardHeader"
                title={song.songTitle}
                subtitle={'Queued By: ' + song.addedByUser.userName}
                actAsExpander={props.isOwner}
                showExpandableButton={props.isOwner}
              />
              {
                // If user is owner, render queued song actions
                props.isOwner ?
                <CardActions className="cardActions" expandable={true}>
                  <FlatButton
                    icon={<i className="material-icons">arrow_upward</i>}
                    onClick={() => props.moveSongUp(song._id)}
                  />
                  <FlatButton
                    backgroundColor={'red'}
                    label="Remove"
                    onClick={() => props.removeSong(song._id)}
                  />
                  <FlatButton
                    icon={<i className="material-icons">arrow_downward</i>}
                    onClick={() => props.moveSongDown(song._id)}
                  />
                </CardActions> : null
              }
            </Card>
          )
        })
      }
    </div>
  )
}

export default PlaylistBody;
