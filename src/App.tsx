import { Route, Router } from "@solidjs/router";
import { MobileOverlay } from "./components";
import CreatorDucks from "./pages/CreatorDucks";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Party from "./pages/Party";

function App() {
  return (
    <>
      <MobileOverlay />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/party" component={Party} />
        <Route path="/creator/:creatorId/ducks" component={CreatorDucks} />
        <Route path="/leaderboard" component={Leaderboard} />
      </Router>
    </>
  );
}

export default App;
