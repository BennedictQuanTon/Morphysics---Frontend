import { ThemeProvider } from "@/hooks/useTheme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/sections/Hero";
import { Partners } from "@/sections/Partners";
import { ProductOverview } from "@/sections/ProductOverview";
import { Problem } from "@/sections/Problem";
import { Solution } from "@/sections/Solution";
import { Pricing } from "@/sections/Pricing";
import { Testimonials } from "@/sections/Testimonials";
import { Contact } from "@/sections/Contact";

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <ProductOverview />
        <Problem />
        <Solution />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
