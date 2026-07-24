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
import { FAQ } from "@/sections/FAQ";
import { Assets } from "@/sections/Assets";
import { Login } from "@/sections/Login";
import { Signup } from "@/sections/Signup";
import { Dashboard } from "@/sections/Dashboard";

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
  const isFaqPage = currentHash === "#faq";
  const isAssetsPage = currentHash === "#assets";
  const isLoginPage = currentHash === "#login";
  const isSignupPage = currentHash === "#signup";
  const isDashboardPage = currentHash.startsWith("#dashboard");
  const isAuthPage = isLoginPage || isSignupPage;

  return (
    <ThemeProvider>
      {!isAuthPage && !isDashboardPage && <Navbar />}
      <main>
        {isLoginPage ? (
          <Login />
        ) : isSignupPage ? (
          <Signup />
        ) : isAboutPage ? (
          <About />
        ) : isFaqPage ? (
          <FAQ />
        ) : isAssetsPage ? (
          <Assets />
        ) : isDashboardPage ? (
          <Dashboard currentHash={currentHash} />
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
      {!isAuthPage && !isDashboardPage && <Footer />}
    </ThemeProvider>
  );
}
