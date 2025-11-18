import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Examples = () => {
  const examples = [
    {
      src: "https://placehold.co/800x1200/1a1a1a/white?text=Example+1",
      alt: "Flip opportunity listing with photos and key details"
    },
    {
      src: "https://placehold.co/800x1200/1a1a1a/white?text=Example+2",
      alt: "Property specifications and big ticket items"
    },
    {
      src: "https://placehold.co/800x1200/1a1a1a/white?text=Example+3",
      alt: "Investment snapshot with pricing breakdown"
    },
    {
      src: "https://placehold.co/800x1200/1a1a1a/white?text=Example+4",
      alt: "Deal summary and profit potential"
    },
    {
      src: "https://placehold.co/800x1200/1a1a1a/white?text=Example+5",
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
