import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import List from "./pages/List";
import ProtectedRoute from "./config/ProtectedRoute";
import Test from "./pages/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/dashboard/list"
          element={
            <ProtectedRoute>
              <List />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/test"
          element={
            <ProtectedRoute>
              <Test />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
