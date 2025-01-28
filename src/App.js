import React from "react";
import { Provider } from "react-redux";
import store from "./redux";
import ThemeProvider from "./theme";
import { Navigate, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import NotFound from "./pages/Page404";
import Profile from "./pages/Profile";
import Features from "./pages/Features";
import ResetPassword from "./pages/ResetPassword";
import AuthLayout from "./layouts/Auth";


function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="" element={<Navigate to="/signin" />} />
            <Route path="signin" element={<Signin />} />
            <Route path="signup" element={<Signup />} />
            <Route path="404" element={<NotFound />} />
            <Route path="profile" element={<Profile />} />
            <Route path="features" element={<Features />} />
            <Route path="resetpassword" element={<ResetPassword />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
