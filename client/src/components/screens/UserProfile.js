import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link} from 'react-router-dom'
import '../../App.css';
import { UserContext } from '../../App';

export default function Profile() {
  const { state, dispatch } = useContext(UserContext)
  const [userProfile, setUser] = useState(null)
  const { userid } = useParams()
  const follow = () =>{
    for (const user of state.following) {
      if(userid === user._id)
        return true;
    }
    return false;
  }
  const [showfollow, setShowFollow] = useState(true)
  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
      .then(res => res.json())
      .then(async data => {
        setUser(data)
      })
      .catch(err => console.log(err))
  }, [])

  const followUser = () => {
    fetch('/follow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        followId: userid
      })
    }).then(res => res.json())
      .then(data => {

        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))
        setUser((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id]
            }
          }
        })
        setShowFollow(false)
      })
  }
  const unfollowUser = () => {
    fetch('/unfollow', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('jwt')
      },
      body: JSON.stringify({
        unfollowId: userid
      })
    }).then(res => res.json())
      .then(data => {

        dispatch({ type: "UPDATE", payload: { following: data.following, followers: data.followers } })
        localStorage.setItem("user", JSON.stringify(data))

        setUser((prevState) => {
          const newFollower = prevState.user.followers.filter(item => item != data._id)
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower
            }
          }
        })
        setShowFollow(true)
      })
  }
  return (
    <>
      <div className="container">
        {
          userProfile?
            <>
              <div className="userDetails">
                <img src={userProfile.user.photo} alt="Profile Pic" className="pic circle" />
                <div className="details">
                  <div className="user">
                    <h4>{userProfile.user.name}</h4>
                    {(showfollow && !follow())?
                      <button className="waves-effect waves-light btn butn #64b5f6 blue darken-1" onClick={() => followUser()}>Follow</button>
                      :
                      <button className="waves-effect waves-light btn butn #64b5f6 blue darken-1" onClick={() => unfollowUser()}>Unfollow</button>
                    }
                  </div>
                  <h5>{userProfile.user.email}</h5>
                  <div className="userStats">
                    <h6>{userProfile.posts.length} Posts</h6>
                    <h6>{userProfile.user.followers.length} followers</h6>
                    <h6>{userProfile.user.following.length} following</h6>
                  </div>
                </div>
              </div>
              <div className="gallery">
                {
                  userProfile.posts.map(item => {
                    return (
                      <Link to={`/post/${item._id}`} style={{cursor:"pointer"}} key={item._id}><img src={item.photo} className="posts" /></Link>
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