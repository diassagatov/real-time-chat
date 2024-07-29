import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useWebSocket from "react-use-websocket";

function App() {
  const [messages, setMessages] = useState([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [responseTo, setResponseTo] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const usernameRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentUser(usernameRef.current.value);
  };

  // WebSocket related stuff
  const [socketUrl] = useState("ws://localhost:8082");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

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
    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    sendToSocket(message);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        ref={mesBox}
        className={`w-full lg:w-1/2 h-full scroll-smooth bg-back3 bg-center bg-cover overflow-y-scroll pt-20 ${
          responseTo ? "pb-36" : "pb-20"
        } bg-gray-100 p-5 flex flex-col gap-4`}
      >
        {messages.map((message, index) => (
          <Message
            key={index}
            them={message.from != currentUser}
            from={message.from}
            text={message.text}
            responseTo={message.responseTo}
            setResponseTo={setResponseTo}
          />
        ))}
      </div>

      <div className="fixed top-0 w-full lg:w-1/2 h-14 bg-gray-400">
        <div className="w-full h-full bg-white text-gray-800 text-lg px-3 flex items-center">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              ref={usernameRef}
              className="w-full pr-24 py-4 text-black pl-4 focus:outline-none bg-white h-full"
              placeholder="Enter your username..."
              name="username"
              id="username"
            />
            <button
              className="absolute right-0 bg-green-600 h-full w-14 text-black"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      </div>

      <div className="lg:w-[49%] w-[98%] h-14 m-1 absolute bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const newMessage = {
              from: currentUser,
              text: currentTyping,
              responseTo: responseTo,
            };
            addMessage(newMessage);
            setCurrentTyping("");
            setResponseTo(null);
          }}
          className="w-full h-full rounded-xl"
        >
          {responseTo && (
            <div className="w-30 py-2 content-center px-4 absolute bottom-full w-full rounded-xl text-black backdrop-blur-sm bg-opacity-90 bg-white">
              <p className="text-purple-600 ">Reply to {responseTo.from}</p>
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
                Cancel
              </div>
            </div>
          )}
          <textarea
            ref={inputBox}
            onChange={(e) => {
              setCurrentTyping(e.target.value);
            }}
            value={currentTyping}
            type="text"
            className="w-full text-wrap resize-none break-words rounded-xl pr-24 py-4 text-black pl-4 focus:outline-none bg-white h-full"
            placeholder="Type your message..."
          />
          <button
            className="absolute right-0 h-full w-14 text-black"
            type="submit"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
