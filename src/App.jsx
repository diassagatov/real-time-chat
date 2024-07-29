import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useWebSocket from "react-use-websocket";
import cross from './assets/cross.png'
import save from './assets/save.png'
import send from './assets/send.png'
import back from './assets/back4.jpg'

function App() {
  const [messages, setMessages] = useState([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [responseTo, setResponseTo] = useState(null);
  const [reconnectInterval, setReconnectInterval] = useState(3000); // Time in milliseconds for reconnection attempts
  const usernameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonVis(false);
    localStorage.setItem('user', usernameRef.current.value);
  };

  // WebSocket related stuff
  const [socketUrl] = useState("wss://nutritious-faint-gardenia.glitch.me/");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log("WebSocket connection established"),
    onClose: () => console.log("WebSocket connection closed"),
    onError: (error) => console.error("WebSocket error:", error),
    shouldReconnect: () => true, // Enable automatic reconnection
    reconnectInterval, // Interval for reconnection attempts
  });

  useEffect(() => {
    if (lastMessage !== null) {
      try {
        const newMessages = JSON.parse(lastMessage.data);
        setMessages(newMessages);
      } catch (e) {
        console.error("Failed to parse message data:", e);
      }
    }
  }, [lastMessage]);

  const sendToSocket = (data) => {
    sendMessage(JSON.stringify(data));
  };


  //related to socket

  const mesBox = useRef();
  const inputBox = useRef();

  useEffect(() => {
    if (mesBox.current) {
      mesBox.current.scrollTop = mesBox.current.scrollHeight;
    }
  }, [messages, responseTo]);

  useEffect(() => {
    if (inputBox.current) {
      inputBox.current.scrollTop = inputBox.current.scrollHeight;
    }
  }, [currentTyping]);

  const addMessage = (message) => {
    sendToSocket(message);
  };
  

  const [buttonVis, setButtonVis] = useState(true);

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        ref={mesBox}
        className={`w-full lg:w-1/2 h-full scroll-smooth bg-center bg-cover overflow-y-scroll pt-20 ${
          responseTo ? "pb-36" : "pb-20"
        } p-5 flex flex-col gap-4`}
        style={{
          backgroundImage: `url(${back})`
        }}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            them={message.from != localStorage.getItem('user')}
            from={message.from}
            text={message.text}
            time={message.time}
            responseTo={message.responseTo}
            setResponseTo={setResponseTo}
          />
        ))}
      </div>

      <div className="fixed top-0 w-full lg:w-1/2 h-14 bg-gray-400">
        <div className="w-full h-full bg-white text-gray-800 text-lg px-3 flex items-center">
          <form className="w-full flex items-center" onSubmit={handleSubmit}>
            <input
              onFocus={()=>{setButtonVis(true)}}
              type="text"
              ref={usernameRef}
              className="w-full pr-24 py-4 text-black pl-4 focus:outline-none bg-white h-full"
              placeholder="Enter your username..."
              value={localStorage.getItem('user')}
              name="username"
              id="username"
            />
            <button
              className={`${buttonVis?'':'hidden'} h-full text-center text-white px-5`}
              type="submit"
            >
              <img src={save} width={'35px'} alt="" />
            </button>
          </form>
        </div>
      </div>

      <div className="lg:w-[49%] w-[98%] h-14 m-1 absolute bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if(!currentTyping.trim()){
              setCurrentTyping("") 
              return
            }
              if(!localStorage.getItem('user')){
              alert("Enter username first!");
              return
            }
            const newMessage = {
              from: localStorage.getItem('user'),
              text: currentTyping,
              responseTo: responseTo,
              time: `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`
            };
            addMessage(newMessage);
            setCurrentTyping("");
            setResponseTo(null);
          }}
          className="w-full h-full rounded-xl"
        >
          {responseTo && (
            <div className="w-30 py-2 content-center px-4 absolute bottom-full w-full rounded-xl text-black backdrop-blur-sm bg-opacity-90 bg-white">
              <p className="text-purple-600 text-xs mb-1">Reply to {responseTo.from}</p>
              <p className="border-l-2 pl-2 text-nowrap overflow-hidden mr-20 border-blue-600">
                {responseTo.text.substring(0, 70)}
                {responseTo.text.length > 70 && "..."}
              </p>
              <div
                onClick={() => {
                  setResponseTo(null);
                }}
                className="cursor-pointer absolute right-0 pr-4 top-0 h-full content-center w-30"
              >
                <img src={cross} width={'35px'} alt="" />
              </div>
            </div>
          )}
          <input
            ref={inputBox}
            onChange={(e) => {
              setCurrentTyping(e.target.value);
            }}
            value={currentTyping}
            type="text"
            className={`w-full text-wrap resize-none break-words rounded-xl pr-24 py-4 ${currentTyping[0] == '/'? "text-blue-700 ":"text-black " } pl-4 focus:outline-none bg-white h-full`}
            placeholder="Type your message..."
          />
          <button
            className="absolute right-0 h-full w-14 text-black"
            type="submit"
          >
            <img src={send} width={'35px'} alt="" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;