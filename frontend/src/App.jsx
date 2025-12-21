import Navbar from "./components/Navbar";
import Home from "./pages/Home";

function App() {
  return (
    <div className="min-h-screen bg-grid text-white">
      <Navbar />
      <main className="pt-20">
        <Home />
      </main>
    </div>
  );
}

export default App;
