import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<div className="text-4xl font-extrabold">WoodShopPro Dashboard</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
