import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import example1 from "@/assets/example-1.jpg";
import example2 from "@/assets/example-2.jpg";
import example3 from "@/assets/example-3.jpg";
import example4 from "@/assets/example-4.jpg";
import example5 from "@/assets/example-5.jpg";

const Examples = () => {
  const examples = [
    {
      src: example1,
      alt: "Flip opportunity listing with photos and key details"
    },
    {
      src: example2,
      alt: "Property specifications and big ticket items"
    },
    {
      src: example3,
      alt: "Investment snapshot with pricing breakdown"
    },
    {
      src: example4,
      alt: "Deal summary and profit potential"
    },
    {
      src: example5,
      alt: "Contact information and branding"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Real DealBlaster Examples</h2>
        
        <Carousel className="w-full max-w-2xl mx-auto mb-12">
          <CarouselContent>
            {examples.map((example, index) => (
              <CarouselItem key={index}>
                <img 
                  src={example.src} 
                  alt={example.alt}
                  className="w-full h-auto rounded-xl border border-gray-800"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
          <CarouselNext className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700" />
        </Carousel>
        
        <p className="text-center text-gray-400 text-lg max-w-3xl mx-auto">
          Each listing is professionally formatted with all the key details buyers need: photos, comps, pricing, closing timeline, and property specifications. No more back-and-forth questions or endless follow-ups.
        </p>
      </div>
    </section>
  );
};

export default Examples;
