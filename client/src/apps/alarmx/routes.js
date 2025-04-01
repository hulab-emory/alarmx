import React from "react";
import { Route } from "react-router-dom";
import AlarmxLayout from "./index.js";
import Hospital from "./pages/Hospital.jsx";
import Unit from "./pages/Unit.jsx";
import Bed from "./pages/Bed.jsx";
import ProtectedRoute from "../../common/ProtectedRoute.js";

const alarmxRoutes = [
  <Route
    key="alarmx"
    path="/alarmx"
    element={
      <ProtectedRoute>
        <AlarmxLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Hospital />} />
    <Route path="hospital" element={<Hospital />} />
    <Route path="unit" element={<Unit />} />
    <Route path="bed" element={<Bed />} />
  </Route>,
];

export default alarmxRoutes;
