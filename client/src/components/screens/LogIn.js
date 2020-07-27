import React, { useState,  useContext} from 'react';
import {Link,useHistory} from 'react-router-dom'
import '../../App.css';
import { UserContext } from '../../App';
import M from 'materialize-css'

export default function LogIn() {
    const history = useHistory()
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const {dispatch} = useContext(UserContext)

    const PostData = ()=>{
        if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
           if(data.error){
              M.toast({html: data.error,classes:"#c62828 red darken-3"})
           }
           else{
               localStorage.setItem("jwt",data.token)
               localStorage.setItem("user",JSON.stringify(data.user))
               dispatch({type:"USER",payload:data.user})
               M.toast({html:"signedin success",classes:"#43a047 green darken-1"})
               history.push('/')
           }
        }).catch(err=>{
            console.log(err)
        })
    }

    return (
        <div className="container">
            <div className="card authcard">
                <h3>Log In</h3>
                <div className="input-field col s6">
                    <input id="Email" type="text" className="validate" value={email}
            onChange={(e)=>setEmail(e.target.value)}/>
                    <label htmlFor="Email">Email</label>
                </div>
                <div className="input-field col s6">
                    <input id="password" type="password" className="validate" value={password}
            onChange={(e)=>setPasword(e.target.value)}/>
                    <label htmlFor="password">Password</label>
                </div>
                <button className="waves-effect waves-light btn #64b5f6 blue darken-1" onClick={()=>PostData()}>Log in</button>
                <h5><Link to="/signup" className="link">Create new account</Link></h5>
            </div>
        </div>
    )
}