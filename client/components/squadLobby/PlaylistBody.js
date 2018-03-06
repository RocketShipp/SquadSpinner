import React from 'react';
import {Card, CardHeader} from 'material-ui/Card';
import {Row, Col} from 'react-grid-system';

const PlaylistBody = props => {
  return (
    <div className="playlistContainer">
      {
        props.playlist.map(song => {
          return (
            <Card key={Math.random()}>
              <CardHeader
                className="cardHeader"
                title={song.title}
                subtitle={song.uploader}
              />
            </Card>
          )
        })
      }
    </div>
  )
}

export default PlaylistBody;
