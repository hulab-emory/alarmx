import React from "react";
import { Provider } from "react-redux";
import store from "./redux/index.js";
import ThemeProvider from "./theme/index.js";
import { Navigate, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/Page404.jsx";
import Profile from "./pages/Profile.jsx";
import Features from "./pages/Features.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import AuthLayout from "./layouts/Auth.jsx";

//Feature routes
import alarmxRoutes from "./apps/alarmx/routes.js";

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

          {alarmxRoutes}
          
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
