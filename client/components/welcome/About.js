import React from 'react';
import {Col} from 'react-grid-system';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardText, CardTitle} from 'material-ui/Card';
import {aboutText} from '../../resources';

const AboutView = (props) => {
  return (
    <Col
      xs={12} md={8} lg={6}
      offset={{md: 2, lg:3}}
      className="viewCol"
      style={{
        textAlign: 'center',
        maxHeight: props.clientHeight - props.toolbarHeight,
        overflowY: 'scroll'
      }}
    >
      <Card
        className="welcomeCard"
      >
        <CardTitle
          title="What is SquadSpinner?"
          style={{
            padding: 'none',
            fontWeight: 'bold'
          }}
        />
        <CardText className="aboutText">
          {aboutText}
        </CardText>
        <RaisedButton
          className="welcomeButton"
          label="Back"
          fullWidth={false}
          labelStyle={{fontWeight: 'bold'}}
          secondary={true}
          onClick={() => props.setView(null)}
        />
      </Card>
    </Col>
  )
}

export default AboutView;
