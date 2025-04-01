import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./site/WelcomePage";
import Game from "./site/Game";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Game />} />
                <Route path="/welcome" element={<WelcomePage />} />
                <Route path="/game" element={<Game />} />
            </Routes>
        </Router>
    );
}

export default App;

