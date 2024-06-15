import AddTask from "./AddTask.js";
import TasksContainer from "./TasksContainer.js";
import Nav from "./Nav.js";
import socketIO from "socket.io-client";

const socket = socketIO.connect("http://localhost:5000");

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
