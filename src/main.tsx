import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { THEME_STORAGE_KEY } from "./constants";
import { ThemeProvider } from "./context/ThemeProvider";
import ToastProvider from "./context/ToastProvider";
import ADPI18nProvider from "./i18n/ADPI18nProvider";
import { I18nProvider } from "./i18n/i18nProvider";
import "./index.css";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ADPI18nProvider>
        <I18nProvider>
          <ThemeProvider storageKey={THEME_STORAGE_KEY}>
            <AuthProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nProvider>
      </ADPI18nProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
