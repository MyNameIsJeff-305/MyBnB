import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import SpotDetails from './components/SpotDetails';
import CreateSpot from './components/CreateSpot';
import PageNotFound from './components/PageNotFound';
import * as sessionActions from './store/session';

import './index.css';
import Splash from './components/Splash/Splash';

function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => {
      setIsLoaded(true)
    });
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      <div className='nav-bar'></div>
      {isLoaded && <Outlet />}
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Splash />
      },
      {
        path: '/spots/:spotId',
        element: <SpotDetails />
      },
      {
        path: '/spots/new',
        element: <CreateSpot />
      },
      {
        path: '*',
        element: <PageNotFound />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
