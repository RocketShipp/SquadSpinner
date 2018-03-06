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
          xs={12} md={8} lg={6}
          offset={{md:2, lg:3}}
          key={result.url}
          style={{marginTop: '10px'}}
        >
          <Card
            key={result.url}
            style={{cursor: 'pointer'}}
            onClick={() => {
              this.props.dialogClose();
              this.props.queueSong({
                url: result.url,
                title: result.title,
                uploader: result.uploader
              });
            }}
          >
            <CardMedia
              overlay={<CardTitle title={result.title} subtitle={`${result.uploader}`} />}
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
        titleStyle={{
          fontWeight: 'bold',
          textAlign: 'center'
        }}
        contentStyle={{
          width: '95%',
          maxWidth: `${this.props.clientWidth}`
        }}
        className="squadDialog"
        bodyClassName="dialogBody"
        actions={[
          <FlatButton
            label="Close"
            primary={true}
            onClick={this.props.dialogClose}
            backgroundColor={'red'}
            hoverColor={'transparent'}
            style={{color: 'white'}}
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
