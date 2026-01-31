import React from 'react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="py-24 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-[0.3em] text-primary mb-6">
            A Coponat Records Initiative
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 text-foreground">
            Empowering the <br /> 
            <span className="text-primary italic">Sovereign Artist.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light mb-10">
            Humartz is dedicated to providing creators with the digital armor they need to protect their legacy and amplify their voice.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/whitepaper" 
              className="text-sm font-mono border border-primary/50 px-6 py-2 rounded-full hover:bg-primary/10 transition-colors"
            >
              Read the Whitepaper v1.0
            </Link>
          </div>
        </div>
      </section>

      {/* The Vision: Empowerment & Protection */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold border-l-4 border-primary pl-4">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              In an era of rapid digital replication, the artist's greatest challenge is 
              maintaining ownership of their spark. 
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong>Humartz</strong> acts as a technical vanguard 
              for <strong>Artists</strong>. We believe technology should serve the artist—not the 
              other way around. We design digital tools to protect creativity.
            </p>
          </div>
          <div className="bg-muted p-12 rounded-3xl border border-border shadow-inner">
             <div className="space-y-4">
                <h4 className="text-2xl font-semibold">AI generates content, humans create Art. We exist to protect the difference.</h4>
             </div>
          </div>
        </div>
      </section>

      {/* Empowerment Pillars */}
      <section className="py-20 bg-muted/20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-center text-2xl font-bold mb-16 uppercase tracking-widest opacity-50">Our Commitment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Pillar 1 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background border border-border flex flex-col items-center">
              <div className="text-3xl">🛡️</div>
              <h4 className="text-xl font-semibold text-foreground">Digital Protection</h4>
              <p className="text-sm text-muted-foreground">
                Implementing advanced security and verification protocols to safeguard intellectual property. 
              </p>
              <Link href="/whitepaper" className="text-xs text-primary underline underline-offset-4 hover:opacity-80 pt-2">
                How we certify human origin
              </Link>
            </div>
            {/* Pillar 2 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background border border-border">
              <div className="text-3xl">🎨</div>
              <h4 className="text-xl font-semibold text-foreground">Creative Sovereignty</h4>
              <p className="text-sm text-muted-foreground">Giving artists full control over how their work is distributed, viewed, and monetized.</p>
            </div>
            {/* Pillar 3 */}
            <div className="space-y-4 p-6 rounded-2xl bg-background border border-border">
              <div className="text-3xl">🚀</div>
              <h4 className="text-xl font-semibold text-foreground">Empower Artists</h4>
              <p className="text-sm text-muted-foreground">Using technology to enhance the reach and impact of authentic human creativity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-bold text-foreground">Secure your creative future.</h2>
          <p className="text-muted-foreground text-lg">
            Join the movement of artists who refuse to compromise.
          </p>
          <div className="flex justify-center gap-6">
            <button className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              Contact Us
            </button>

          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;