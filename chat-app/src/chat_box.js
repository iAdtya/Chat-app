import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [messages, setMessage] = useState([
    {
      id: "gNKlMgVlhrXZj1C3AAAB",
      username: "jam",
      message: "Hello, how are you?",
    },
    {
      id: "gNKlMgVlhrXZj1C3AAAB",
      username: "adi",
      message: "I'm doing great, thanks for asking!",
    },
  ]);
  const [username, setUsername] = useState("");
  const socket = useRef();
  const messageInput = useRef();

  useEffect(() => {
    const name = prompt("Enter your username");
    setUsername(name);

    socket.current = io("http://localhost:3000");
    socket.current.on("broadcast_message", (userMessage) => {
      console.log("Received message:", userMessage);
      setMessage((prevMessages) => [...prevMessages, userMessage]);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const handlesubmit = (e) => {
    e.preventDefault();
    if (socket.current) {
      const message = messageInput.current.value;
      socket.current.emit("new_message", {
        id: socket.current.id,
        username: username,
        message: message,
      });
      setMessage((prevMessages) => [
        ...prevMessages,
        { id: socket.current.id, username: username, message: message },
      ]);

      messageInput.current.value = "";
    }
  };

  return (
    <>
      <div className="flex flex-col h-[85vh] sm:h-[90vh] pb-4 ">
        <div className="justify-center flex py-6 px-6">
          <h1 className="text-3xl flex font-bold ">Scalable-ChatterUp</h1>
        </div>

        <div className="flex justify-center px-6 flex-grow ">
          <div
            id="chatbox"
            className=" bg-slate-900 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] w-full rounded-2xl flex flex-col justify-end overflow-y-auto"
          >
            {messages.map((e, index) => (
              <div
                key={index}
                className={`chat ${
                  socket.current && socket.current.id === e.id
                    ? "chat-end"
                    : "chat-start"
                }`}
              >
                <div>
                  <div className="text-xs text-gray-500 mb-1">{e.username}</div>
                  <div className="chat-bubble">{e.message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 px-6 fixed bottom-0 w-full ">
          <form onSubmit={handlesubmit} className="justify-center flex  ">
            <input
              ref={messageInput}
              className="input input-bordered input-info w-full  "
              placeholder="Message..."
              required
            />
            <button
              type="submit"
              className="btn btn-primary ml-4 lg:w-64 md:w-48"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
