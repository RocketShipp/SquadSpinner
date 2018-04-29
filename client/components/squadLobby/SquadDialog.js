import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Row, Col} from 'react-grid-system';
import {Card, CardActions, CardHeader, CardMedia, CardTitle} from 'material-ui/Card';

class SquadDialog extends Component {

  generateResults = (props) => {
    return this.props.results.map(result => {
      return (
        <Col
          xs={12}
          key={result.songUrl}
          className="dialogResultCol"
        >
          <Card
            className="dialogResult"
            onClick={() => {
              this.props.dialogClose();
              this.props.queueSong({
                songUrl: result.songUrl,
                songTitle: result.songTitle
              });
            }}
          >
            <CardMedia
              overlay={
                <CardTitle
                  subtitle={`${result.songTitle}`}
                  subtitleStyle={{fontWeight: 'bold', color: 'white'}}
                />
              }
            >
              <img src={result.image} alt="" />
            </CardMedia>
          </Card>
        </Col>
      )
    })
  }

  render(props) {
    return (
      <Dialog
        title="Results"
        className="squadDialog"
        titleStyle={{
          fontWeight: 'bold',
          textAlign: 'center'
        }}
        contentStyle={{
          width: '100%'
        }}
        bodyClassName="dialogBody"
        actions={[
          <FlatButton
            label="Close"
            primary={true}
            onClick={this.props.dialogClose}
            className="closeDialogButton"
          />
        ]}
        modal={false}
        open={this.props.dialogOpen}
        onRequestClose={this.props.dialogClose}
        autoScrollBodyContent={true}
      >
        <Row>
          {this.generateResults()}
        </Row>
      </Dialog>
    )
  }
}

export default SquadDialog;
