import { useState } from "react";
import { Menu, X } from "lucide-react";
import MlscLogo from "../assets/mlsc_logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    { label: "Home", id: "home" },
    { label: "About Us", id: "about" },
    { label: "The Team", id: "team" },
    { label: "Achievements", id: "achievements" },
    { label: "Events", id: "events" },
    { label: "Contact Us", id: "contact" },
  ];

  const handleScroll = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = -80; // navbar height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + offset;

      window.scrollTo({ top: y, behavior: "smooth" });
      setOpen(false); // close mobile menu
    }
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-[#182C4A]">
      <div className="px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src={MlscLogo}
            alt="MLSC Logo"
            className="w-10 h-10 object-contain"
          />
          <div>
            <h1 className="font-semibold text-lg text-white">MLSC</h1>
            <p className="text-sm text-[#50C8DC]">
              Microsoft Learn Student Club
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-8 text-sm font-medium text-white">
          {navLinks.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleScroll(item.id)}
                className="hover:text-[#50C8DC] transition"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#182C4A] border-t border-white/10">
          <ul className="flex flex-col py-6 px-6 gap-6 text-sm font-medium text-white">
            {navLinks.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleScroll(item.id)}
                  className="w-full text-left hover:text-[#50C8DC] transition"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
