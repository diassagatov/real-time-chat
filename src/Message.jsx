import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Emoji } from "emoji-picker-react";

const Message = ({ them, from, text, responseTo, time, setResponseTo }) => {
  const [translateX, setTranslateX] = useState(0);

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      if (eventData.dir === "Left") {
        setTranslateX(-eventData.absX);
      } else if (eventData.dir === "Right") {
        setTranslateX(0);
      }
    },
    onSwipedLeft: () => {
      setTranslateX(-20); // move slightly left
      setResponseTo({ from, text, time });
    },
    onSwipedRight: () => {
      setTranslateX(20); // move slightly left
      setResponseTo({ from, text, time });
    },
  });

  useEffect(() => {
    if (translateX !== 0) {
      setTimeout(() => setTranslateX(0), 100); // reset after animation
    }
  }, [translateX]);

  return (
    <div
      {...handlers}
      onContextMenu={(e)=>{e.preventDefault(); setResponseTo({ from, text, time });}}
      className={`flex ${them ? "justify-start" : "justify-end"}`}
      style={{ transform: `translateX(${translateX}px)`, transition: 'transform 0.3s ease-out' }}
    >
      <div className={`bg-white shadow-md backdrop-blur-sm bg-opacity-80 text-wrap text-gray-800 px-2 py-1 pr-10 max-w-80 rounded-lg`}>
        <p className={`text-wrap text-xs ${them ? "text-purple-600" : "hidden"} break-words`}>
          {from}
        </p>
        {responseTo && (
          <div className="border-l-2 mt-1 border-blue-600 bg-white bg-opacity-75 p-1 rounded-md content-center text-xs bottom-full pl-2 text-black">
            <p className={`${them ? "text-purple-600" : "text-blue-700"}`}>
              Reply to {responseTo.from}
            </p>
            <p className="text-nowrap overflow-hidden mr-20">
              {responseTo.text.substring(0, 10)}
              {responseTo.text.length > 10 && "..."}
            </p>
          </div>
        )}
        <p className="text-wrap break-words ">{text}</p>
        <br className={`${text.length % 32 > 27 || text.length % 32 <= 3 ? '' : 'hidden'}`} />
        <span className="text-[11px] text-black inline-block fixed right-[6px] bottom-1 ">{time}</span>
      </div>
    </div>
  );
};

export default Message;
