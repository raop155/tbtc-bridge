import Home from '@/pages/Home';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

const Navigation = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
    </Router>
  );
};

export { Navigation };
