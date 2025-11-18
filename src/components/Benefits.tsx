const Benefits = () => {
  return (
    <section className="py-20 px-4 bg-gray-950">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">Benefits</h2>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-blue-600 text-2xl mb-4">✓</div>
            <p className="text-lg">
              Comps with integrated links justify price instantly.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-blue-600 text-2xl mb-4">✓</div>
            <p className="text-lg">
              All deal info in one place (photos, comps, closing details, disclosures).
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-blue-600 text-2xl mb-4">✓</div>
            <p className="text-lg">
              Fewer walkthroughs, fewer questions (sight-unseen friendly).
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
            <div className="text-blue-600 text-2xl mb-4">✓</div>
            <p className="text-lg">
              Minutes, not hours — fill the form once, blast deal, answer fewer follow-ups, move deals faster.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
