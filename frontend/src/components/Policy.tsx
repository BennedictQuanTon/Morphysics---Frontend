export function Policy() {
  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-white">
          Terms of Service & Privacy Policy
        </h2>
        <p className="text-gray-400 mt-2">Last updated: May 2026</p>
      </div>

      <div className="bg-[#1f2236] border border-[#ffc800]/20 rounded-xl p-6 space-y-6 text-gray-300">
        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-white">
            1. Terms of Service
          </h3>
          <p className="text-sm leading-relaxed">
            Welcome to MorPhysics. By accessing or using our platform, you agree
            to comply with and be bound by these terms. If you do not agree,
            please do not use the services.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-white">
            2. Privacy Policy
          </h3>
          <p className="text-sm leading-relaxed">
            Your privacy is highly important to us. We collect necessary
            credentials (such as emails) solely to provide customized access to
            our virtual laboratory, progress trackers, and user profiles. We do
            not sell or lease your personal information to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-semibold text-white">
            3. Intellectual Property
          </h3>
          <p className="text-sm leading-relaxed">
            All code, simulation assets, logos, and physics models built into
            MorPhysics are the intellectual property of MorPhysics. You are
            granted a limited license to explore and use these assets for
            academic and educational purposes.
          </p>
        </section>
      </div>
    </div>
  );
}
