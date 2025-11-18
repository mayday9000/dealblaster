import { Button } from "@/components/ui/button";
import dealblasterLogo from "@/assets/dealblaster-logo.png";
import textConversation from "@/assets/text-conversation.png";

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="container mx-auto max-w-4xl text-center space-y-6">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img 
            src={dealblasterLogo} 
            alt="DealBlaster logo" 
            className="max-w-full h-auto object-contain"
          />
        </div>
        
        {/* Tagline */}
        <p className="text-xl lg:text-2xl text-white mb-6">
          Generate listings in seconds. Move deals in minutes.
        </p>
        
        {/* Main Headline */}
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6">
          Instant Listings. Faster Closings.
        </h1>
        
        {/* Subheadline */}
        <p className="text-lg text-white mb-8">
          Assigned $325K+ at 18 years old in less than 12 months using this exact format.
        </p>
        
        {/* CTA Button */}
        <Button 
          onClick={scrollToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-8 py-6 rounded-xl w-full sm:w-auto"
        >
          Join the Waitlist
        </Button>
        
        {/* CTA Subtext */}
        <p className="text-lg text-white">
          Enter your email to get notified when we launch.
        </p>

        {/* Testimonial Block */}
        <div className="mt-16 max-w-2xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Real listing results (testimonial)</h3>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden mb-6 max-w-md mx-auto">
            <img 
              src={textConversation} 
              alt="Text conversation showing Lucas sharing professional listing PDF and buyer showing immediate interest and requesting access" 
              className="w-full h-auto max-h-80 object-contain"
            />
          </div>
          
          <p className="text-white text-lg mb-4">
            Text conversation showing professional listing PDF and buyer showing immediate interest
          </p>
          
          <p className="text-white text-xl italic mb-2">
            "Sent at 4:13 PM — buyer replied within minutes ready to purchase."
          </p>
          
          <p className="text-white text-sm">
            Real result from a standard DealBlaster listing.
          </p>
        </div>
      </div>

      {/* Sticky bottom CTA for mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black border-t border-gray-800 md:hidden z-50">
        <Button 
          onClick={scrollToForm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg rounded-xl"
        >
          Join the Waitlist
        </Button>
      </div>
    </section>
  );
};

export default Hero;
