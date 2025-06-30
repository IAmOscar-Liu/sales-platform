import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import authSideImage from "../../assets/login-side-image.png";
import { PageScreenLoading } from "../../components/screen/PageScreen";

function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-[500px] lg:block">
        <img
          className="h-screen w-full object-cover"
          src={authSideImage}
          alt=""
        />
      </div>
      <Suspense fallback={<PageScreenLoading />}>
        <Outlet />
      </Suspense>
    </div>
  );
}

export default AuthLayout;
