import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Logo from "../assets/logo.svg";
import axios from "axios";
import { SearchbynameRoute } from "../utils/APIRoutes";
export default function Contacts({ contacts, changeChat, update }) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);
  const [sname, setSname] = useState("");
  const [scontacts, setScontacts] = useState([]);
  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem("chat-key")
    );
    setCurrentUserName(data.username);
    setCurrentUserImage(data.avatarImage);
  }, []);

  // console.log(contacts);
  const searchName = async (e) => {
    e.persist();
    console.log(e.target.value);
    const nam = e.target.value;
    // setTimeout(async () => {
      setSname(nam);
      const { data } = await axios.post(SearchbynameRoute, {
        sname: e.target.value
      });
      setScontacts(data.sdata);

  }

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };
  return (
    <>
      {currentUserImage && currentUserImage && (
        <Container>
          <div className="brand">
            <h3>E-CHATT</h3>
          </div>
          <div className="search-box" style={{ position: "relative", display: "flex", justifyContent: "center", marginBottom: '5px' }} >
            <input type="text" onChange={searchName} value={sname} placeholder="search by name and add ' . ' in last" style={{ height: "100%", width: "90%" }} />
          </div>
          {scontacts && scontacts.length > 0 ? (
            <div className="contacts">
              {
                scontacts.map((contact, index) => {
                  return (
                    <div
                      key={contact._id}
                      className={`contact ${index === currentSelected ? "selected" : ""
                        }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt=""
                        />
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          ) : (
            <div className="contacts">
              {
                contacts.map((contact, index) => {
                  return (
                    <div
                      key={contact._id}
                      className={`contact ${index === currentSelected ? "selected" : ""
                        }`}
                      onClick={() => changeCurrentChat(index, contact)}
                    >
                      <div className="avatar">
                        <img
                          src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                          alt=""
                        />
                      </div>
                      <div className="username">
                        <h3>{contact.username}</h3>
                      </div>
                    </div>
                  );
                })
              }
            </div>
          )
          }

          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 7% 65% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 2rem;
    }
    h3 {
      color: white;
      text-transform: uppercase;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-self:flex-start;
    align-items: center;
    overflow: auto;
    gap: 0.8rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 3rem;
      cursor: pointer;
      width: 90%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: 1rem;
      align-items: center;
      transition: 0.5s ease-in-out;
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
    .selected {
      background-color: #9a86f3;
    }
  }

  .current-user {
    background-color: #0d0d30;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .avatar {
      img {
        height: 4rem;
        max-inline-size: 100%;
      }
    }
    .username {
      h2 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h2 {
          font-size: 1rem;
        }
      }
    }
  }
`;
