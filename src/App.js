import './App.css';
import { Routes, Route } from 'react-router-dom'
import Index from './views/Index';
import Dashboard from './views/Dashboard';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </div>
  );
}

export default App;
