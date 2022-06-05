import React from 'react';
import { Link } from 'react-router-dom';
// import { REMOVE_POST } from '../../utils/mutations';
// import {useMutation } from '@apollo/client';
// import Auth from "../../utils/auth";
// import ChatBubbleIcon from '@mui/icons-material/ChatBubble';

import ChatBubbleIcon from '@material-ui/icons/ChatBubble';

import { Grid, Card, CardMedia, Typography, Button } from '@material-ui/core';
import useStyles from './styles';


const PostList = ({ posts, title }) => {

  // const loggedIn = Auth.loggedIn();
  const classes = useStyles();

//  const [removePost] = useMutation(REMOVE_POST);



  if (!posts.length) {
    return <h3>No Posts Yet</h3>;
  }


  // const handleClick = async () => {
  //   try {
  //     await removePost({
  //       variables: { postId: this.id },
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  

  return (
    <div>
      <h3>{title}</h3>
      {posts &&
        posts.map(post => (


          <div key={post._id} className={classes.card}>

  <Grid item xs={12} sm={7}>
      <Card className={classes.card}>
      <div className={classes.overlay}>
            <Link to={`/profile/${post.username}`}>
            <Typography variant="h6">{post.username}</Typography>
            </Link>
            <Typography variant="h6">{post.createdAt}</Typography>
          </div>
      <Link to={`/post/${post._id}`}>
        <CardMedia className={classes.media} image={post.postText} >
        </CardMedia>
        <div>
          <Card className={classes.cardActions}>
            <Button size ="large" color="primary">
            <ChatBubbleIcon></ChatBubbleIcon>
            <Typography variant="h6">
            {post.reactionCount}
               </Typography>

            </Button>

            </Card>
            <div>
         
               
          </div>
        </div>
        </Link>
      </Card>
    </Grid>
  



            {/* <p className="card-header">
              <Link
                to={`/profile/${post.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {post.username}
              </Link>{' '}
              post on {post.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/post/${post._id}`}>
                <img src={post.postText} alt = "img not found" width="50%"></img>
                <p>{post._id}</p>
                <p className="mb-0">
                  Comments: {post.reactionCount} || Click to{' '}
                  {post.reactionCount ? 'see' : 'start'} the comments!
                </p>
              </Link>
            {loggedIn &&  <button id={post._id} className="btn ml-auto" onClick={handleClick}>
            Delete Post
            </button>}
            </div> */}
          </div>
        ))}
    </div>
  );
};

export default PostList;
