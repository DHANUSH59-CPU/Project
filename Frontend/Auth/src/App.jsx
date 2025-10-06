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
import ProblemsArena from "./pages/ProblemsArena";
import Admin from "./components/adminPanel/Admin";
import AdminPanel from "./components/adminPanel/AdminPanel";
import UpdateProblem from "./components/adminPanel/UpdateProblem";
import DeleteProblem from "./components/adminPanel/DeleteProblem";
import SprintManagement from "./components/adminPanel/SprintManagement";
import ProblemSolvingPage from "./components/ProblemSolvingPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SprintsPage from "./pages/SprintsPage";
import SprintDetailPage from "./pages/SprintDetailPage";
import SprintProgressPage from "./pages/SprintProgressPage";
import UserProfilePage from "./pages/UserProfilePage";
import SocialDataPage from "./pages/SocialDataPage";
import DiscoverFriends from "./pages/DiscoverFriends";
import ConnectionRequests from "./pages/ConnectionRequests";
import Connections from "./pages/Connections";
import CollaborativeEditorPage from "./pages/CollaborativeEditorPage";
import JoinRoomPage from "./pages/JoinRoomPage";

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
                path="/leaderboard"
                element={isAuthenticated ? <LeaderboardPage /> : <Login />}
              />
              <Route
                path="/sprints"
                element={isAuthenticated ? <SprintsPage /> : <Login />}
              />
              <Route
                path="/profile"
                element={isAuthenticated ? <UserProfilePage /> : <Login />}
              />
              <Route
                path="/social/:type"
                element={isAuthenticated ? <SocialDataPage /> : <Login />}
              />
              <Route
                path="/discover"
                element={isAuthenticated ? <DiscoverFriends /> : <Login />}
              />
              <Route
                path="/requests"
                element={isAuthenticated ? <ConnectionRequests /> : <Login />}
              />
              <Route
                path="/connections"
                element={isAuthenticated ? <Connections /> : <Login />}
              />
              <Route path="/collaborate" element={<JoinRoomPage />} />
              <Route
                path="/collaborate/:roomId"
                element={<CollaborativeEditorPage />}
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
              <Route
                path="/admin/update"
                element={
                  isAuthenticated && user?.role === "admin" ? (
                    <UpdateProblem />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/delete"
                element={
                  isAuthenticated && user?.role === "admin" ? (
                    <DeleteProblem />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/admin/sprints"
                element={
                  isAuthenticated && user?.role === "admin" ? (
                    <SprintManagement />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Route>
            <Route
              path="/problems/:problemId"
              element={isAuthenticated ? <ProblemSolvingPage /> : <Login />}
            />
            <Route
              path="/sprint/:sprintId"
              element={isAuthenticated ? <SprintDetailPage /> : <Login />}
            />
            <Route
              path="/sprint/:sprintId/progress"
              element={isAuthenticated ? <SprintProgressPage /> : <Login />}
            />
          </Routes>
        )}
      </div>
    </>
  );
}
