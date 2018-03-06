import React, {Component} from 'react';
import {Container, Row, Col} from 'react-grid-system';
import ReactPlayer from 'react-player';
import {Card, CardText} from 'material-ui/Card';
import PlaylistBody from './PlaylistBody';
import $ from 'jquery';

class InnerContent extends Component {

renderContent = (props) => {
  if (this.props.playlist.length >= 1) {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg: 3}}
        style={{
          paddingLeft: 'none',
          paddingRight: 'none'
        }}
      >
        <ReactPlayer
          width={'100%'}
          url={this.props.url}
          height={(this.props.height / 2)}
          onEnded={this.props.onEnded}
          onError={this.props.onEnded}
          playing={this.props.playing}
          onPlay={this.props.handlePlay}
          onPause={this.props.handlePause}
          config={{
            youtube: {
              playerVars: { rel: 0, controls: 1 }
            },
            soundcloud: {
              buying: false,
              sharing: false,
              download: false
            }
        }}/>
        <PlaylistBody playlist={this.props.playlist} />
      </Col>
    )
  } else {
    return (
      <Col
        xs={12} md={8} lg={6}
        offset={{md: 2, lg: 3}}
        style={{
          paddingLeft: '0',
          paddingRight: '0',
          textAlign: 'center'
        }}
      >
        <div>
          <Card>
            <CardText>
              <p id="noItemsInPlaylist">Hit the menu button to start spinning!</p>
            </CardText>
          </Card>
        </div>
      </Col>
    )
  }
}

render(props) {
  return (
    <Container fluid={true}>
      <Row
        style={{
          alignItems: 'center'
        }}
      >
      {this.renderContent()}
      </Row>
    </Container>
  )
}

}

export default InnerContent;
