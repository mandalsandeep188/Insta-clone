import React, { useState, useEffect, useContext } from "react";
import "../../App.css";
import { UserContext } from "../../App";
const firebase = require("firebase");
var firebaseConfig = {
  apiKey: "AIzaSyCzM7lDw6EJPdB2EF9fu-N5c7RqUXsSjEI",
  authDomain: "insta-chat-8d451.firebaseapp.com",
  databaseURL: "https://insta-chat-8d451.firebaseio.com",
  projectId: "insta-chat-8d451",
  storageBucket: "insta-chat-8d451.appspot.com",
  messagingSenderId: "874511044007",
  appId: "1:874511044007:web:eb531fc83a868961673a82"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const Message = (props) => {
  return <div className={`message ${props.position}`}>{props.message}</div>;
};

export default function Chats() {
  const { state, dispatch } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [friend, setFriend] = useState(null);
  const [docKey, setKey] = useState(null);
  const [messageFrom, setMessageFrom] = useState(null);
  const [conversation, setConversation] = useState([]);

  const buildChatKey = (friend) => {
    let key = [friend, state._id].sort().join(":");
    return key;
  }
  const selectFriend = (id) => {
    const li_object = document.querySelectorAll("li.following-user");
    for (const key in li_object) {
      if (li_object.hasOwnProperty(key)) {
        const element = li_object[key];
        element.style.backgroundColor = "white";
      }
    }
    document.getElementById(id).style.backgroundColor = "whitesmoke";
    setFriend(id);
  };

  useEffect(() => {
    if (friend) {
      let key = buildChatKey(friend);

      db.collection("chats").doc(key).get()
        .then(async data => {
          let conversation = data.data();
          if (conversation === undefined) {
            await db.collection("chats").doc(key).set({
              conversation: []
            })
            setConversation([])
          }
        })
        .catch(err => console.log(err))
      setKey(key);
    }
  }, [friend]);


  useEffect(() => {
    if (docKey) {
      db.collection("chats").doc(docKey).onSnapshot(async snapshot => {
        await setMessageFrom(docKey)
        if (snapshot.data()) {
          await setConversation(snapshot.data().conversation);
          let objDiv = document.getElementsByClassName("chats")[0];
          objDiv.scrollTop = objDiv.scrollHeight;
        }
      })
    }
  }, [docKey])

  const sendMessage = async () => {
    if (docKey) {
      await db.collection("chats").doc(docKey).update(
        {
          conversation: firebase.firestore.FieldValue.arrayUnion({
            message: message,
            sender: state._id,
            time: Date.now()
          })
        }
      )
      let objDiv = document.getElementsByClassName("chats")[0];
      objDiv.scrollTop = objDiv.scrollHeight;
    }
    setMessage("");
  };
  return (
    <div className="card chat-card row">
      <div className="following-list-mobile col s12">
        <h5 style={{ textAlign: "center" }}>Your Followings</h5>
        <ul className="collection" style={{ margin: "0px",display:"flex"}}>
          {state ? (
            state.following.map((user) => {
              return (
                <li
                  id={user._id}
                  key={user._id}
                  className="collection-item avatar following-user"
                  onClick={(e) => selectFriend(user._id)}
                >
                  <img className="circle" src={user.photo} />
                  <span className="title">{user.name}</span>
                </li>
              );
            })
          ) : (
              <li className="collection-item avatar following-user">
                {" "}
              Loading...{" "}
              </li>
            )}
        </ul>
      </div>
      <div className="following-list col s3">
        <h5 style={{ textAlign: "center" }}>Your Followings</h5>
        <ul className="collection" style={{ margin: "0px" }}>
          {state ? (
            state.following.map((user) => {
              return (
                <li
                  id={user._id}
                  key={user._id}
                  className="collection-item avatar following-user"
                  onClick={(e) => selectFriend(user._id)}
                >
                  <img className="circle" src={user.photo} />
                  <span className="title">{user.name}</span>
                </li>
              );
            })
          ) : (
              <li className="collection-item avatar following-user">
                {" "}
              Loading...{" "}
              </li>
            )}
        </ul>
      </div>
      <div className="chat-box col s9">
        <h5 style={{ textAlign: "center" }}>Chats</h5>
        <div className="chats">
          <h6 style={{ textAlign: "center" }}>You Can Send Messages here </h6>
          {state && docKey === messageFrom ? (
            conversation.map((msg) => {
              return (
                <Message
                  key={msg.time}
                  position={msg.sender == state._id ? "rightmsg" : "leftmsg"}
                  message={msg.message}
                />
              );
            })
          ) : (
              undefined
            )}
        </div>
        {friend ? (
          <div className="row">
            <form
              className="col s12"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <div className="row send">
                <div className="input-field col s11">
                  <input
                    placeholder="Message..."
                    type="text"
                    className="validate"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="col s1">
                  <i
                    className="material-icons"
                    style={{ marginTop: "25px", cursor: "pointer" }}
                    onClick={() => sendMessage()}
                  >
                    send
                  </i>
                </div>
              </div>
            </form>
          </div>
        ) : undefined}
      </div>
    </div>
  );
}