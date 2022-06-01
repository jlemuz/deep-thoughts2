import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
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


  
  const [addThought] = useMutation(ADD_THOUGHT, {
    update(cache, { data: { addThought } }) {
      
      // could potentially not exist yet, so wrap in a try/catch
    try {
      // update me array's cache
      const { me } = cache.readQuery({ query: QUERY_ME });
      cache.writeQuery({
        query: QUERY_ME,
        data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
      });
    } catch (e) {
      console.warn("First thought insertion by user!")
    }

    // update thought array's cache
    const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
    cache.writeQuery({
      query: QUERY_THOUGHTS,
      data: { thoughts: [addThought, ...thoughts] },
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
      await addThought({
        variables: { thoughtText: data.secure_url },
      });

      // clear form value
      setText('');
      // setCharacterCount(0);
    } catch (e) {
      console.error(e);
    }
    window.location.reload(true);

  }

//   const [addThought, { error }] = useMutation(ADD_THOUGHT, {
//     update(cache, { data: { addThought } }) {
      
//       // could potentially not exist yet, so wrap in a try/catch
//     try {
//       // update me array's cache
//       const { me } = cache.readQuery({ query: QUERY_ME });
//       cache.writeQuery({
//         query: QUERY_ME,
//         data: { me: { ...me, thoughts: [...me.thoughts, addThought] } },
//       });
//     } catch (e) {
//       console.warn("First thought insertion by user!")
//     }

//     // update thought array's cache
//     const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
//     cache.writeQuery({
//       query: QUERY_THOUGHTS,
//       data: { thoughts: [addThought, ...thoughts] },
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
  //     await addThought({
  //       variables: { thoughtText },
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
  <form method="post" onChange={handleOnChange} value={thoughtText} onSubmit={handleOnSubmit}>
        <p>
          <input className="btn col-12 col-md-3" type="file" name="file" />
        </p>

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
          value={thoughtText}
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

export default ThoughtForm;
