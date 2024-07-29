import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useWebSocket from "react-use-websocket";
import cross from "./assets/cross.png";
import save from "./assets/save.png";
import send from "./assets/send.png";
import emoji from "./assets/emoji.svg";
import back from "./assets/back4.jpg";
import EmojiPicker from "emoji-picker-react";

const img = new Image();
img.src = back;

function App() {
  const [messages, setMessages] = useState([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [responseTo, setResponseTo] = useState(null);
  const [reconnectInterval, setReconnectInterval] = useState(3000); // Time in milliseconds for reconnection attempts
  const [emojiOpen, setEmojiOpen] = useState(false);
  const usernameRef = useRef(null);
  const mesBox = useRef();
  const inputBox = useRef();
  const prevUserRef = useRef("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonVis(false);
    const username = usernameRef.current.value;
    if (username !== localStorage.getItem("user")) {
      localStorage.setItem("user", username);
    }
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

  useEffect(() => {
    if (mesBox.current) {
      mesBox.current.scrollTop = mesBox.current.scrollHeight;
    }
    if (inputBox.current) {
      inputBox.current.scrollTop = inputBox.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (message) => {
    sendToSocket(message);
  };

  const [buttonVis, setButtonVis] = useState(true);

  const onEmojiClick = (event) => {
    setCurrentTyping((prev) => prev + event.emoji);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div
        ref={mesBox}
        className={`w-full lg:w-1/2 h-full scroll-smooth bg-center overscroll-none bg-cover overflow-y-scroll pt-20 ${
          responseTo ? "pb-36" : "pb-20"
        } p-5 flex flex-col gap-[2px]`}
        style={{
          backgroundImage: `url(${back})`,
        }}
      >
        {messages.map((message, index) => {
          const isDifferentUser = message.from !== prevUserRef.current;
          prevUserRef.current = message.from;
          return (
            <div key={index}>
              {isDifferentUser && <div className="w-full h-[6px]"></div>}
              <Message
                key={message.id}
                them={message.from !== localStorage.getItem("user")}
                from={message.from}
                text={message.text}
                time={message.time}
                responseTo={message.responseTo}
                setResponseTo={setResponseTo}
              />
            </div>
          );
        })}
      </div>

      <div className="fixed top-0 w-full lg:w-1/2 h-14 bg-gray-400">
        <div className="w-full h-full bg-white text-gray-800 text-lg px-3 flex items-center">
          <form className="w-full flex items-center" onSubmit={handleSubmit}>
            <input
              onFocus={() => {
                setButtonVis(true);
              }}
              type="text"
              ref={usernameRef}
              className="w-full pr-24 py-4 text-black pl-4 focus:outline-none bg-white h-full"
              placeholder="Enter your username..."
              defaultValue={localStorage.getItem("user")}
              name="username"
              id="username"
            />
            <button
              className={`${
                buttonVis ? "" : "hidden"
              } h-full text-center text-white px-5`}
              type="submit"
            >
              <img src={save} width={"35px"} alt="" />
            </button>
          </form>
        </div>
      </div>

      <div className="lg:w-[49%] w-[98%] h-14 m-1 absolute bottom-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmojiOpen(false);
            e.target.reset();
            if (!currentTyping.trim()) {
              setCurrentTyping("");
              return;
            }
            if (!localStorage.getItem("user")) {
              alert("Enter username first!");
              return;
            }
            const newMessage = {
              from: localStorage.getItem("user"),
              text: currentTyping,
              responseTo: responseTo,
              time: `${String(new Date().getHours()).padStart(2, "0")}:${String(
                new Date().getMinutes()
              ).padStart(2, "0")}`,
            };
            addMessage(newMessage);
            setCurrentTyping("");

            setResponseTo(null);
          }}
          className="w-full h-full rounded-xl"
        >
          {responseTo && (
            <div className="w-30 py-2 content-center px-4 absolute bottom-full w-full rounded-xl text-black backdrop-blur-sm bg-opacity-90 bg-white">
              <p className="text-purple-600 text-xs mb-1">
                Reply to {responseTo.from}
              </p>
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
                <img src={cross} width={"35px"} alt="" />
              </div>
            </div>
          )}
          <input
            ref={inputBox}
            onChange={(e) => {
              setCurrentTyping(e.target.value);
            }}
            onFocus={() => {
              setEmojiOpen(false);
            }}
            value={currentTyping}
            type="text"
            className={`w-full text-wrap resize-none break-words rounded-xl pr-24 py-4 ${
              currentTyping[0] === "/" ? "text-blue-700 " : "text-black "
            } pl-4 focus:outline-none bg-white h-full`}
            placeholder="Type your message..."
          />
          <button
            className="hidden md:absolute right-20 h-full w-10 content-center text-black"
            type="button"
            onClick={() => setEmojiOpen(!emojiOpen)}
          >
            <img src={emoji} width={"35px"} className="mx-auto" alt="" />
          </button>
          {emojiOpen && (
            <div className="absolute mb-1 max-w-[100%] bottom-full right-0">
              <EmojiPicker
                open={emojiOpen}
                skinTonesDisabled
                searchDisabled
                onEmojiClick={onEmojiClick}
                onBlur={() => {
                  setEmojiOpen(false);
                }}
                previewConfig={{
                  showPreview: false,
                }}
              />
            </div>
          )}
          <button
            className="absolute right-0 h-full w-20 text-black"
            type="submit"
          >
            <img src={send} width={"35px"} className="mx-auto" alt="" />
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
