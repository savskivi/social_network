import { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import { Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import type { User } from "./types";
import { axiosInstanse } from "../axiosInstanse";

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  function getCurrentUser() {
    axiosInstanse.get("/auth_me?_relations=uploads").then((user) => {
      axiosInstanse.get(`/uploads/${user.data.upload_id}`).then((avatar) =>
        setCurrentUser({
          id: user.data.id,
          fullName: user.data.fullName,
          email: user.data.email,
          username: user.data.username,
          jobTitle: user.data.jobTitle,
          url: avatar.data.url,
          upload_id: user.data.upload_id,
          favorites: user.data.favorites,
        })
      );
    });
  }

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <HeroUIProvider>
      <Header currentUser={currentUser} />
      <div className="h-screen">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoute>
                <Profile currentUser={currentUser} />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </div>
    </HeroUIProvider>
  );
}

export default App;
