import React, { useState, useEffect } from 'react';
import '../../App.css';
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

export default function SignUp() {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPasword] = useState("")
    const [email, setEmail] = useState("")
    const [photo, setPhoto] = useState(undefined)
    const [image, setImage] = useState("")
    const [imageText, setImageText] = useState("Upload Profile Pic")
    const [imagePreview, setImagePreview] = useState(null)

    useEffect(() => {
        if (photo) {
            uploadFields();
        }
    }, [photo])

    useEffect(()=>{
        if(image){
            let reader = new FileReader();
            reader.onload = async function()
            {
                await setImagePreview(reader.result)
                setImageText("Change Profile Pic")
            }
            reader.readAsDataURL(image);
        }
    },[image])

    const uploadPic = () => {
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
                setPhoto(data.url)
            })
            .catch(err => {
                console.log(err)
            })
    }

    const uploadFields = () => {
        if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            // M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            alert("Invalid Email")
            return
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                photo
            })
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({html: data.error,classes:"#c62828 red darken-3"})
                }
                else {
                     M.toast({html:data.message,classes:"#43a047 green darken-1"})
                    history.push('/login')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const PostData = () => {
        if (image) {
            uploadPic()
        } else {
            uploadFields()
        }

    }
    return (
        <>
            <div className="container">
                <div className="card authcard">
                    <h3>Sign Up</h3>
                    {
                        imagePreview?
                            <img src={imagePreview} className="profile-preview circle"/>
                        :
                        undefined
                    }
                    <div className="input-field col s6">
                        <input id="Name" type="text" className="validate" value={name}
                            onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="Name">Name</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="Email" type="email" className="validate" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="Email">Email</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="password" type="password" className="validate" value={password}
                            onChange={(e) => setPasword(e.target.value)} />
                        <label htmlFor="password">Password</label>
                    </div>
                    <input type="file" id="file" onChange={(e) => setImage(e.target.files[0])} />
                    <label htmlFor="file" className="waves-effect waves-light btn #64b5f6 blue darken-1" style={{  marginRight: "10px" }}>{imageText}</label>
                    <button className="waves-effect waves-light btn #64b5f6 blue darken-1" onClick={() => PostData()}>Sign Up</button>
                    <h5><Link to="/login" className="link">Already have an account</Link></h5>
                </div>
            </div>
        </>
    )
}