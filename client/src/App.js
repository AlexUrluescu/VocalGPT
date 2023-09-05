import "./App.css";
import io from "socket.io-client";
import { useState, useEffect } from "react";
// import Typewriter from "./Typewriter";
import Typewriter from "typewriter-effect";

const url = "http://localhost:5000";

const socket = io.connect(url, {
  transports: ["websocket", "polling"],
});

function App() {
  const [chatMessages, setChatMessages] = useState([]);
  const [botMessage, setBotMessage] = useState({ role: "", message: "" });
  const [userMessage, setUserMessage] = useState({ role: "", message: "" });

  useEffect(() => {
    socket.on("userSocket", (data) => {
      console.log(data);
      setUserMessage(data);
    });

    socket.on("chatSocket", (data) => {
      console.log(data);

      setBotMessage(data);
    });
  }, []);

  useEffect(() => {

    const fetchUserSocket = () => {
      try {
        socket.on("userSocket", (data) => {
          if (data.message === "") {
            return;
          }
          console.log(data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    const fetchBotSocket = () => {
      try {
        socket.on("chatSocket", (data) => {
          if (data.message === "") {
            return;
          }
          setBotMessage(data);
          console.log(data);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserSocket();
    fetchBotSocket();
  }, []);

  useEffect(() => {
    if (botMessage.message === "") {
      return;
    }
    setChatMessages((prevData) => [...prevData, botMessage]);
  }, [botMessage]);

  useEffect(() => {
    if (userMessage.message === "") {
      return;
    }
    setChatMessages((prevData) => [...prevData, userMessage]);
  }, [userMessage]);

  return (
    <div className="App">
      <div className="chat">
        {chatMessages.map((user, index) => (
          <div key={index}>
            {user.message === "" ? (
              <div></div>
            ) : (
              <div>
                {user.role === "user" ? (
                  <div className="all_user_messages">
                    <div className="empty"></div>
                    <div className="userContent">
                      <div className="userMessage">
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter.typeString(user.message).start();
                          }}
                          options={{
                            delay: 50,
                          }}
                        />
                      </div>
                      <div className="userTime">{user.time}</div>
                    </div>
                  </div>
                ) : (
                  <div className="all_bot_messages">
                    <div className="empty"></div>
                    <div className="botContent">
                      <div className="botMessage">
                        <Typewriter
                          onInit={(typewriter) => {
                            typewriter.typeString(user.message).start();
                          }}
                          options={{
                            delay: 50,
                          }}
                        />
                      </div>
                      <div className="botTime">{user.time}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
