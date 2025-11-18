import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="mb-8">
            <img src="https://placehold.co/200x50/000000/white?text=DealBlaster" alt="DealBlaster Logo" className="h-12 mx-auto mb-8" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Generate listings in seconds.<br />Move deals in minutes.
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-300 mb-4">
            Instant Listings. Faster Closings.
          </p>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8">
            Assigned $325K+ at 18 years old in less than 12 months using this exact format.
          </p>
          
          <Button 
            onClick={scrollToForm}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl"
          >
            Join the Waitlist
          </Button>
          
          <p className="text-sm text-gray-500 mt-4">
            Enter your email to get notified when we launch.
          </p>
        </div>

        {/* Testimonial Block */}
        <div className="bg-gray-900 rounded-2xl p-8 max-w-3xl mx-auto border border-gray-800">
          <h3 className="text-xl font-semibold mb-4">Real listing results (testimonial)</h3>
          <div className="bg-gray-800 rounded-xl p-6 mb-4">
            <img src="https://placehold.co/600x400/1a1a1a/white?text=Text+Conversation" alt="Text conversation" className="w-full rounded-lg" />
          </div>
          <p className="text-gray-400 italic mb-2">
            "Sent at 4:13 PM — buyer replied within minutes ready to purchase."
          </p>
          <p className="text-sm text-gray-500">
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
