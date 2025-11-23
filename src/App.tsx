import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import Party from "./pages/Party";

function App() {
  return (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/party" component={Party} />
    </Router>
  );
}

export default App;
