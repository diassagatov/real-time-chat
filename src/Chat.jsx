import { useState, useRef, useEffect } from "react";
import Message from "./Message";
import useWebSocket from "react-use-websocket";
import cross from "./assets/cross.png";
import send from "./assets/send.png";
import emoji from "./assets/emoji.svg";
import EmojiPicker from "emoji-picker-react";
import { useParams, Link } from 'react-router-dom';

import back1 from './assets/watermelon.jpg'
import back2 from './assets/prison.jpg'
import back3 from './assets/cats.jpg'
import back4 from './assets/girls.jpg'
import back5 from './assets/money.jpg'
import back6 from './assets/run.jpg'

import menu from './assets/menu.svg'

function Chat() {
  const [messages, setMessages] = useState([]);
  const [currentTyping, setCurrentTyping] = useState("");
  const [responseTo, setResponseTo] = useState(null);
  const [reconnectInterval, setReconnectInterval] = useState(3000); // Time in milliseconds for reconnection attempts
  const [emojiOpen, setEmojiOpen] = useState(false);
  let {id} = useParams();
  const mesBox = useRef();
  const inputBox = useRef();
  const prevUserRef = useRef("");

  let back = back1;
  let name = 'Chat'
  switch(id){
    case '1':
      back = back1;
      name = 'Элита'
      break;
    case '2':
      back = back2;
      name = 'Забытые Богом дее'
      break;
    case '3':
      back = back3;
      name = 'Мяу-Мяу мяу-мяу🎶'
      break;
    case '4':
      back = back4;
      name = 'wHo RuN thE WorlD? Girls!'
      break;
    case '5':
      back = back5;
      name = 'Бесплатный онлайн вебинар'
      break;
    case '6':
      back = back6;
      name = 'Тгдк-тгдк тгдк-тгдк шабамыыын'
      break;
  }

  const img = new Image();
  img.src = back;

  // WebSocket related stuff
  const [socketUrl] = useState("wss://nutritious-faint-gardenia.glitch.me/");
  // const [socketUrl] = useState("http://localhost:3000/");
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log("WebSocket connection established");
      sendMessage(JSON.stringify({
        event: 'connect',
        user: localStorage.getItem('user'),
        chatID: id
      }));
    },
    onClose: () => {
      console.log("WebSocket connection closed");
      sendMessage(JSON.stringify({
        event: 'disconnect',
        user: localStorage.getItem('user'),
        chatID: id
      }));
    },
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
  }, [currentTyping, messages]);

  const addMessage = (message) => {
    sendToSocket(message);
  };  

  const onEmojiClick = (event) => {
    setCurrentTyping((prev) => prev + event.emoji);
  };

  return (
    <div
      className="h-screen flex flex-col bg-cover  bg-center  w-full lg:w-1/2 justify-center items-center"
      style={{
        backgroundImage: `url(${back})`,
      }}
    >
      <div className="w-full h-14 bg-gray-400">
        <div className="w-full h-full bg-white text-black text-lg px-3 flex gap-6 items-center">
            <Link to="/"><img src={menu} width={'20px'} alt="" /></Link>{name}
        </div>
      </div>

      <div
        ref={mesBox}
        className={`w-full h-full flex-grow scroll-smooth overscroll-none  overflow-y-scroll ${
          responseTo ? "pb-16" : ""
        } p-5 flex flex-col gap-[2px]`}
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

      <div className="w-full h-14 relative">
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
              event: 'message',
              chatID: id,
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
          className="w-full rounded-xl"
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

          <textarea
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.target.form.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true })
                );
              }
            }}
            ref={inputBox}
            onChange={(e) => {
              setCurrentTyping(e.target.value);
            }}
            onFocus={() => {
              setEmojiOpen(false);
            }}
            value={currentTyping}
            type="text"
            className={`w-full appearance-none text-wrap resize-none break-words rounded-xl pr-24 py-4 ${
              currentTyping[0] === "/" ? "text-blue-700 " : "text-black "
            } pl-4 focus:outline-none bg-white`}
            placeholder="Type your message..."
          />
          <button
            className="hidden md:block md:absolute right-20 top-0 h-full w-10 content-center text-black"
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

export default Chat;
