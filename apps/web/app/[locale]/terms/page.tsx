import React from 'react';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();
  const lastUpdated = "January 30, 2026";

  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Terms of Service</h1>
          <p className="text-muted-foreground text-sm italic">
            Humartz is a brand operated by Coponat Records.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Last updated: {lastUpdated}
          </p>
        </header>

        <section className="space-y-10 leading-relaxed text-muted-foreground">
          
          {/* 1. Acceptance */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the <strong>Humartz</strong> website and services, you agree to be bound by these Terms of Service. These terms constitute a legal agreement between you and the parent company, <strong>Coponat Records</strong>.
            </p>
          </div>

          {/* 2. IP */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Intellectual Property</h2>
            <p>
              All content, including but not limited to audio, text, graphics, logos, and code, is the property of <strong>Coponat Records</strong> or its content suppliers and is protected by international copyright laws.
            </p>
          </div>

          {/* 3. Conduct */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. User Conduct</h2>
            <p>
              Users agree not to use the platform for any unlawful purpose. Any unauthorized use of the "Humartz" brand or Coponat Records assets is strictly prohibited.
            </p>
          </div>

          {/* 4. Liability */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Limitation of Liability</h2>
            <p>
              Coponat Records provides Humartz on an "as is" basis. We shall not be liable for any indirect or consequential damages arising from the use of this website.
            </p>
          </div>

          {/* 5. Governing Law */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms shall be governed by the laws of <strong>France</strong>. In the event of a dispute, exclusive jurisdiction is given to the <strong>courts of Toulon (83000), France</strong>.
            </p>
          </div>

          {/* --- FRENCH MENTIONS LÉGALES SECTION --- */}
          <div className="mt-20 pt-12 border-t-2 border-primary/20 bg-muted/30 p-8 rounded-xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 underline underline-offset-8 decoration-primary">
              Mentions Légales
            </h2>
            
            <div className="grid gap-8">
              {/* Publisher */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground italic">1. Éditeur du site</h3>
                <p className="text-sm">
                  Le site <strong>Humartz</strong> est édité par la société <strong>Coponat Records</strong>.
                </p>
                <ul className="text-sm space-y-1 list-none">
                  <li><strong>Siège social :</strong> [Sanary-sur-mer, France]</li>
                  <li><strong>SIRET :</strong> [881 599 013 00029]</li>
                  <li><strong>Directeur de la publication :</strong> [Sébastien Coponat]</li>
                  <li><strong>Email :</strong> talent@coponatrecords.com</li>
                </ul>
              </div>

              {/* Hosting */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground italic">2. Hébergement</h3>
                <p className="text-sm">
                  Le site est hébergé par :<br />
                  <strong>Vercel Inc.</strong><br />
                  340 S Lemon Ave #1150, Walnut, CA 91789, USA<br />
                  Site web : https://vercel.com
                </p>
              </div>

              {/* Legal Notice */}
              <div className="space-y-2 border-l-4 border-primary pl-4">
                <h3 className="text-lg font-semibold text-foreground italic">3. Litiges</h3>
                <p className="text-sm">
                  Conformément aux dispositions du Code de commerce, tout litige relatif à l’interprétation ou à l’exécution des présentes conditions sera de la compétence exclusive du <strong>Tribunal de Commerce de Toulon</strong>.
                </p>
              </div>
            </div>
          </div>
          
        </section>

        {/* Footer info */}
        <footer className="mt-16 pt-8 border-t border-border text-xs text-center opacity-60">
          <p>© {currentYear} Coponat Records — Humartz Studio. Fait à Sanary-sur-Mer, France.</p>
        </footer>
      </div>
    </div>
  );
};

export default TermsOfService;