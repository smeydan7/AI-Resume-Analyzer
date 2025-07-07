import { Navigation } from "./components/common/navigation";

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Create some basic page components
const Dashboard = () => <div>Dashboard Page</div>;
const Upload = () => <div>Upload Resume Page</div>;
const Analysis = () => <div>Analysis Page</div>;
const Settings = () => <div>Settings Page</div>;

function App() {
    return (
        <Router>
            <div>
                <Navigation />
                <main>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/analysis" element={<Analysis />} />
                        <Route path="/settings" element={<Settings />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;