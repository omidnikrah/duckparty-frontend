import { Route, Router } from "@solidjs/router";
import { MobileOverlay } from "./components";
import Home from "./pages/Home";
import Party from "./pages/Party";

function App() {
  return (
    <>
      <MobileOverlay />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/party" component={Party} />
      </Router>
    </>
  );
}

export default App;
