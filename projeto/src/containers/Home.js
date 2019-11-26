import React from 'react';
import store from 'store';
import ProjectCard from '../components/ProjectCard';
import Header from '../components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import axios from 'axios';

/* 
 Esse são objetos fake simulando um dado que vem direto do banco
 Quando fizermos a request para listar os projetos iremos 
 receber um json vindo da API com um formato similar
*/
const projectsFake = [
  {
    projectId: '1',
    name: 'Ifood App',
    description: 'simple app',
    contributors: ['gilvandro', '4235', '454'],
    managers: ['admin'],
    started: '10/02/2019',
    finish: '10/12/2019',
    imageUrl: 'https://specials-images.forbesimg.com/imageserve/5db9cc76d85e3000078fb931/960x0.jpg?fit=scale',
  },
  {
    projectId: '2',
    name: 'Desktop App',
    contributors: ['8989', '44'],
    description: 'simple software',
    managers: ['admin'],
    started: '11/06/2019',
    finish: '11/10/2019',
    imageUrl: 'https://www.clicdata.com/wp-content/uploads/2019/06/example-dashboard-014-1.png',
  }, 
  {
    projectId: '3',
    name: 'Web site',
    contributors: ['8989', '44'],
    description: 'simple software',
    managers: ['admin'],
    started: '11/06/2019',
    finish: '11/10/2019',
    imageUrl: 'https://www.clicdata.com/wp-content/uploads/2019/06/example-dashboard-014-1.png',
  }
];

const fetchProjects = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(projectsFake);
    }, 500);
  });
}

class Home extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
    };
  }

  componentDidMount() {
    
    fetchProjects('https://minhaapi.com/api/v2/projects')
    .then(response => {
      const me = store.get('logged-user');
      
      if (me !== 'admin') {
        const filteredData = response.filter(p => {
          return p.contributors.includes(me);
        });
        this.setProject(filteredData);
      } else {
        this.setProject(response);
      }
    })
    .catch((e) => {
      
      console.log('-->>', e)
    });
  }

  
  setProject = (projects) => {
    this.setState({
      projects,
    });
  }

  
  redirect = (projectId) => () => {
    this.props.history.push(`/project/${projectId}`);
  };

  
  logout = () => {
    store.set('logged-token', '');
    store.get('logged-user', '');
    this.props.history.push('/');
  }

  
  render() {
    return(
      <div>
        <CssBaseline />
        <Header logout={this.logout} />
        <Container maxWidth="sm" className="home-container">
          <div className="card-wrapper">
            {this.state.projects.map((project) => {
              return <ProjectCard {...project} redirect={this.redirect} />
            })}
          </div>
        </Container>
      </div>
    );
  }
}

export default Home;
