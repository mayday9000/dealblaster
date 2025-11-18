import lucasPhoto from "@/assets/lucas-founder.png";

const Founder = () => {
  return (
    <section className="bg-black py-16">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-12">
          Founder
        </h2>
        
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <img 
            src={lucasPhoto} 
            alt="Lucas - Founder" 
            className="h-64 w-64 object-cover object-top rounded-lg flex-shrink-0"
          />
          <div className="flex-1">
            <p className="text-lg text-white leading-relaxed text-center lg:text-left">
              <strong>About Lucas</strong> — From working my own deals, to working dispo for Tony Mont & Eric Cline, to moving JV deals for other wholesalers and my students—I've assigned $325,605 in less than 12 months at just 18 years old by using these listings to market them. I closed my very first deal—and many after—sight unseen with this format. I turned 19 on July 28th and decided to build DealBlaster so wholesalers at any level can market better and sell faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
