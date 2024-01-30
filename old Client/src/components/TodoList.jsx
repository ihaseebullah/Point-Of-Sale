import axios from "axios";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import toast, { Toaster } from "react-hot-toast";
import Loader from "./Loader";
export default function TodoList() {
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useState();
  const [todoList, setTodoList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relod, setRelod] = useState(false);
  const handleShow = () => {
    setShow(true);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await axios.get("/pos/dashboard/addTodo").then((res) => {
          setTodoList(res.data.data);
          setLoading(false);
        });
      } catch (error) {
        toast.error(error.response ? error.response.data : error.message);
        setError(error.response ? error.response.data : error.message);
        setLoading(false);
      }
    };
    fetchData();
  }, [relod]);
  const handleClose = () => {
    setShow(false);
  };
  const handleChange = (e) => {
    setTodo(e.target.value);
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  };
  const addTodo = () => {
    axios
      .post("/pos/dashboard/addTodo", { todo }, { headers })
      .then((res) => setTodoList(res.data.data))
      .then(() => {
        toast.success("Added");
        setShow(false);
      });
  };

  return (
    <div
      className="card "
      style={{
        minHeight: "28rem",
        maxHeight: "28rem",
        overflowY: "scroll",
      }}
    >
      <div className="card-header">
        <h3 className="card-title">
          <i className="ion ion-clipboard mr-1" />
          To Do List
        </h3>
      </div>
      {!loading ? (
        !error ? (
          <div className="card-body">
            <ul className="todo-list" data-widget="todo-list">
              {todoList &&
                todoList.map((todo, i) => {
                  const date = new Date(todo.createdAt).toLocaleDateString();
                  return (
                    <li key={todo._id}>
                      {/* drag handle */}
                      <span className="handle">
                        <i className="fas fa-ellipsis-v" />
                        <i className="fas fa-ellipsis-v" />
                      </span>
                      {/* checkbox */}
                      <div className="icheck-primary d-inline ml-2">
                        <input
                          type="checkbox"
                          defaultValue
                          name="todo1"
                          id="todoCheck1"
                        />
                        <label htmlFor="todoCheck1" />
                      </div>
                      {/* todo text */}
                      <span className="text">{todo.title}</span>
                      {/* Emphasis label */}
                      <small className="badge badge-danger">
                        <i className="far fa-clock" /> {date}
                      </small>
                      {/* General tools such as edit or delete*/}
                      <div className="tools">
                        <i
                          onClick={() => {
                            try {
                              axios
                                .delete(
                                  `/pos/dashboard/todo/delete/${todo._id}`
                                )
                                .then((res) => {
                                  setTodoList(res.data.data);
                                  toast.success("Removed");
                                });
                            } catch (e) {
                              toast.error(e ? e : "Couldn't delete the item");
                            }
                          }}
                          className="fas fa-trash"
                        />
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>
        ) : (
          <p className="mt-1" style={{ textAlign: "center" }}>
            {error}
            <br />
            <button
              onClick={() => setRelod(!relod)}
              className="m-2 btn btn-primary btn-sm rounded-circle"
            >
              <i className="fa-solid fa-rotate-right"></i>
            </button>
          </p>
        )
      ) : (
        <Loader />
      )}

      {/* /.card-body */}
      <div className="card-footer clearfix">
        <button
          onClick={handleShow}
          type="button"
          className="btn btn-primary float-right"
        >
          <i className="fas fa-plus" /> Add item
        </button>
      </div>
      <Modal
        show={show}
        size="md"
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Add Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-10">
              <input className="form-control" onChange={handleChange} />
            </div>
            <div className="col-lg-2">
              <button className="btn btn-primary" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
