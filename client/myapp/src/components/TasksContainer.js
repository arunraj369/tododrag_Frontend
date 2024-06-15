import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faComment } from "@fortawesome/free-solid-svg-icons";
import "../index.css"; 

const TasksContainer = ({ socket }) => {
  const [tasks, setTasks] = useState({});
  const [editTask, setEditTask] = useState({ id: "", title: "", category: "" });

  useEffect(() => {
    function fetchTasks() {
      fetch("https://tododrag-backend-2.onrender.com/api")
        .then((res) => res.json())
        .then((data) => setTasks(data));
    }
    fetchTasks();
  }, []);

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

  const handleDelete = (category, id) => {
    socket.emit("deleteTask", { category, id });
  };

  const handleEdit = (category, task) => {
    setEditTask({ id: task.id, title: task.title, category });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    socket.emit("editTask", editTask);
    setEditTask({ id: "", title: "", category: "" });
  };

  return (
    <div className="container">
      <DragDropContext onDragEnd={handleDragEnd}>
        {Object.entries(tasks).map((task) => (
          <div
            className={`${task[1].title.toLowerCase()}__wrapper`}
            key={task[1].title}
          >
            <h3>{task[1].title} Tasks</h3>
            <div className={`${task[1].title.toLowerCase()}__container`}>
              <Droppable droppableId={task[1].title}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {task[1].items.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={`${task[1].title.toLowerCase()}__items`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {editTask.id === item.id ? (
                              <form onSubmit={handleEditSubmit}>
                                <input
                                  type="text"
                                  value={editTask.title}
                                  onChange={(e) =>
                                    setEditTask((prev) => ({
                                      ...prev,
                                      title: e.target.value,
                                    }))
                                  }
                                />
                                <button type="submit">Save</button>
                              </form>
                            ) : (
                              <>
                                <h4
                                  className={`${task[1].title.toLowerCase()}__items1`}
                                >
                                  Status
                                </h4>
                                <p>{item.title}</p>
                                <div className="actions">
                                  <Link
                                    to={`/comments/${task[1].title}/${item.id}`}
                                    className="comment-link"
                                  >
                                    <FontAwesomeIcon
                                      icon={faComment}
                                      className="comment-icon"
                                    />
                                    {item.comments
                                      ? `View Comments`
                                      : "Add Comment"}
                                  </Link>
                                  <span
                                    className="edit-icon-container"
                                    onClick={() =>
                                      handleEdit(task[1].title, item)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faEdit}
                                      className="edit-icon"
                                    />
                                    Edit
                                  </span>
                                  <span
                                    className="delete-icon-container"
                                    onClick={() =>
                                      handleDelete(task[1].title, item.id)
                                    }
                                  >
                                    <FontAwesomeIcon
                                      icon={faTrash}
                                      className="delete-icon"
                                    />
                                    Delete
                                  </span>
                                </div>
                              </>
                            )}
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
