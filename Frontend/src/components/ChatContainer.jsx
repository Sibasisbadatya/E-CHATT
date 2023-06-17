import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import loader from "../assets/loader.gif";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute, downloadFileRoute } from "../utils/APIRoutes";
import { host } from "../utils/APIRoutes";
export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const [isPic, setIsPic] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [image, setImage] = useState('');
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem("chat-key")
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    // console.log("responce", response.data);
    setMessages(response.data);
    setIsLoading(false);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem("chat-key")
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);
  const setPic = () => {
    setIsPic(true);
  }
  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem("chat-key")
    );
    const formData = new FormData();
    formData.append('photo', image);
    formData.append('from', data._id);
    formData.append('to', currentChat._id);
    formData.append('message', msg);
    setIsLoading(true);
    const pic = await axios.post(sendMessageRoute, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setIsLoading(false);
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      image: pic.data.pic,
      type: pic.data.type,
      Oname: pic.data.Oname
    });
    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg, image: pic.data.pic, type: pic.data.type, Oname: pic.data.Oname });
    setMessages(msgs);
  };
  const handleImage = (data) => {
    setImage(data);
  }
  console.log(messages);
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.msg, image: data.img, type: data.type, Oname: data.Oname });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const downloadFile = async (data) => {
    // data.preventDefault();
    // console.log("yes");
    console.log(data);
    const response = await axios.get(`${downloadFileRoute}/${data}`);
    const downloadLink = document.createElement('a');
    downloadLink.href = `${downloadFileRoute}/${data}`;
    downloadLink.download = data;
    downloadLink.click();
  }

  return (
    <>
      {
        isLoading && isPic ?
          (
            <Container>
              <b style={{ color: "yellow", top: "30vh", margin: "auto" }}>Loading ...</b>
            </Container>
          )
          :
          (
            < Container >
              <div className="chat-header">
                <div className="user-details">
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <h3>{currentChat.username}</h3>
                  </div>
                </div>
                <Logout />
              </div>
              <div className="chat-messages">
                {messages.map((message) => {
                  return (
                    <div ref={scrollRef} key={uuidv4()}>
                      <div
                        className={`message ${message.fromSelf ? "sended" : "recieved"
                          }`}
                      >
                        <div className="content ">
                          <p>{message.message}</p>
                          {message.type == "image/jpeg" ? (
                            <>
                              <img className="content-image" src={`${message.image}`}></img>
                            </>
                          ) : (
                            <>
                              <div style={{ height: "50px", width: "300px" }}>
                                <span>{message.Oname}</span><br></br>
                                <button onClick={() => downloadFile(message.Oname)} >Download</button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={scrollRef} key={uuidv4()}></div>
              </div>
              <ChatInput handleSendMsg={handleSendMsg} handleImage={handleImage} setpic={setPic} />
            </ Container>
          )
      }
    </>
  );
}

const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    box-sizing:border-box;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        box-sizing:border-box;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        height:auto
        max-width: 40%;
        background-color: #4f04ff21;
      }
      .content-image{
        height:100%;
        width:100%;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        height:auto
        max-width: 40%;
        background-color: #9900ff20;
      }
      .content-image{
        height:100%;
        width:100%;
      }
    }
  }
`;
