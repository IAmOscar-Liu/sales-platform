import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

const UpdateUser = lazy(() => import("../pages/private/UpdateUser"));

function UpdateUserRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="auth/*" element={<Navigate to="/update-user" />} />
        <Route path="update-user" element={<UpdateUser />} />
        <Route path="*" element={<div>Not existed</div>} />
      </Route>
    </Routes>
  );
}

export default UpdateUserRoutes;
