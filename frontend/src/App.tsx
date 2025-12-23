import { useEffect } from "react";
import Home from "./pages/Home";

export default function App() {
  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", crypto.randomUUID());
    }
  }, []);

  return <Home />;
}
