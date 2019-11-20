import React, { useEffect, useState } from 'react';
import store from 'store';
import ProjectCard from '../components/ProjectCard';
import Header from '../components/Header';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

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

function Home(props) {
  const [projects, setProject] = useState([]);
  
  useEffect(() => {
    // Check if the user logged is manager to show all projects
    const me = store.get('logged-user');
    if (me !== 'admin') {
      const filteredData = projectsFake.filter(p => {
        return p.contributors.includes(me);
      });
      setProject(filteredData);
    } else {
      setProject(projectsFake);
    }
    
  }, [props.match]);

  const redirect = (projectId) => () => {
    props.history.push(`/project/${projectId}`);
  };

  const logout = () => {
    store.set('logged-token', '');
    store.get('logged-user', '');
    props.history.push('/');
  };

  return (
    <div>
      <CssBaseline />
      <Header logout={logout} />
      <Container maxWidth="sm" className="home-container">
        <div className="card-wrapper">
          {projects.map((project) => {
            return <ProjectCard {...project} redirect={redirect} />
          })}
        </div>
      </Container>
    </div>
  );
}

export default Home;