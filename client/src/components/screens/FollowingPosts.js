import React, { useEffect, useState, useContext } from 'react';
import '../../App.css';
import { Link } from 'react-router-dom'
import { UserContext } from '../../App';

export default function Home() {
  const [posts, setPosts] = useState(null)
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    fetch("/followingposts", {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(posts => {
        setPosts(posts.posts)
      })
      .catch(err => console.log(err))
  }, [])

  const unlikePost = (postId) => {
    fetch('/unlike', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId
      })
    })
      .then(res => res.json())
      .then(result => {
        const newData = posts.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setPosts(newData)
      })
  }

  const likePost = (postId, likes) => {
    if (!likes.includes(state._id)) {
      fetch('/like', {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        },
        body: JSON.stringify({
          postId
        })
      })
        .then(res => res.json())
        .then(result => {
          const newData = posts.map(item => {
            if (item._id == result._id) {
              return result
            } else {
              return item
            }
          })
          setPosts(newData)
        })
    }
  }

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId,
        text
      })
    }).then(res => res.json())
      .then(result => {
        const newData = posts.map(item => {
          if (item._id == result._id) {
            return result
          } else {
            return item
          }
        })
        setPosts(newData)
      }).catch(err => {
        console.log(err)
      })
  }
  return (
    <>
      <div className="container">
        {
          posts ?
            posts.map(item => {
              return (
                <div className="card postcard" key={item._id}>
                  <div className="showDetails">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                        <img src={item.postedBy.photo} className="postBy circle" alt="photo" />
                      </Link>
                      <Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>
                        <span>{item.postedBy.name}</span>
                      </Link>
                    </div>
                  </div>
                  <div className="card-image" style={{ borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray" }}>
                    <img src={item.photo} onDoubleClick={() => likePost(item._id, item.likes)} />
                  </div>
                  <div className="card-content">
                    <div style={{ display: "flex" }}>
                      {item.likes.includes(state._id)
                        ?
                        <i className="material-icons"
                          style={{ marginRight: "5px", color: "red", cursor: "pointer" }}
                          onClick={() => { unlikePost(item._id) }}
                        >favorite</i>
                        :
                        <i className="material-icons"
                          onClick={() => { likePost(item._id, item.likes) }}
                          style={{ marginRight: "5px", cursor: "pointer" }}
                        >favorite_border</i>

                      }
                      <Link to={`/post/${item._id}`} style={{ cursor: "pointer" }}><i className="material-icons">comment</i></Link>
                    </div>
                    <p>{item.likes.length} likes</p>
                    <p><b>{item.postedBy.name}</b>  {item.caption}</p>
                    <p style={{ fontSize: "13px", color: "grey" }}>{item.comments.length > 0 ? "Comments" : ""}</p>
                    {
                      item.comments.map((record, index) => {
                        if (index <= 2) {
                          return (
                            <div key={record._id} className="showCommentDetails">
                              <img src={record.postedBy.photo} className="commentBy circle" alt="photo" />
                              <span ><b>{record.postedBy.name}</b> {record.text}</span>
                            </div>
                          )
                        }
                      })
                    }
                    <Link to={`/post/${item._id}`}><span style={{ fontSize: "11px", color: "grey", cursor: "pointer" }}>{item.comments.length > 3 ? `View all ${item.comments.length} comments` : ""} </span></Link>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      makeComment(e.target[0].value, item._id)
                      e.target[0].value = ""
                    }}>
                      <div className="input-field">
                        <input placeholder="Add a Comment..." type="text" className="validate" />
                      </div>
                    </form>
                  </div>
                </div>
              )
            })
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