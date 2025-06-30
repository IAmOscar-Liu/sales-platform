import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";

const Login = lazy(() => import("../pages/auth/Login"));
const Registration = lazy(() => import("../pages/auth/Registration"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));

function AuthRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route path="registration" element={<Registration />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        {/* <Route path="account-activation" element={<AccountActivation />} /> */}
      </Route>
    </Routes>
  );
}

export default AuthRoutes;
