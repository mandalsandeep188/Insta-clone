import React, { useState, useEffect } from 'react';
import '../../App.css';
import { useHistory } from 'react-router-dom'
import M from 'materialize-css'

export default function CreatePost() {
    const [caption, setCaption] = useState("");
    const [photo, setPhoto] = useState("");
    const [image, setImage] = useState("")
    const [imageText, setImageText] = useState("Upload Image")
    const [imagePreview, setImagePreview] = useState(null)
    const history = useHistory()
    useEffect(() => {
        if (photo) {
            fetch('/createpost', {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify({
                    caption,
                    photo
                })
            }).then(res => res.json())
                .then(data => {

                    if (data.error) {
                          M.toast({html: data.error,classes:"#c62828 red darken-3"})
                    }
                    else {
                        M.toast({html:"Created post Successfully",classes:"#43a047 green darken-1"})
                        history.push('/')
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }, [photo])
    useEffect(()=>{
        if(image){
            let reader = new FileReader();
            reader.onload = async function()
            {
                await setImagePreview(reader.result)
                setImageText("Change Image")
            }
            reader.readAsDataURL(image);
        }
    },[image])

    const Postdata = () => {
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
    return (
        <>
            <div className="container">
                <div className="card authcard">
                    <h3>Create Post</h3>
                    {
                        imagePreview?
                            <>
                                <h6>Preview</h6>
                                <img src={imagePreview} className="preview"/>
                            </>
                        :
                        undefined
                    }
                    <input type="file" id="file" onChange={(e) => setImage(e.target.files[0])} />
                    <label htmlFor="file" className="waves-effect waves-light btn #64b5f6 blue darken-1" style={{ display: "block", width: "80%", margin: "5px auto" }}>{imageText}</label>
                    <div className="input-field col s6">
                        <input id="Caption" type="text" className="validate" value={caption}
                            onChange={(e) => setCaption(e.target.value)} />
                        <label htmlFor="Caption">Caption</label>
                    </div>
                    <button className="waves-effect waves-light btn #64b5f6 blue darken-1" onClick={() => Postdata()}>Post</button>
                </div>
            </div>
        </>
    )
}