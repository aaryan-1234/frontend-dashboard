import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from "@material-tailwind/react";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <ThemeProvider>
      <App />
      <ToastContainer />
    </ThemeProvider>
  </>
);
