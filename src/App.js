import "bootstrap/dist/css/bootstrap.css";
import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import PostList from "./components/post/list.component";
import PostCreate from "./components/post/add.component";
import PostEdit from "./components/post/edit.component";

function App() {
  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/"} className="navbar-brand text-white">
            Basic Crud App
          </Link>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Routes>
              <Route exact path="/" element={<PostList />} />
              <Route path="/post/create" element={<PostCreate />} />
              <Route path="/post/edit/:id" element={<PostEdit />} />
            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
