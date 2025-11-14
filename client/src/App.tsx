import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NameEntryPage from "@/pages/name-entry";
import RequestGridPage from "@/pages/request-grid";
import AdjustmentScreenPage from "@/pages/adjustment-screen";
import MixerViewPage from "@/pages/mixer-view";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={NameEntryPage} />
      <Route path="/request" component={RequestGridPage} />
      <Route path="/adjust" component={AdjustmentScreenPage} />
      <Route path="/mixer" component={MixerViewPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
