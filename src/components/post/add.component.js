import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";

export default function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState();
  const [validationError, setValidationError] = useState({});

  const createPost = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("slug", slug);
    formData.append("status", status);

    let token = "4|FItzyd9DHKm9ocgj9G7onrrjWQV27LpbZ8EwpFcG";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    await axios
      .post(`http://localhost:8000/api/posts`, formData, config)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          text: data.message,
        });
        navigate("/");
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
              <h4 className="card-title">Create Post</h4>
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
                <Form onSubmit={createPost}>
                  <Row>
                    <Col>
                      <Form.Group controlId="Title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={title}
                          onChange={(event) => {
                            setTitle(event.target.value);
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
                          onChange={(event) => {
                            setContent(event.target.value);
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
                          onChange={(event) => {
                            setSlug(event.target.value);
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
                          type="number"
                          value={status}
                          onChange={(event) => {
                            setStatus(event.target.value);
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
                    Save
                  </Button>
                  <Link
                    className="btn btn-secondary btn-lg mb-2 float-end mt-2"
                    to={"/"}
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
