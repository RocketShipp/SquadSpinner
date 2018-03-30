import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Container, Row, Col} from 'react-grid-system';
import {Card, CardTitle} from 'material-ui/Card';
import DashToolbar from './dashToolbar';
import './stylesheets/dash.scss';

const toolbarHeight = 56;

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
          height: (this.props.clientWindow.height - toolbarHeight)
        }}>
          <Row style={{width: '100%', textAlign: 'center'}}>
            <Col xs={6} md={4} offset={{md: 2}}>
              <Card className="dashCard">
                <Link to="/joinsquad">
                  <i className="material-icons dashIcon">add_circle</i>
                </Link>
                <CardTitle
                  title="Join"
                  className="dashCardTitle"
                  style={{
                    padding: 'none'
                  }}
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
                  style={{
                    padding: 'none'
                  }}
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
                  style={{
                    padding: 'none'
                  }}
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
                  style={{
                    padding: 'none'
                  }}
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
