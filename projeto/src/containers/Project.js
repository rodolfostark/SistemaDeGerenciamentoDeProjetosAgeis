import React, { useEffect, useState } from 'react';
import store from 'store';
import Header from '../components/Header';
import TaskList from '../components/TaskList';
import {
  useParams,
} from "react-router-dom";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import db from '../lib/db';

/* 
configurações de estilos do material ui
*/
const useStyles = makeStyles(theme => ({
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    display: 'none',
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

/**
 Esse são objetos fake simulando um dado que vem direto do banco
 Quando fizermos a request para listar os tasks do porjeto iremos 
 receber um json vindo da API com um formato similar
*/
const projectsFake = {
  1: {
    tasks: [
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 1',
        assigned: ['gilvandro'],
        description: 'lorem ipsum',
        dueDate: '02/10/2019',
      },
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 2',
        assigned: ['gilvandro'],
        description: 'lorem ipsum',
        dueDate: '02/11/2019',
      },
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 3',
        assigned: ['admin'],
        description: 'lorem ipsum',
        dueDate: '10/10/2019',
      },
    ],
    name: 'Ifood App',
    description: 'simple app',
    contributors: ['gilvandro', '4235', '454'],
    managers: ['admin'],
  },
  2: {
    tasks: [
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 5',
        description: 'lorem ipsum',
        assigned: ['4235'],
      },
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 12',
        description: 'lorem ipsum',
        assigned: ['4235'],
      },
      {
        id: Math.floor(Math.random() * 10000),
        title: 'task 45',
        description: 'lorem ipsum',
        assigned: ['356'],
      },
    ],
    name: 'Desktop App',
    contributors: ['565', '8989', '44'],
    managers: ['356'],
  },
  3: {
    tasks: [],
    name: 'Web site',
    contributors: ['8989', '44'],
    managers: ['admin'],
  }
};

/*
  componente que representa toda pagina de login
*/
function Project(props) {
  /* 
   project é o projeto atual tasks é o array de tasks que preciso listar no render abaixo
   setProject método seter para taulizar as tasks
  */
  const [project, setProject] = useState({ tasks: [] });
  const [projectOld, setOldProject] = useState({ tasks: [] });
  // id via url do projeto
  const { id }  = useParams();
  const classes = useStyles();

  // Modal
  /* gerencia quando abre e fecha o modal */ 
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);


  // abre modal
  const handleOpen = () => {
    setOpen(true);
  };

  // fecha modal
  const handleClose = () => {
    setOpen(false);
  };
  
  /*
    uma função de react-hooks
    que vai executar no final que a pãgina é carregada
    aqui devemos usar axios para fazer request
    no momemento estamos  usando dados fake estaticos
  */
  useEffect(() => {
    // Check if the user logged is manager to show all tasks
    const me = store.get('logged-user');

    // acessa as tasks do projeto que etamos abrindo
    // storage a lib qeu acessa localStorage
    // id vem da url da task atual
    const currentTasks = store.get('tasks') && store.get('tasks')[id]
      ? store.get('tasks')[id]
      : projectsFake[id];

    /* 
      como não temos API estamos fazendo no frontend uma filtragem caso o user seja admin ele
      pode ver todos
      caso não seja admi ele pode ver apenas o projeto onde ele é contribuidor

      essa lógica pode ser feita no backend o cara poe fazer um query,
      podemos passar o username do user logado e no backend fica essa lógica
     mas para facilitar no frontend podemos fazer já que é um protótipo
    */
    if (me !== 'admin') {
      const filteredData = currentTasks.tasks.filter(p => {
        return p.assigned.includes(me);
      });
      setProject({ tasks: filteredData });
      setOldProject({ tasks: filteredData });
    } else {
      setProject(currentTasks);
      setOldProject(currentTasks);
    }
  }, []);

  /* 
    redirect para login e apaga credenciais
  */ 
  const logout = () => {
    store.set('logged-token', '');
    store.get('logged-user', '');
    props.history.push('/');
  };

  /* reseta a filtragem */
  const filterByAll = () => {
    setProject(projectOld);
  };

  /* fitlra e atualiza o estado para listar apenas minhas tasks */
  const filterByMe = () => {
    // NOTE: Admin filtering data
    const me = store.get('logged-user');
    const filteredData = project.tasks.filter(p => {
      return p.assigned.includes(me)
    });
    setProject({ tasks: filteredData });
  };

  /* 
    gerencia o estado do fomrulário que adiciona task
  */
  const [fields, setField] = useState({
    id: Math.floor(Math.random() * 10000),
    title: '',
    description: '',
    dueDate: '2019-12-24T10:30'
  });
  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setField({
      ...fields,
      [field]: value,
    });
  };

  /* 
    adciona e salva nova task
  */
  const addNewTask = (event) => {
    event.preventDefault();
    // Store it in localStorage
    const currentProject = project;
    const tasks = [...currentProject.tasks, fields];
    db.newTaks(id, tasks);

    // Update the component state and list it
    setProject({
      tasks,
    });

    // reset
    setField({ title: '', description: '', dueDate: '2019-12-24T10:30' });
    handleClose();
  };

  const me = store.get('logged-user');

  /* 
    lista as tasks
    cada botão tem um evento associal de onLick
    que filtra por todos, filtra por apenas minhas tasks, reset filtragem
  */
  return (
    <div>
      <Header logout={logout} />
      <div className="filter-container">
        {me === 'admin' && (
          <React.Fragment>
            <Fab onClick={filterByMe} variant="extended" aria-label="like" className={classes.fab}>
              My tasks
            </Fab>
            <Fab onClick={filterByAll} variant="extended" aria-label="like" className={classes.fab}>
              All tasks
            </Fab>
            <Button variant="contained" color="primary" className={classes.button}
              onClick={handleOpen}
            >
              Add Task
            </Button>
          </React.Fragment>
        )}
      </div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <Typography variant="h5" component="h2">
            New Task
          </Typography>
          <form className={classes.container} noValidate autoComplete="off" onSubmit={addNewTask}>
            <div>
              <TextField
                id="outlined-basic"
                className={classes.textField}
                label="Title"
                margin="normal"
                variant="outlined"
                placeholder="Title"
                onChange={handleChange('title')}
              />
              <TextField
                id="outlined-basic"
                className={classes.textField}
                label="Description"
                margin="normal"
                variant="outlined"
                placeholder="Description"
                onChange={handleChange('description')}
              />
              <TextField
                id="datetime-local"
                label="Due Date"
                type="datetime-local"
                defaultValue="2017-05-24T10:30"
                className={classes.textField}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleChange('dueDate')}
              />
              <Button type="submit" variant="contained" color="primary" className={classes.button}
                onClick={handleOpen}
              >
                Save Task
              </Button>
            </div>
          </form>
        </div>
      </Modal>
      <TaskList tasks={project.tasks} />
    </div>
  );
}

export default Project;