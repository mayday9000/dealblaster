const HowItWorks = () => {
  return (
    <section className="bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-4xl lg:text-5xl font-bold text-white text-center mb-12">
          How It Works
        </h2>
        
        <div className="space-y-8 text-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">1) Upload Info</h3>
            <p className="text-lg text-gray-300">
              Address, photos, comps, disclosures, notes.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">2) Auto-generate the listing</h3>
            <p className="text-lg text-gray-300">
              Generate listing with the click of a button with integrated links, plus AI summaries and an eye-catching headline—all in one. Buyers don't have to dig for comps or circle back later—you've already done the work for them.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">3) Share & blast</h3>
            <p className="text-lg text-gray-300">
              Blast the deal to your buyers using the link or PDF via email or text. Coming soon: email + SMS blast inside DealBlaster (CRM integration).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
