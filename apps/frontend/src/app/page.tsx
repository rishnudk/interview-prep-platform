import { Navbar } from '@/components/marketing/navbar';
import { Hero } from '@/components/marketing/hero';
import { ProductShowcase } from '@/components/marketing/product-showcase';
import { Footer } from '@/components/marketing/footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-fey-ink text-fey-white selection:bg-fey-signal/30 selection:text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Hero />
        <ProductShowcase />
      </main>
      <Footer />
    </div>
  );
}
