import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import Logout from "./Logout";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { host } from "../utils/APIRoutes";
export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
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
    setMessages(response.data);
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

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem("chat-key")
    );
    const formData = new FormData();
    formData.append('photo', image);
    formData.append('from', data._id);
    formData.append('to', currentChat._id);
    formData.append('message', msg);
    const pic = await axios.post(sendMessageRoute, formData);
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
      image: pic.data.pic
    });
    const msgs = [...messages];
     msgs.push({ fromSelf: true, message: msg, image: pic.data.pic });
    setMessages(msgs);
  };
  const handleImage = (data) => {
    setImage(data);
  }
  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (data) => {
        setArrivalMessage({ fromSelf: false, message: data.msg, image: data.img });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container>
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
                  {message.image ? (<img className="content-image" src={`${host}/images/${message.image}`}></img>) : ("")}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} key={uuidv4()}></div>
      </div>
      <ChatInput handleSendMsg={handleSendMsg} handleImage={handleImage} />
    </Container>
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
