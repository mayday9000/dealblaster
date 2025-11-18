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
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-12">
          Real DealBlaster Examples
        </h2>
        
        <Carousel className="relative w-full overflow-hidden mb-8">
          <CarouselContent>
            {examples.map((example, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden max-w-sm md:max-w-md lg:max-w-lg">
                  <img 
                    src={example.src} 
                    alt={example.alt}
                    className="w-full h-auto"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white/90 text-black border-white hover:bg-white left-4 md:left-8" />
          <CarouselNext className="bg-white/90 text-black border-white hover:bg-white right-4 md:right-8" />
        </Carousel>
        
        <div className="text-center">
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Each listing is professionally formatted with all the key details buyers need: photos, comps, pricing, closing timeline, and property specifications. No more back-and-forth questions or endless follow-ups.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Examples;
