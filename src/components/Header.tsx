
import { Video } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
      <div className="container mx-auto flex items-center">
        <Video className="h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold">Posture Peek</h1>
        <p className="ml-4 text-sm opacity-90">Video Analysis Tool</p>
      </div>
    </header>
  );
};

export default Header;
