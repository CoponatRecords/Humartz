import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background text-foreground border-t border-border pt-12 pb-8 transition-colors duration-300">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
              Humartz<span className="text-primary animate-pulse">.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where human creativity meets digital precision. Building the next generation of authenticity.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Explore</h3>
            <ul className="space-y-2">
              <li><a href="/whitepaper" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Whitepaper</a></li>
              <li><a href="/pricing" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Pricing</a></li>
              <li><a href="/about" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">About</a></li>
            </ul>
          </div>

          {/* Social */}
           <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Connect</h3>
            <ul className="space-y-2">
              <li><a href="https://www.linkedin.com/in/sebastiencoponat/" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">LinkedIn</a></li>
              <li><a href="https://github.com/CoponatRecords/Humartz" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">GitHub</a></li>
              {/* <li><a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Twitter</a></li> */}
            </ul>
          </div> 

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-xs opacity-70">
            © {currentYear} Humartz Studio. All rights reserved.
          </p>
          <p className="text-muted-foreground text-xs opacity-70">
            Built with <span className="text-destructive">♥</span> for humans by Sébastien Coponat.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;