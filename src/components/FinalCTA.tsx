import { Button } from "@/components/ui/button";

const FinalCTA = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Ready to move deals faster?
        </h2>
        <Button 
          onClick={scrollToForm}
          className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-lg rounded-xl"
        >
          Join the Waitlist
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
