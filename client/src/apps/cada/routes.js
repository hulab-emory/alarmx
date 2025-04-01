import React from "react";
import { Route } from "react-router-dom";
import CadaLayout from "./index.js";
import Dashboard from "./pages/Dashboard.jsx";
import Text from "./components/Text/index.js";
import NLP from "./components/NLP/index.js";
import Afib from "./components/Afib/index.js";
import SQi from "./components/SQi/index.js";
import LLM from "./components/LLM/index.js";
import COT from "./components/COT/index.js";
// import ChartReview from "./components/ChartReview";
import CRCEval from "./components/CRC/index.js";
import User from "./pages/User.jsx";
import Project from "./pages/Project.jsx";
import Bucket from "./pages/Bucket.jsx";
import OutOfOrder from "../../pages/OutOfOrder.jsx";
import ProtectedRoute from "../../common/ProtectedRoute.js";
import Diet from "./components/Diet/index.js";
import Note from "./components/Note/index.js";

const cadaRoutes = [
  <Route
    key="cada"
    path="/cada"
    element={
      <ProtectedRoute>
        <CadaLayout />
      </ProtectedRoute>
    }
  >
    <Route path="" element={<Dashboard />} />
    <Route path=":role/txt/:pid" element={<Text />} />
    <Route path=":role/nlp/:pid" element={<NLP />} />
    <Route path=":role/note/:pid" element={<Note />} />
    <Route path=":role/afib/:pid" element={<Afib />} />
    <Route path=":role/sqi/:pid" element={<SQi />} />
    <Route path=":role/llm/:pid" element={<LLM />} />
    <Route path=":role/cot/:pid" element={<COT />} />
    <Route path=":role/crc/:pid" element={<CRCEval />} />
    <Route path=":role/diet/:pid" element={<Diet />} />
    {/* <Route path=":role/chartreview/:pid" element={<ChartReview />} /> */}
    <Route path="user" element={<User />} />
    <Route path="project" element={<Project />} />
    <Route path="bucket" element={<Bucket />} />
    <Route path="model" element={<OutOfOrder />} />
    <Route path="report" element={<OutOfOrder />} />
  </Route>,
];

export default cadaRoutes;
