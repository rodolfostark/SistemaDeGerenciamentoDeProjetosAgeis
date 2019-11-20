import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

export default function SimpleList(props) {
  console.log('props ', props);
  const classes = useStyles();

  return (
    <div className={`${classes.root} tasks-container`}>
      <List component="nav" className="task-list" aria-label="secondary mailbox folders">
        {props.tasks.map((task) => (
          <ListItem button>
            <Typography component="span" className="task-title">
              Description: {task.title}
            </Typography>
            <Typography component="span" className="task-title">
              Description: {task.description}
            </Typography>
            <Typography component="span" className="task-title">
              Due Date: {task.dueDate}
            </Typography>
          </ListItem>
        ))}
      </List>
    </div>
  );
}