import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Swal from "sweetalert2";

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("access_token");
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

export default function List() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  let token = localStorage.getItem("access_token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchPosts = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/posts", config);
    setPosts(response.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const deletePost = async (id) => {
    const isConfirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      return result.isConfirmed;
    });

    if (!isConfirm) {
      return;
    }

    await axios
      .delete(`http://127.0.0.1:8000/api/posts/${id}`, config)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        fetchPosts();
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  const handleLogout = async () => {
    await axios
      .post(`http://127.0.0.1:8000/api/logout`, config)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/login");
      })
      .catch(({ response }) => {
        Swal.fire({
          text: response.data.message,
          icon: "error",
        });
      });
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <Link className="btn btn-primary mb-2" to={"/post/create"}>
            Create Post
          </Link>
          <Button
            variant="danger"
            className="float-end"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </div>
        <meta name="csrf-token" content="{{ csrf_token() }}" />
        <div className="col-12">
          <div className="card card-body">
            <div className="table-responsive">
              <table className="table table-striped mb-0 text-center">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Slug</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.data?.map((post, index) => (
                    <tr key={post.id}>
                      <td>{index + 1}</td>
                      <td>{post.title}</td>
                      <td>{post.content}</td>
                      <td>{post.slug}</td>
                      <td>
                        <Link
                          to={`/post/edit/${post.id}`}
                          className="btn btn-success me-2"
                        >
                          Edit
                        </Link>
                        <Button
                          variant="danger"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
