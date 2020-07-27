import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory, Link } from 'react-router-dom'
import '../../App.css';
import { UserContext } from '../../App';

export default function Post() {
    const [post, setPost] = useState(null)
    const { state, dispatch } = useContext(UserContext)
    const { postid } = useParams()
    const history = useHistory()
    useEffect(() => {
        fetch(`/post/${postid}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(post => {
                setPost(post)
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
                setPost(result)
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
                    setPost(result)
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
                setPost(result)
            })
            .catch(err => {
                console.log(err)
            })
    }
    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => {
            alert("Post Deleted")
            history.push('/')
        })
    }

    return (
        <>
            {
                post ?
                    <div className="container">
                        <div className="card postcard" key={post._id}>
                            <div className="showDetails">
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <Link to={post.postedBy._id !== state._id ? "/profile/" + post.postedBy._id : "/profile"}>
                                        <img src={post.postedBy.photo} className="postBy circle" alt="photo" />
                                    </Link>
                                    <Link to={post.postedBy._id !== state._id ? "/profile/" + post.postedBy._id : "/profile"}>
                                        <span>{post.postedBy.name}</span>
                                    </Link>
                                </div>
                                {post.postedBy._id == state._id ? <div style={{ cursor: "pointer" }}> <i className="material-icons"
                                    onClick={() => deletePost(post._id)}>delete</i></div> : undefined
                                }
                            </div>
                            <div className="card-image" style={{ borderTop: "1px solid lightgray", borderBottom: "1px solid lightgray" }}>
                                <img src={post.photo} onDoubleClick={() => likePost(post._id, post.likes)} />
                            </div>
                            <div className="card-content">
                                <div style={{ display: "flex" }}>
                                    {post.likes.includes(state._id)
                                        ?
                                        <i className="material-icons"
                                            style={{ marginRight: "5px", color: "red", cursor: "pointer" }}
                                            onClick={() => { unlikePost(post._id) }}
                                        >favorite</i>
                                        :
                                        <i className="material-icons"
                                            onClick={() => { likePost(post._id, post.likes) }}
                                            style={{ marginRight: "5px", cursor: "pointer" }}
                                        >favorite_border</i>

                                    }
                                </div>
                                <p>{post.likes.length} likes</p>
                                <p><b>{post.postedBy.name}</b>  {post.caption}</p>
                                <p style={{ fontSize: "13px", color: "grey" }}>{post.comments.length > 0 ? "Comments" : ""}</p>
                                {
                                    post.comments.map((record, index) => {
                                        return (
                                            <div key={record._id} className="showDetails">
                                                <img src={record.postedBy.photo} className="commentBy" alt="photo" />
                                                <span ><b>{record.postedBy.name}</b> {record.text}</span>
                                            </div>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    makeComment(e.target[0].value, post._id)
                                    e.target[0].value = ""
                                }}>
                                    <div className="input-field">
                                        <input placeholder="Add a Comment..." type="text" className="validate" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="preloader-wrapper big active">
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
        </>
    )
}