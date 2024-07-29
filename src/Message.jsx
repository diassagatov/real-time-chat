const Message = ({them, from, text, responseTo, setResponseTo}) => {
    return (
      <div
      onContextMenu={(e) => {
        e.preventDefault()
          setResponseTo({ from, text});
        }}
        className={`flex ${them ? 'justify-start': 'justify-end'}`}
      >
        <div className="bg-white shadow-md backdrop-blur-sm bg-opacity-70 text-wrap text-gray-800 px-3 py-2 rounded-2xl min-w-32 max-w-80">
          {responseTo && 
            <div className=" border-l-2 border-blue-600 bg-gray-50 bg-opacity-35 p-1 rounded-md content-center text-xs bottom-full w-full pl-4 text-black">
            <p className="text-purple-600 ">Reply to {responseTo.from}</p>
            <p className="text-nowrap overflow-hidden mr-20 ">
              {responseTo.text.substring(0,70)}
              {responseTo.text.length > 70 && "..."}
            </p>
            </div>
          }
          <p className="text-wrap text-xs text-purple-700 break-words">{from}</p>
          <p className="text-wrap break-words">{text}</p>
        </div>
      </div>
    );
  };


  export default Message;