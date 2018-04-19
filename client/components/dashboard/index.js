import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col} from 'react-grid-system';
import {Card, CardTitle} from 'material-ui/Card';
import DashToolbar from './dashToolbar';
import './stylesheets/dash.scss';

class Dashboard extends Component {

  componentWillMount() {
    this.props.updateComponentTitle('Dashboard');
  }

  render() {
    return (
      <span>
        <DashToolbar
          componentTitle={this.props.componentTitle}
        />
        <Container fluid={true} className="dashContainer" style={{
          height: (this.props.clientWindow.height)
        }}>
          <Row className="dashRow">
            <Col xs={6} md={4} offset={{md: 2}}>
              <Card className="dashCard">
                <Link to="/joinsquad">
                  <i className="material-icons dashIcon">add_circle</i>
                </Link>
                <CardTitle
                  title="Join"
                  className="dashCardTitle"
                />
              </Card>
            </Col>
            <Col xs={6} md={4}>
              <Card className="dashCard">
                <Link to="/createsquad">
                  <i className="material-icons dashIcon">mode_edit</i>
                </Link>
                <CardTitle
                  title="Create"
                  className="dashCardTitle"
                />
              </Card>
            </Col>
            <Col xs={6} md={4} offset={{md: 2}}>
              <Card className="dashCard">
                <Link to="/mysquads">
                  <i className="material-icons dashIcon">people</i>
                </Link>
                <CardTitle
                  title="Squads"
                  className="dashCardTitle"
                />
              </Card>
            </Col>
            <Col xs={6} md={4}>
              <Card className="dashCard">
                <Link to="/account">
                  <i className="material-icons dashIcon">account_circle</i>
                </Link>
                <CardTitle
                  title="Account"
                  className="dashCardTitle"
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </span>
    )
  }
}

export default Dashboard;
