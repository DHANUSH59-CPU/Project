import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";
import Layout from "./pages/Layout";
import { authenticateUser } from "./store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loading from "./components/Loading";
import { Navigate } from "react-router-dom";
import Logout from "./pages/Logout";
import ProblemsArena from "./components/ProblemsArena";
import Admin from "./components/adminPanel/admin";
import AdminPanel from "./components/adminPanel/AdminPanel";

export default function App() {
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.authSlice
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authenticateUser());
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <div>
        {loading ? (
          <Loading />
        ) : (
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route
                path="/signup"
                element={isAuthenticated ? <Navigate to="/" /> : <SignUp />}
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/logout"
                element={isAuthenticated ? <Logout /> : <Navigate to="/" />}
              />
              <Route
                path="/problems"
                element={isAuthenticated ? <ProblemsArena /> : <Login />}
              />
              <Route
                path="/admin"
                element={
                  isAuthenticated && user.role === "admin" ? (
                    <Admin />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/create"
                element={
                  isAuthenticated && user.role === "admin" ? (
                    <AdminPanel />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Route>
          </Routes>
        )}
      </div>
    </>
  );
}
