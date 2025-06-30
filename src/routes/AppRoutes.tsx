import { useAuth } from "@/context/AuthProvider";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "../App";
import AuthRoutes from "./AuthRoutes";
import PrivateRoutes from "./PrivateRoutes";

function AppRoutes() {
  const { currentUser, isLoading } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<App isLoading={isLoading} />}>
          <Route path="error/*" element={<div>Not Found</div>} />

          {currentUser ? (
            <>
              <Route path="/*" element={<PrivateRoutes />} />
              <Route index element={<Navigate to="/start" />} />
            </>
          ) : (
            <>
              <Route path="auth/*" element={<AuthRoutes />} />
              <Route path="*" element={<Navigate to="/auth?logout=true" />} />
            </>
          )}

          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
