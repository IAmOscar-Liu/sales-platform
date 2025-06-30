import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import useErrorBoundary from "use-error-boundary";
import {
  PageScreenError,
  PageScreenLoading,
} from "../../components/screen/PageScreen";
import { PageDataProvider } from "./PageData";
import PageHeader from "./PageHeader";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "./SidebarData";

function PrivateLayout() {
  //   const {
  //     data: companyData,
  //     isSuccess,
  //     isFetching,
  //   } = useListCompanyQuery({ query: { pageSize: 1000 } });
  //   const dispatch = useAppDispatch();
  //   const [settings, setSettings] = useLocalStorage<AuthSettings>(
  //     AUTH_SETTINGS_KEY,
  //     {},
  //   );
  // const hasFetched = useRef(false); // Track if action has run
  const { ErrorBoundary, didCatch, error, reset } = useErrorBoundary();
  const location = useLocation();

  useEffect(() => {
    // console.log("Route changed:", location.pathname);
    if (error) reset();
  }, [location]);

  //   useEffect(() => {
  //     if (isSuccess && !isFetching && !hasFetched.current) {
  //       hasFetched.current = true; // Mark as done to prevent further actions
  //       console.log("First-time data fetched:");

  //       const matchedCompany = companyData!.data.find(
  //         (c) => c.id === settings.companyId,
  //       );
  //       dispatch(setCurrentCompany(matchedCompany ?? companyData!.data[0]));
  //       setSettings({
  //         ...settings,
  //         companyId: (matchedCompany ?? companyData!.data[0]).id,
  //       });
  //     }
  //   }, [isSuccess, isFetching, companyData]);

  return (
    <PageDataProvider>
      <SidebarProvider>
        <div className="flex h-screen flex-col">
          <PageHeader />
          <div className="grid h-0 flex-grow grid-cols-[auto_1fr]">
            <Sidebar />
            <div className="overflow-y-auto bg-neutral-100 dark:bg-neutral-800">
              {didCatch ? (
                <PageScreenError
                  className="min-h-[calc(100vh-60px)]"
                  error={error}
                />
              ) : (
                <ErrorBoundary>
                  <Suspense
                    fallback={
                      <PageScreenLoading className="min-h-[calc(100vh-60px)]" />
                    }
                  >
                    <Outlet />
                  </Suspense>
                </ErrorBoundary>
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </PageDataProvider>
  );
}

export default PrivateLayout;
