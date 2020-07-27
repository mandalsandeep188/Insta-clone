import React, { useState, useEffect, useContext } from 'react';
import {Link} from 'react-router-dom'
import '../../App.css';
import { UserContext } from '../../App';

export default function Profile() {
  const { state, dispatch } = useContext(UserContext)
  const [posts, setPosts] = useState(null)
  const [image, setImage] = useState(null)
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(data => setPosts(data.myposts))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    if (image) {
      const data = new FormData()
      data.append("file", image)
      data.append("upload_preset", "insta-clone")
      data.append("cloud_name", "sandeep188")
      fetch("https://api.cloudinary.com/v1_1/sandeep188/image/upload", {
        method: "post",
        body: data
      })
        .then(res => res.json())
        .then(data => {
          fetch('/updatepic', {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              photo: data.url
            })
          }).then(res => res.json())
            .then(result => {
              localStorage.setItem("user", JSON.stringify({ ...state, photo: result.photo }))
              dispatch({ type: "UPDATEPIC", payload: result.photo })
              //window.location.reload()
            })

        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [image])

  const updatePhoto = (file) => {
    setImage(file)
  }
  return (
    <>
      <div className="container">
        {
          posts ?
            <>
              <div className="userDetails">
                <div>
                  <img src={state ? state.photo : "https://res.cloudinary.com/sandeep188/image/upload/v1589956939/user_vg9ota.jpg"} alt="Profile Pic" className="pic circle" />
                  <input type="file" id="file" onChange={(e)=>updatePhoto(e.target.files[0])}/>
                  <label htmlFor="file" className="btn #64b5f6 blue darken-1" style={{display:"block",width:"100%"}}>Change Pic</label>
                </div>
                <div className="details">
                  <div className="user">
                    <h4>{state ? state.name : "loading.."}</h4>
                  </div>
                  <h5>{state ? state.email : "loading.."}</h5>
                  <div className="userStats">
                    <h6>{posts.length} Posts</h6>
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>
                  </div>
                </div>
              </div>
              <div className="gallery">
                {
                  posts.map(item => {
                    return (
                      <Link to={`/post/${item._id}`} style={{cursor:"pointer"}} key ={item._id}><img src={item.photo} className="posts" /></Link>
                    )
                  })
                }
              </div>
            </>
            : <div className="preloader-wrapper big active">
              <div className="spinner-layer spinner-blue-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>
        }
      </div>
    </>
  )
}