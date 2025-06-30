import { Outlet } from "react-router-dom";
import useErrorBoundary from "use-error-boundary";
import {
  FullScreenError,
  FullScreenLoading,
} from "./components/screen/FullScreen";

function App({ isLoading }: { isLoading: boolean }) {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  if (didCatch) return <FullScreenError error={error} />;

  return (
    <ErrorBoundary>
      {isLoading ? <FullScreenLoading /> : <Outlet />}
    </ErrorBoundary>
  );
}

export default App;
