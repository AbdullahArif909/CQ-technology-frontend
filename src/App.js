import React from "react";
import { Route, Routes } from "react-router-dom";

import Layout from "./components/layout/Layout";
import Books from "./components/pages/books";
import Students from "./components/pages/students";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Students />} />
        <Route path="/book" element={<Books />} />
      </Routes>
    </Layout>
  );
}

export default App;
