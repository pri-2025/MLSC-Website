import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import NetworkBackground from "./components/NetworkBackground";

function App() {
  return (
    <div className="min-h-screen text-white relative">
      {/* Background (FULL SCREEN, BEHIND EVERYTHING) */}
      <NetworkBackground />

      {/* Foreground Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="pt-20">
          <Home />
        </main>
      </div>
    </div>
  );
}

export default App;
