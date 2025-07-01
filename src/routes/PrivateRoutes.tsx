import { lazy } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import PrivateLayout from "./layouts/PrivateLayout";
import AuthLayout from "./layouts/AuthLayout";
import { useAuth } from "@/context/AuthProvider";

const UpdateUser = lazy(() => import("../pages/private/UpdateUser"));
const ChangeCredentials = lazy(
  () => import("../pages/private/ChangeCredentials"),
);
const ResetCredentials = lazy(
  () => import("../pages/private/ResetCredentials"),
);
const ResetCredentialsRedirect = lazy(
  () => import("../pages/private/ResetCredentialsRedirect"),
);
const Home = lazy(() => import("../pages/private/Home"));
const Dashboard = lazy(() => import("../pages/private/Dashboard"));
const Salesman = lazy(() => import("../pages/private/Salesman"));
const ResearchStudy = lazy(() => import("../pages/private/research/Study"));
const ResearchStudySingle = lazy(
  () => import("../pages/private/research/StudySingle"),
);

function PrivateRoutes() {
  const { currentUser } = useAuth();
  const location = useLocation();
  // console.log(location);

  if (
    !currentUser?.name ||
    location.pathname === "/reset-redirect" ||
    location.pathname === "/reset-credentials"
  )
    return (
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="auth/*" element={<Navigate to="/update-user" />} />
          <Route path="update-user" element={<UpdateUser />} />
          <Route path="reset-credentials" element={<ResetCredentials />} />
          <Route path="reset-redirect" element={<ResetCredentialsRedirect />} />
          <Route path="*" element={<div>Not existed</div>} />
        </Route>
      </Routes>
    );

  return (
    <Routes>
      <Route element={<PrivateLayout />}>
        <Route path="auth/*" element={<Navigate to="/start" />} />
        <Route path="update-user" element={<Navigate to="/start" />} />
        <Route path="change-credentials" element={<ChangeCredentials />} />

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
