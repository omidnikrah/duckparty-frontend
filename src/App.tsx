import { Route, Router } from "@solidjs/router";
import { MobileOverlay } from "./components";
import CreatorDucks from "./pages/CreatorDucks";
import Home from "./pages/Home";
import Leaderboard from "./pages/Leaderboard";
import Party from "./pages/Party";
import SetEmail from "./pages/SetEmail";

function App() {
  return (
    <>
      <MobileOverlay />
      <Router>
        <Route path="/" component={Home} />
        <Route path="/party" component={Party} />
        <Route path="/creator/:creatorId/ducks" component={CreatorDucks} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/set-email" component={SetEmail} />
      </Router>
    </>
  );
}

export default App;
