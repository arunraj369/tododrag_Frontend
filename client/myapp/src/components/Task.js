import AddTask from "./AddTask.js";
import TasksContainer from "./TasksContainer.js";
import Nav from "./Nav.js";
import socketIO from "socket.io-client";

const socket = socketIO.connect("https://tododrag-backend-2.onrender.com/");

const Task = () => {
  return (
    <div>
      <Nav />
      <AddTask socket={socket} />
      <TasksContainer socket={socket} />
    </div>
  );
};

export default Task;
