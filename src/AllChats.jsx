import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import save from "./assets/save.png";
import back from './assets/back7.jpg'


const AllChats = () => {
  const usernameRef = useRef(null);
  const [buttonVis, setButtonVis] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    setButtonVis(false);
    const username = usernameRef.current.value;
    if (username !== localStorage.getItem("user")) {
      localStorage.setItem("user", username);
    }
  };

  return (
    <>
      <div 
        className="flex px-2 flex-col w-full bg-cover  bg-center h-screen gap-1"
        style={{
          backgroundImage: `url(${back})`,
        }}
      >
        <div className="w-full h-14 rounded-b-2xl shadow-md">
          <div className="w-full h-full bg-white rounded-b-2xl text-gray-800 text-lg px-3 flex items-center">
            <form className="w-full flex  bg-white rounded-b-2xl items-center" onSubmit={handleSubmit}>
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

        <Link
          className="w-full bg-white rounded-3xl  shadow-md p-5 flex items-center h-20"
          to="/chat/1"
        >
          Арбуз без хлеба
        </Link>
        <Link
          className="w-full bg-white rounded-3xl shadow-md p-5 flex items-center h-20"
          to="/chat/2"
        >
          Арбуз с хлебом
        </Link>
        <Link
          className="w-full bg-white rounded-3xl shadow-md p-5 flex items-center h-20"
          to="/chat/3"
        >
          Чат для котиков
        </Link>
        <Link
          className="w-full bg-white rounded-3xl shadow-md p-5 flex items-center h-20"
          to="/chat/4"
        >
          Чат для девчат
        </Link>
        <Link
          className="w-full bg-white rounded-3xl shadow-md p-5 flex items-center h-20"
          to="/chat/5"
        >
          Туда сюда миллионер
        </Link>
        <Link
          className="w-full shadow-md bg-white rounded-3xl p-5 flex items-center h-20"
          to="/chat/6"
        >
          Чат для бегунов
        </Link>
      </div>
    </>
  );
};

export default AllChats;
