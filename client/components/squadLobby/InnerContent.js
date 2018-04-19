import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';
import ReactPlayer from 'react-player';
import {Card, CardText} from 'material-ui/Card';
import PlaylistBody from './PlaylistBody';
import $ from 'jquery';

const toolbarHeight = 56;

class InnerContent extends Component {

renderContent = (props) => {
  if (this.props.playlist.length > 0) {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg: 3}}
        className="innerContentTopCol"
      >
        {
          // If user is squad owner, render ReactPlayer component
          this.props.isOwner ?
          <ReactPlayer
            url={this.props.url}
            height={(this.props.height - (toolbarHeight * 2)) / 2}
            width={'100%'}
            onEnded={this.props.onEnded}
            onError={this.props.onEnded}
            playing={this.props.playing}
            onPlay={this.props.handlePlay}
            onPause={this.props.handlePause}
            volume={this.props.volume}
            style={{display: (this.props.hideVideoPlayer ? 'none' : 'auto')}}
            config={{
              youtube: {
                playerVars: { rel: 0, controls: 1 }
              },
              soundcloud: {
                buying: false,
                sharing: false,
                download: false
              }
          }}/> : null
        }
        <PlaylistBody
          isOwner={this.props.isOwner}
          playlist={this.props.playlist}
          removeSong={this.props.removeSong}
          moveSongUp={this.props.moveSongUp}
          moveSongDown={this.props.moveSongDown}
        />
      </Col>
    )
  } else {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg: 3}}
        className="innerContentCol"
      >
        <Card className="noItemsCard">
          <CardText>
            <p id="noItemsInPlaylist">Playlist empty</p>
          </CardText>
        </Card>
      </Col>
    )
  }
}

render(props) {
  return (
    <Container fluid={true} className="innerContentContainer">
      <Row className="innerContentRow">
      {this.renderContent()}
      </Row>
    </Container>
  )
}

}

export default InnerContent;
