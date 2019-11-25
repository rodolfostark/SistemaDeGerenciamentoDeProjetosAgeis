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

// Component que representa a página por complete
// Ele está na pasta de containers pois é uma nomenclatura que 
// o pessoal usa, poderia ser /pages/Home.js  /screens/Home.js
class Home extends React.Component { 
  constructor(props) {
    super(props);
    // O estado inicial do component o valor default que inicializa com um array vazio
    // quando carregarmos nossa página e fizermos uma request iremos 
    // atualizar esse estado pois quando atualizamos um estado de um component react
    // automaticamente o método render irá ser atualizado
    // ele começa vazio se alguem atualiza o estado a parte do template é atualizada diretamente
    this.state = {
      projects: [],
    };
  }

  /*
   esse método é um método do lifecylce de um componente react
   após nossa página carregar faça uma request
   atualize o state com os projetso que estamos listando que estão chegando na request
  */
  componentDidMount() {
    /* 
      usamos o uma função fake que simula o axios que é uma lib que faz request
      teremos que usar axios para fazere request aqui dessa forma
      axios.get('https://minhaapi.com/api/v2/projects')
        .then(response => {
          this.setProject(response);
        }).catch((e) => {
        // caso a request dê errado apareça erro
        console.log('-->>', e)
      });

       axios para fazer request ele retorna uma promise
      axios é uma lib que nos ajuda a fazer request simples até mais complexas
    */
    fetchProjects('https://minhaapi.com/api/v2/projects')
    .then(response => {
      const me = store.get('logged-user');
      /* 
        como não temos API estamos fazendo no frontend uma filtragem caso o user seja admin ele
        pode ver todos
        caso não seja admi ele pode ver apenas o projeto onde ele é contribuidor

        essa lógica pode ser feita no backend o cara poe fazer um query,
        podemos passar o username do user logado e no backend fica essa lógica
        mas para facilitar no frontend podemos fazer já que é um protótipo
      */
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
      // caso a request dê errado apareça erro
      console.log('-->>', e)
    });
  }

  /* 
    atualiza o estado da página home
    logo em seguida os projetos são listados no método render
  */
  setProject = (projects) => {
    this.setState({
      projects,
    });
  }

  /*
    é usado para fazer redirect para um projeto em especifico
  */
  redirect = (projectId) => () => {
    this.props.history.push(`/project/${projectId}`);
  };

  /* faz logout do cara, redirectiona para fora e apaga as credenciais dele */
  logout = () => {
    store.set('logged-token', '');
    store.get('logged-user', '');
    this.props.history.push('/');
  }

  /*
    faz a chamada do component Header passando um callback logout para quando clicarem lá no componentn Header
    redirecionar para fora e limpar as credenciais

    Container é um componente que centraliza e dentro dele tem a listagem com cada card
    ProjectCard é o card que recebe os dados do projeto e exibe o titulo, imagem, participantes, descição
    data de entrega do projeto
  */
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

/**
 * exportamos para quem quiser importar ver esse component
 * estamos importando  ele em App.js que é onde tem as rotas configuradas
 */
export default Home;