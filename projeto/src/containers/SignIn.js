import React, { useState } from 'react';
import store from 'store';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

/*
Simulando request para o servidor
essa lógica vai par ao backend quando  tiramos daqui
aqui temos qeu usar axios e fazer request para a url
da api
*/
const fakeAPI = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'gilvandro' && password === '123'
      || username === 'admin' && password === '123') {
        resolve({ status: 200, messge: 'ok' });
      } else {
        reject({ status: 400, message: 'invalid' });
      }
    }, 500);
  });
}

/*
 component burro para mostrar link
*/
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
/*
 configurando estilos do material design
*/
const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

/*
  componente que representa toda pagina de login
*/
export default function SignIn(props) {
  const classes = useStyles();
  // estado inicial do component
  /*
    values é o nosos estado inicial do formulario
    usando essa sintaxe de react-hooks é equivalente a usar
    a sintaxe de classes com um thi.state = {valores}
  */
  const [values, setValues] = useState({
    username: '',
    password: '',
    error: '',
  });
  /* 
    setValues 
    atualiza nosso estado inicial
    valores aqui são vindo do form como username e password
  */

  /*
    atualiza dinamicamente o campo no estado
    exempl: fieldName = username e no event vem o valor atual do input
  */
  const handleChange = (fieldName) => (event) => {
    setValues({
      ...values,
      [fieldName]: event.target.value,
    });
  };

  /*
    é executada quando o form é preenchido e alguém clica para fazer submit enviar 
  */
  const onSubmit = (event) => {
    /* 
      faz uma validação basica
    */
    event.preventDefault();
    if (!values.password || !values.username) {
      // TODO  add YUP validation
      setValues({ error: 'All fields are required' });
    } else {
      // 1. make request to api to get credentials and token
      // 2. store token
      // 3. redirect
      /* 
       aqui demos usar axios para fazer request e pegar credenciais
       para poder gerar token e dar o usuário acesso para fazer requests na api
       e listar o que quiser ou enviar algo
      */
      // fakeAPI(values.username, values.password).then(() => {
        // gera um token fake e armazena no localStorage
        store.set('logged-token', `token-${Math.floor(Math.random() * 1000)}`);
        // pega o username e guarda no localSotarge pra usar em algum lugar
        store.set('logged-user', values.username);
        props.history.push('/home');
      //}).catch(() => {
        // caso tenha erros então atualize o state com erros para exibir na pagina
        //setValues({ error: 'Invalid credentials' });
      //});
    }
  };

  // TODO user formik
  /* 
    usamos material design com componentes prontos de formulário
    criamos o inputs e exibimos
    cada input quando muda ele atualia o state
    com valores de password e username
    quando alguem clica no button o form é enviado via fução de submit
  */ 
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <p className="error">{values.error}</p>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={onSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={handleChange('username')}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange('password')}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
