import { useEffect } from 'react';
import { TextEditor } from './TextEditor'
import {Route, Router, RouterProvider, createBrowserRouter,useNavigate} from 'react-router-dom' 
import { v4 as uuidv4 } from "uuid";
function App() {
  // creating paths to redirect to different routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RedirectToNewDocument />,
    },
    {
      path: "/documents/:id",
      element: <TextEditor />,
    },
  ]);

  return <RouterProvider router={router} />;
}
// Component to handle redirection to a new document
// *****useNavigate hook can only be used in an component******
function RedirectToNewDocument() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/documents/${uuidv4()}`);
  }, [navigate]);

  return <div>Loading...</div>; // You can show a loading screen while navigating
}
export default App;
