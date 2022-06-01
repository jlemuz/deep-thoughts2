import React from 'react';
import { Link } from 'react-router-dom';
// import { REMOVE_THOUGHT } from '../../utils/mutations';
// import {useMutation } from '@apollo/client';
// import Auth from "../../utils/auth";
// import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import { Grid, Card, CardMedia, Typography, Button } from '@material-ui/core';
import useStyles from './styles';


const ThoughtList = ({ thoughts, title }) => {

  // const loggedIn = Auth.loggedIn();
  const classes = useStyles();

//  const [removeThought] = useMutation(REMOVE_THOUGHT);



  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }


  // const handleClick = async () => {
  //   try {
  //     await removeThought({
  //       variables: { thoughtId: this.id },
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  

  return (
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (


          <div key={thought._id} className={classes.card}>

  <Grid item xs={12} sm={7}>
      <Card className={classes.card}>
      <div className={classes.overlay}>
            <Link to={`/profile/${thought.username}`}>
            <Typography variant="h6">{thought.username}</Typography>
            </Link>
            <Typography variant="h6">{thought.createdAt}</Typography>
          </div>
      <Link to={`/thought/${thought._id}`}>
        <CardMedia className={classes.media} image={thought.thoughtText} >
        </CardMedia>
        <div>
          <cardActions className={classes.cardActions}>
            <Button size ="large" color="primary">
            <ChatBubbleIcon></ChatBubbleIcon>
            <Typography variant="h6">
            {thought.reactionCount}
               </Typography>

            </Button>

            </cardActions>
            <div>
         
               
          </div>
        </div>
        </Link>
      </Card>
    </Grid>
  



            {/* <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <img src={thought.thoughtText} alt = "img not found" width="50%"></img>
                <p>{thought._id}</p>
                <p className="mb-0">
                  Comments: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the comments!
                </p>
              </Link>
            {loggedIn &&  <button id={thought._id} className="btn ml-auto" onClick={handleClick}>
            Delete Thought
            </button>}
            </div> */}
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;
