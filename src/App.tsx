import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TodoList } from './pages/TodoList';
import { TodoDetail } from './pages/TodoDetail';
import { ConfigProvider } from 'antd';
import { FloatingEmojis } from 'components/FloatingEmojis/FloatingEmojis';
import { CurrentTime } from 'components/CurrentTime';

const App = () => {
  return (
    <ConfigProvider>
      <div style={{ position: 'fixed', zIndex: 100, right: 0 }}>
        <CurrentTime />
      </div>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <FloatingEmojis />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Router>
            <Routes>
              <Route path="/" element={<TodoList />} />
              <Route path="/todo/:id" element={<TodoDetail />} />
            </Routes>
          </Router>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default App;
