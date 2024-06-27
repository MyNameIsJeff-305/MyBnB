import LoginFormPage from './components/LoginFormPage';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <div>Welcome! :)</div>
  },
  {
    path: '/login',
    element: <LoginFormPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  )
};

export default App;
