import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-16 bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
          Ready to move deals faster?
        </h2>
        
        <Button 
          onClick={scrollToForm}
          className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-6 text-lg"
        >
          Join the Waitlist
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
