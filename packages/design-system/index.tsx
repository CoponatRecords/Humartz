// import { AuthProvider } from "@repo/auth/provider";
import type { ThemeProviderProps } from "next-themes";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./providers/theme";

type DesignSystemProviderProperties = ThemeProviderProps & {
  privacyUrl?: string;
  termsUrl?: string;
  helpUrl?: string;
};

export const DesignSystemProvider = ({
  children,
  privacyUrl,
  termsUrl,
  helpUrl,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    {/* <AuthProvider helpUrl={helpUrl} privacyUrl={privacyUrl} termsUrl={termsUrl}> */}
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster />
    {/* </AuthProvider> */}
  </ThemeProvider>
);

export * from "./lib/utils";
export * from "./lib/fonts";

// packages/design-system/index.tsx

// Export your provider (already there)
export * from "./providers/theme"; 

// ✅ Add these to export the components used in the Header
export * from "./components/ui/button";
export * from "./components/ui/label";
export * from "./components/ui/calendar";
export * from "./components/ui/popover";
export * from "./components/ui/pagination";
export * from "./components/ui/card";
export * from "./components/ui/avatar";
export * from "./components/ui/progress";
export * from "./components/ui/tabs";
export * from "./components/ui/checkbox";
export * from "./components/ui/radio-group";
export * from "./components/ui/accordion";
export * from "./components/mode-toggle";
export * from "./components/ui/navigation-menu";
export * from "./components/ui/sheet";
export * from "./components/ui/sonner";
export * from "./components/ui/tooltip";
export * from "./components/ui/toggle";
export * from "./components/ui/input";
export * from "./components/ui/separator";
export * from "./components/ui/textarea";
export * from "./components/ui/dropdown-menu";
export * from "./components/ui/input-group";
export * from "./components/ui/dialog";
export * from "./components/ui/carousel";
export * from "./postcss.config.mjs";
export * from "./components/ui/skeleton";

// ✅ Export your utils and fonts
export * from "./lib/utils";
export * from "./lib/fonts";
export * from "./hooks/use-mobile";
