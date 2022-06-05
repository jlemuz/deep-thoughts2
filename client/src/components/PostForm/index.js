import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_POST } from '../../utils/mutations';
import { QUERY_POSTS, QUERY_ME } from '../../utils/queries';
import { Typography } from '@material-ui/core';


import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

const PostForm = () => {
  const [postText, setText] = useState('');
  // const [characterCount, setCharacterCount] = useState(0);

  
  const [imageSrc, setImageSrc] = useState();
  const [uploadData, setUploadData] = useState();

  function handleOnChange(changeEvent) {
    const reader = new FileReader();

    reader.onload = function (onLoadEvent) {
      setImageSrc(onLoadEvent.target.result);
      setUploadData(undefined);
    };

    reader.readAsDataURL(changeEvent.target.files[0]);
  }


  
  const [addPost] = useMutation(ADD_POST, {
    update(cache, { data: { addPost } }) {
      
      // could potentially not exist yet, so wrap in a try/catch
    try {
      // update me array's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, posts: [...me.posts, addPost] } },
      });
    } catch (e) {
      console.warn("First post insertion by user!")
    }

    // update post array's cache
    const { posts } = cache.readQuery({ query: QUERY_POSTS });
    cache.writeQuery({
      query: QUERY_POSTS,
      data: { posts: [addPost, ...posts] },
    });
  }
})

  async function handleOnSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === "file"
    );

    console.log(fileInput);

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append("file", file);
    }

    formData.append("upload_preset", "papi-uploads");

    const data = await fetch(
      "https://api.cloudinary.com/v1_1/papicloud/image/upload",
      {
        method: "POST",
        body: formData,
      }
    ).then((r) => r.json());

    // console.log("data", data.secure_url);

    // setText(data.secure_url);
    // setUploadData(data.secure_url);

    try {
      await addPost({
        variables: { postText: data.secure_url },
      });

      // clear form value
      setText('');
      // setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
    window.location.reload(true);

  }

//   const [addPost, { error }] = useMutation(ADD_POST, {
//     update(cache, { data: { addPost } }) {
      
//       // could potentially not exist yet, so wrap in a try/catch
//     try {
//       // update me array's cache
//       const { me } = cache.readQuery({ query: QUERY_ME });
//       cache.writeQuery({
//         query: QUERY_ME,
//         data: { me: { ...me, posts: [...me.posts, addPost] } },
//       });
//     } catch (e) {
//       console.warn("First post insertion by user!")
//     }

//     // update post array's cache
//     const { posts } = cache.readQuery({ query: QUERY_POSTS });
//     cache.writeQuery({
//       query: QUERY_POSTS,
//       data: { posts: [addPost, ...posts] },
//     });
//   }
// })

  // update state based on form input changes
  // const handleChange = (event) => {
  //   if (event.target.value.length <= 280) {
  //     setText(event.target.value);
  //     setCharacterCount(event.target.value.length);
  //   }
  // };

  // submit form
  // const handleFormSubmit = async (event) => {
  //   event.preventDefault();

  //   try {
  //     await addPost({
  //       variables: { postText },
  //     });

  //     // clear form value
  //     setText('');
  //     setCharacterCount(0);
  //   } catch (e) {
  //     console.error(e);
  //   }
  //   // window.location.reload(true);
  // };

  return (
    <div>
  <form method="post" onChange={handleOnChange} value={postText} onSubmit={handleOnSubmit}>
        <div>
          <p>  <PhotoCameraIcon size = "xlarge"></PhotoCameraIcon> 
          <Typography variant="h6">
            Upload your image
            </Typography>
          </p>
            <input className="btn col-12 col-md-3" type="file" name="file" />
        </div>

        <img src={imageSrc} height="20%" width="25%" />

        {imageSrc && !uploadData && (
          <p>
            <button className="btn col-12 col-md-3" type="submit">
          Confirm Upload
        </button>
          </p>
        )}

        {/* {uploadData && (
          <code>
            <pre>{JSON.stringify(uploadData, null, 2)}</pre>
          </code>
        )} */}
      </form>


      {/* <p
        className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}
      >
        Character Count: {characterCount}/280
        {error && <span className="ml-2">Something went wrong...</span>}
      </p> */}
      {/* <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Paste URL here..."
          value={postText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Upload
        </button>
      </form> */}
    </div>
  );
};

export default PostForm;
