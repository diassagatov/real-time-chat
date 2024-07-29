const Message = ({them, from, text, responseTo, time, setResponseTo}) => {
    return (
      <div
      onContextMenu={(e) => {
        e.preventDefault()
          setResponseTo({ from, text, time});
        }}
        className={`flex ${them ? 'justify-start': 'justify-end'}`}
      >
        <div className="bg-white shadow-md backdrop-blur-sm bg-opacity-80 text-wrap text-gray-800 px-3 py-2 rounded-lg min-w-32 max-w-80">
         
          <p className={`text-wrap text-xs ${them ? 'text-purple-600' : 'text-blue-800'} break-words`}>{from}</p>
          {responseTo && 
            <div className=" border-l-2 mt-1 border-blue-600 bg-white bg-opacity-75 p-1 rounded-md content-center text-xs bottom-full pl-2 text-black">
            <p className={`${them ? 'text-purple-600' : 'text-blue-700'}`}>Reply to {responseTo.from}</p>
            <p className="text-nowrap overflow-hidden mr-20 ">
              {responseTo.text.substring(0,10)}
              {responseTo.text.length > 10 && "..."}
            </p>
            </div>
          }
          <p className="text-wrap break-words">{text}</p>
          <p className="text-wrap text-xs text-right">{time}</p>
        </div>
      </div>
    );
  };


  export default Message;