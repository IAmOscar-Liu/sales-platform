import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PrivateLayout from "./layouts/PrivateLayout";

const Home = lazy(() => import("../pages/private/Home"));
const Dashboard = lazy(() => import("../pages/private/Dashboard"));
const Salesman = lazy(() => import("../pages/private/Salesman"));
const ResearchStudy = lazy(() => import("../pages/private/research/Study"));
const ResearchStudySingle = lazy(
  () => import("../pages/private/research/StudySingle"),
);

function PrivateRoutes() {
  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path="auth/*" element={<Navigate to="/start" />} />
        <Route path="start" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="salesman" element={<Salesman />} />
        <Route path="research/study" element={<ResearchStudy />} />
        <Route
          path="research/study/:studyId"
          element={<ResearchStudySingle />}
        />
        <Route path="*" element={<div>Not existed</div>} />
      </Route>
    </Routes>
  );
}

export default PrivateRoutes;
