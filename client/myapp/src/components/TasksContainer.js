import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});

  useEffect(() => {
    function fetchTasks() {
      fetch("https://tododrag-backend-2.onrender.com/api")
        .then((res) => res.json())
        .then((data) => setTasks(data)); // intialy data store in state
    }
    fetchTasks();
  }, []);

  //It listen the sockets updates task
  useEffect(() => {
    socket.on("tasks", (data) => {
      setTasks(data);
    });
  }, [socket]);

  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    socket.emit("taskDragged", {
      source,
      destination,
    });
  };

  return (
    <div className="container">
      {console.log("rendering")}
      {/* DragDropContext enables drag and drop functionality within its context. */}
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* map data from task */}
        {Object.entries(tasks).map((task) => (
          <div
            className={`${task[1].title.toLowerCase()}__wrapper`} //getting title name from task 1st index
            key={task[1].title}
          >
            <h3>{task[1].title} Tasks</h3>
            <div className={`${task[1].title.toLowerCase()}__container`}>
              {/* task storing place is droppable area */}
              {/* droppableID must unique we have only titles so we use title as droppableId */}
              <Droppable droppableId={task[1].title}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item, index) => (
                      // draggable is where todo content is dislay
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${task[1].title.toLowerCase()}__items`}
                          >
                            <p>{item.title}</p>
                            <p className="comment">
                              <Link
                                to={`/comments/${task[1].title}/${item.id}`}
                              >
                                {item.comments
                                  ? `View Comments`
                                  : "Add Comment"}
                              </Link>
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
};

export default TasksContainer;
