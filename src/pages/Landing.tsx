import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Examples from "@/components/Examples";
import Benefits from "@/components/Benefits";
import Founder from "@/components/Founder";
import FinalCTA from "@/components/FinalCTA";
import LeadForm from "@/components/LeadForm";

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white">
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
            <img src="https://placehold.co/150x40/000000/white?text=DealBlaster" alt="DealBlaster Logo" className="h-10 mx-auto" />
          </div>
          <p className="text-gray-400">contact@dealblaster.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
