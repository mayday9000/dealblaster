const Founder = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Founder</h2>
        
        <div className="bg-gray-900 rounded-2xl p-8 md:p-12 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <img 
              src="https://placehold.co/300x300/1a1a1a/white?text=Lucas" 
              alt="Lucas - Founder" 
              className="w-48 h-48 rounded-full object-cover border-4 border-blue-600"
            />
            <div>
              <p className="text-lg text-gray-300 leading-relaxed">
                <span className="font-semibold text-white">About Lucas —</span> From working my own deals, to working dispo for Tony Mont & Eric Cline, to moving JV deals for other wholesalers and my students—I've assigned $325,605 in less than 12 months at just 18 years old by using these listings to market them. I closed my very first deal—and many after—sight unseen with this format. I turned 19 on July 28th and decided to build DealBlaster so wholesalers at any level can market better and sell faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Founder;
