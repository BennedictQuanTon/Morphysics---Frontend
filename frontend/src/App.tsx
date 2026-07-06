import { useEffect, useState } from "react";
import { ThemeProvider } from "@/hooks/useTheme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";
import { SolenoidTransition } from "@/sections/SolenoidTransition";
import { Partners } from "@/sections/Partners";
import { ProductOverview } from "@/sections/ProductOverview";
import { Problem } from "@/sections/Problem";
import { Solution } from "@/sections/Solution";
import { Pricing } from "@/sections/Pricing";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";
import { About } from "@/sections/About";

export default function App() {
  const [currentHash, setCurrentHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
      // Scroll to top when routing changes
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const isAboutPage = currentHash === "#about";

  return (
    <ThemeProvider>
      <Navbar />
      <main>
        {isAboutPage ? (
          <About />
        ) : (
          <>
            <Hero />
            <SolenoidTransition />
            <Partners />
            <ProductOverview />
            <Problem />
            <Solution />
            <Testimonials />
            <Pricing />
            <Contact />
          </>
        )}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
