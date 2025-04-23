
import { Video, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return (
    <header className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Video className="h-8 w-8 mr-3" />
          <h1 className="text-2xl font-bold">Posture Peek</h1>
          <p className="ml-4 text-sm opacity-90">Video Analysis Tool</p>
        </div>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/20"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};

export default Header;
