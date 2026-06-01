import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import SurfaceGuide from "@/components/SurfaceGuide";
import Pricing from "@/components/Pricing";
import AIEstimator from "@/components/AIEstimator";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Process />
        <SurfaceGuide />
        <Pricing />
        <AIEstimator />
        <ContactForm />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
