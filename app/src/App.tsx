import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster position="top-center" />
      <Home />
    </div>
  );
}

export default App;
