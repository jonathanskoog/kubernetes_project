import Navigationbar from "./components/navbar";
import InputSection from "./components/input";
import "./index.css";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(useGSAP);

function App() {
  useGSAP(() => {
    gsap.from(".heading", { delay: 0.5, y: 50, opacity: 0, stagger: 0.3 });
  }, []);

  return (
    <div className="bg-gray-600 w-screen h-screen">
      <Navigationbar />
      <div className="flex flex-col w-fit m-auto mt-24 gap-4 ">
        <h1 className="text-7xl text-center text-zinc-100 font-bold heading">
          Welcome to <span className="text-zinc-900 underline">Audiofy</span>
        </h1>
        <h1 className="text-7xl text-center text-zinc-100 font-bold heading">
          HEJSANsss"
        </h1>
      </div>
      <InputSection />
    </div>
  );
}

export default App;
