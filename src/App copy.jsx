import { useState, useRef, useEffect } from "react";

const MessageMe = ({ from, text }) => {
  return (
    <div className=" flex justify-end">
      <div className=" backdrop-blur-lg shadow-md bg-opacity-70 bg-white text-gray-700 px-3 py-3 rounded-xl max-w-80 min-w-32">
        <p className="text-sm text-green-600">{from}</p>
        <p className="">{text}</p>
      </div>
    </div>
  );
};

const MessageThem = ({ from, text }) => {
  return (
    <div className="flex justify-start">
      <div className=" backdrop-blur-lg shadow-md bg-opacity-70 bg-white text-gray-700 px-3 py-3 rounded-xl max-w-80 min-w-32">
        <p className="text-sm text-purple-500">{from}</p>
        <p className="">{text}</p>
      </div>
    </div>
  );
};

function App() {
  const [messages, setMessages] = useState([
    {
      from: "Bot",
      text: "Hi, do you need help?",
    },
   
  ]);
  const [typed, setTyped] = useState('');
  const mesBox = useRef();

  useEffect(() => {
    mesBox.current.scrollTop = mesBox.current.scrollHeight;
  }, [messages]);

  const responses = {
    gay: "Сам гей! охуел??",
    hello: "Hi there! How can I assist you today?",
    hi: "Hello! How can I help you?",
    hey: "Hey! What's up?",
    help: "Sure, I'm here to help! What do you need assistance with?",
    thanks: "You're welcome! Glad to be of assistance.",
    thank: "You're welcome! Happy to help.",
    bye: "Goodbye! Have a great day!",
    goodnight: "Goodnight! Sleep well.",
    morning: "Good morning! How's your day starting?",
    afternoon: "Good afternoon! How can I assist you?",
    evening: "Good evening! How was your day?",
    how: "I'm doing great, thanks for asking! How can I help you today?",
    what: "Could you please provide more details on what you're asking?",
    time: "The current time is: " + new Date().toLocaleTimeString(),
    date: "Today's date is: " + new Date().toLocaleDateString(),
    weather: "Sorry, I can't provide the weather update right now.",
    joke: "Why don't scientists trust atoms? Because they make up everything!",
    hobby: "I love learning new things and helping people with their questions!",
    favorite: "That's a tough one! I enjoy many things. What's your favorite?",
    food: "I'm a virtual assistant, so I don't eat, but I hear pizza is quite popular!",
    color: "I like all colors, but blue is often a favorite among many people.",
    movie: "I don't watch movies, but I've heard 'Inception' is a good one!",
    book: "There are so many great books! Do you have a favorite genre?",
    music: "I enjoy all kinds of music! What about you?",
    sport: "I think soccer is very popular around the world. Do you have a favorite sport?",
    travel: "Traveling sounds fun! Any favorite destinations?",
    game: "Video games are quite popular. Do you have a favorite game?",
  };
  
  const generateResponse = (message) => {
    const wordList = message.text.toLowerCase().split(" ");
    console.log(wordList);
  
    for (const word of wordList) {
      if (responses[word]) {
        return responses[word];
      }
    }
  
    return "I don't know how to answer that.";
  };

  const addMessage = (message) => {
    const response = {
      from: "Bot",
      text: generateResponse(message.text)
    }
    setMessages([ ...messages, message]);
    setTimeout(()=>{setMessages([ ...messages, message, response]);}, 1000)
    
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div ref={mesBox} className="w-full lg:w-1/2 relative h-full py-20 bg-back5 bg-center bg-cover overflow-y-auto scroll-smooth bg-gray-100 p-4 flex flex-col gap-2">
        {messages.map((message) => {
          if (message.from == "Dias Sagatov") {
            return <MessageMe from={message.from} text={message.text} />;
          } else {
            return <MessageThem from={message.from} text={message.text} />;
          }
        })}
      </div>
      <div className="fixed top-0 w-full lg:w-1/2 h-14 bg-gray-400">
        <div className="w-full h-full bg-white text-gray-800 text-lg px-3 flex items-center">
          User Support Bot
        </div>
      </div>
      <div className="fixed bottom-0 w-full lg:w-1/2 h-14 bg-gray-400">
        <form
          className="w-full h-full relative"
          onSubmit={(e) => {
            e.preventDefault();
            addMessage({from: "Dias Sagatov", text: typed});
            setTyped('')
          }}
        >
          <input
            name="message"
            id="message"
            type="text"
            className="w-full from-fuchsia-50 h-full bg-white text-gray-800 text-lg px-5 focus:outline-none"
            placeholder="Type a messsage"
            value={typed}
            onChange={(e)=>{setTyped(e.target.value)}}
            autoComplete="off"
            />
          <button
            type="submit"
            className="absolute h-full w-20 bg-blue-400 right-0 text-black"
          >
            GO!
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
