import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom';

import { getCurrentUser } from './api/userService.ts';
import Footer from './components/Footer/Footer.tsx';
import Header from './components/Header/Header.tsx';
import ScrollToTop from './components/ScrollToTop/ScrollToTop.tsx';
import DestinationPage from './pages/DestinationPage.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import { FormPage } from './pages/FormPage.tsx';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ProfilePage from './pages/ProfilePage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from './redux/slices/userSlice.ts';
import { AppDispatch } from './redux/stores/store.ts';

interface PrivateRouteProps { 
  children: React.ReactNode
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Root() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');

    async function getUser() {
      try {
        if (token) {
          dispatch(signInStart());
          const userData = await getCurrentUser(token);
          dispatch(signInSuccess(userData));
        }
      } catch (err) {
        localStorage.removeItem('token');
        if (err instanceof Error) {
          dispatch(signInFailure(err.message));
        } else {
          dispatch(signInFailure('An unknown error occurred. Try again later'));
        }
      }
    }

    getUser().catch(() => {});
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="min-h-[calc(100vh-var(--footer-height))]">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
        <Route index path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/destinationForm"
          element={<PrivateRoute><FormPage /></PrivateRoute>}
        />
        <Route
          path="/destinationFormEdit/:id"
          element={
            <PrivateRoute>
              <FormPage isEditing />
            </PrivateRoute>
          }
        />
        <Route path="/profile/:username?" element={<ProfilePage />} />
        <Route path="/location/:id" element={<DestinationPage />} />
      </Route>
    )
  );

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
