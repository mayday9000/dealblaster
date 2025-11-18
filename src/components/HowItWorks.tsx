const HowItWorks = () => {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-blue-600 mb-4">1</div>
            <h3 className="text-2xl font-semibold mb-4">Upload Info</h3>
            <p className="text-gray-400">
              Address, photos, comps, disclosures, notes.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-blue-600 mb-4">2</div>
            <h3 className="text-2xl font-semibold mb-4">Auto-generate the listing</h3>
            <p className="text-gray-400">
              Generate listing with the click of a button with integrated links, plus AI summaries and an eye-catching headline—all in one. Buyers don't have to dig for comps or circle back later—you've already done the work for them.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-4xl font-bold text-blue-600 mb-4">3</div>
            <h3 className="text-2xl font-semibold mb-4">Share & blast</h3>
            <p className="text-gray-400">
              Blast the deal to your buyers using the link or PDF via email or text. Coming soon: email + SMS blast inside DealBlaster (CRM integration).
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
