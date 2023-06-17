import React, { useState, useRef, useEffect } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ChatInput({ handleSendMsg, handleImage, setpic }) {
  const toastOptions = {
    position: "bottom-right",
    autoClose: "5000",
    pauseOnHover: true,
    theme: "dark",
    draggable: true
  }
  const [imgbtn, setImgbtn] = useState("Send Image")
  const fileInputRef = useRef(null);
  const [msg, setMsg] = useState("");
  const [photo, setPhoto] = useState('');
  const sendChat = (event) => {
    event.preventDefault();
    if (photo && msg.length) {
      setMsg("");
      setPhoto("");
      setImgbtn("Send Image");
      return toast.warning("Please send text or image at a time", toastOptions);
    }
    if (msg.length > 0 || photo) {
      handleSendMsg(msg);
      setMsg("");
    }
  };
  const handlePhoto = (e) => {
    setpic();
    console.log(e.target.files[0]);
    setPhoto(e.target.files[0]);
    setImgbtn(e.target.files[0].name);
    handleImage(e.target.files[0]);
  }
  const handleChooseImage = () => {
    if (msg) {
      toast.warning("Please send text or image at a time", toastOptions);
    }
    else
      fileInputRef.current.click();
  };
  return (
    <Container>
      <form className="input-container" onSubmit={(event) => sendChat(event)} encType='multipart/form-data'>
        <input type="file" onChange={handlePhoto} ref={fileInputRef} style={{ display: 'none' }} />
        <div className="imgclick" onClick={handleChooseImage}><span>{imgbtn}</span></div>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  // grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
  }
  .input-container {
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    // position:relative;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    .imgclick{
      padding: 0.3rem 2rem;
      width:10%;
      border-radius: 2rem;
      height:60%;
      font-size: 1rem;
      background-color: #9a86f3;
      border: none;
      cursor:pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      cursor:pointer;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
`;
