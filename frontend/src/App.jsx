import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/home";
import Login from "./pages/login";
import SignUp from "./pages/sign-up";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/ PrivateRoute";
import CreateGroup from "./pages/create-group";
import JoinGroupByName from "./pages/join-group";
import ChatScreen from "./pages/chat-screen";

function App() {
  return (
    <AuthProvider>
      <Toaster />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/sign-up' element={<SignUp />} />

        <Route
          path='/'
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path='/create-group'
          element={
            <PrivateRoute>
              <CreateGroup />
            </PrivateRoute>
          }
        />
        <Route
          path='/join-group'
          element={
            <PrivateRoute>
              <JoinGroupByName />
            </PrivateRoute>
          }
        />
        <Route
          path='/chat/:groupId'
          element={
            <PrivateRoute>
              <ChatScreen />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
