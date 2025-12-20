import Carousel from "../components/Carousel";
import EventsSection from "../components/events/EventsSection";
import Contact from "./Contact.jsx";
import Achievements from "./Achievements.jsx";
export default function Home() {
  return (
     <>
          <Carousel/>
         <EventsSection/>
         <Achievements/>
         <Contact/>
      
     </>
  );
}
