import React from 'react';

const PrivacyPolicy = () => {
  const lastUpdated = "January 30, 2026";

  return (
    <div className="bg-background text-foreground min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">
            Last updated: {lastUpdated}
          </p>
        </header>

        <section className="space-y-10 leading-relaxed text-muted-foreground">
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              Welcome to Humartz. We respect your privacy and are committed to protecting your personal data. 
              This policy explains how we handle information when you visit our site or use our services.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We may collect several types of information, including:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Personal Identifiers:</strong> Name, email address, and contact details provided via forms.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, and how you interact with our website.</li>
              <li><strong>Cookies:</strong> Small files used to improve your browsing experience.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Data</h2>
            <p>Your information is used to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide and maintain our services.</li>
              <li>Notify you about changes or updates.</li>
              <li>Analyze site usage to improve the "Humartz" experience.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no method of transmission 
              over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Your Rights</h2>
            <p>
              Depending on your location, you have rights regarding your data, including the right to access, 
              correct, or delete the personal information we hold about you. Data written on the blockchain cannot be deleted.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p>
              If you have any questions regarding this Privacy Policy, please contact us at:
            </p>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <p className="text-foreground font-medium">Humartz Privacy Team</p>
              <p className="text-sm">Email: contact@humartz.com</p>
            </div>
          </div>
          
        </section>

        <footer className="mt-16 pt-8 border-t border-border text-xs text-center">
          <p>This is a simplified policy template. Please consult a legal professional for specific compliance.</p>
        </footer>
      </div>
    </div>
  );
};

export default PrivacyPolicy;