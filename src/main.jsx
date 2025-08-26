import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {RouterProvider} from "react-router";
import { Router } from './Router/Route.jsx';
import 'flowbite';
import { HelmetProvider } from 'react-helmet-async';
import AuthProvider from './Context/AuthProvider.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <RouterProvider router={Router} />
      </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)
