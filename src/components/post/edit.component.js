import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

export default function EditPost() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState();
  const [validationError, setValidationError] = useState({});

  useEffect(() => {
    fetchPost();
  }, []);

  let token = localStorage.getItem("access_token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchPost = async () => {
    await axios
      .get(`http://localhost:8000/api/posts/${id}`, config)
      .then(({ data }) => {
        const { title, content, slug, status } = data.data;
        setTitle(title);
        setContent(content);
        setSlug(slug);
        setStatus(status);
      })
      .catch(({ response: { data } }) => {
        Swal.fire({
          text: data.message,
          icon: "error",
        });
      });
  };

  const updatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("title", title);
    formData.append("content", content);
    formData.append("slug", slug);
    formData.append("status", status);

    await axios
      .post(`http://localhost:8000/api/posts/${id}`, formData, config)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/post");
      })
      .catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors);
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error",
          });
        }
      });
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Post</h4>
              <hr />
              <div className="form-wrapper">
                {Object.keys(validationError).length > 0 && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-danger">
                        <ul className="mb-0">
                          {Object.entries(validationError).map(
                            ([key, value]) => (
                              <li key={key}>{value}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                <Form onSubmit={updatePost}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={title}
                          onChange={(e) => {
                            setTitle(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="my-3">
                    <Col>
                      <Form.Group controlId="Content">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={content}
                          onChange={(e) => {
                            setContent(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Slug">
                        <Form.Label>Slug</Form.Label>
                        <Form.Control
                          type="text"
                          value={slug}
                          onChange={(e) => {
                            setSlug(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Status">
                        <Form.Label>Status</Form.Label>
                        <Form.Control
                          type="text"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant="primary"
                    className="mt-2"
                    size="lg"
                    block="block"
                    type="submit"
                  >
                    Update
                  </Button>
                  <Link
                    className="btn btn-secondary btn-lg mb-2 float-end mt-2"
                    to={"/post"}
                  >
                    Back
                  </Link>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
