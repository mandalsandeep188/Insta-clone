import React, { useEffect, useContext, createContext, useReducer } from 'react';
import './App.css';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import SignUp from './components/screens/SignUp'
import LogIn from './components/screens/LogIn'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import FollowingPosts from './components/screens/FollowingPosts'
import Post from './components/screens/Post'
import Chats from './components/screens/Chats'
import {initialState,reducer} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {dispatch} = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user){
      dispatch({type:"USER",payload:user})
    }else{
         history.push('/login')
    }
  },[])
  return (
    <Switch>
      <Route path="/login">
        <LogIn />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/followingposts">
        <FollowingPosts />
      </Route>
      <Route path="/signup">
        <SignUp />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/post/:postid">
        <Post />
      </Route>
      <Route path="/chats">
        <Chats />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
