import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Examples from "@/components/Examples";
import Benefits from "@/components/Benefits";
import Founder from "@/components/Founder";
import FinalCTA from "@/components/FinalCTA";
import LeadForm from "@/components/LeadForm";
import dealblasterLogo from "@/assets/dealblaster-logo.png";
import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";

const Landing = () => {
  const { session } = useSession();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple top nav for landing */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <img src={dealblasterLogo} alt="DealBlaster" className="h-8" />
            <div className="flex items-center gap-4">
              {session ? (
                <Link to="/app">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                    Log in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Hero />
      <HowItWorks />
      <Examples />
      <Benefits />
      <Founder />
      <FinalCTA />
      <LeadForm />
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <img src={dealblasterLogo} alt="DealBlaster Logo" className="h-10 mx-auto" />
          </div>
          <p className="text-gray-400">contact@dealblaster.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
