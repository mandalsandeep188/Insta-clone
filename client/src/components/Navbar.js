import React, { useContext, useEffect } from 'react';
import '../App.css';
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App';
import M from 'materialize-css'

export default function Navbar() {
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()

  useEffect(()=>{
      var elems = document.querySelectorAll('.sidenav');
      var instances = M.Sidenav.init(elems, {});
  },[])

  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
          {
            state ?
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/chats">Chats</Link></li>
                <li><Link to="/followingposts">Following Posts</Link></li>
                <li><Link to="/createpost">Create Post</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li>
                  <button className="waves-effect waves-light btn #c62828 red darken-3"
                    onClick={() => {
                      localStorage.clear()
                      dispatch({ type: "CLEAR" })
                      history.push('/login')
                    }}
                        style={{ marginRight: "8px" }}
                      >
                        Logout
                  </button>
                </li>
              </ul>
              :
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Signup</Link></li>
              </ul>
          }
          <a href="#" data-target="slide-out" className="sidenav-trigger right"><i className="material-icons">menu</i></a>
        </div>
      </nav>
      {
        state?
          <ul id="slide-out" className="sidenav">
            <li><Link to={state ? "/" : "/login"} className="brand-logo" style={{fontSize:"2.1rem",fontWeight:"normal",paddingLeft:"20px"}}>Instagram</Link></li>
            <li><div className="divider"></div></li>
            <li><Link to="/chats">Chats</Link></li>
            <li><Link to="/followingposts">Following Posts</Link></li>
            <li><Link to="/createpost">Create Post</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li>
              <button className="waves-effect waves-light btn #c62828 red darken-3"
                onClick={() => {
                  localStorage.clear()
                  dispatch({ type: "CLEAR" })
                  history.push('/login')
                }}
                    style={{ marginLeft: "20px" }}
                  >
                    Logout
              </button>
            </li>
        </ul>
        :
        <ul id="slide-out" className="sidenav">
          <li><Link to={state ? "/" : "/login"} className="brand-logo" style={{fontSize:"2.1rem",fontWeight:"normal",paddingLeft:"20px"}}>Instagram</Link></li>
          <li><div className="divider"></div></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </ul>
      }
    </>
  )
}