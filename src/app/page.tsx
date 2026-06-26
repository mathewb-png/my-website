import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import ServiceArea from "@/components/ServiceArea";
import Process from "@/components/Process";
import SurfaceGuide from "@/components/SurfaceGuide";
import Pricing from "@/components/Pricing";
import AIEstimator from "@/components/AIEstimator";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import LocalBusinessJsonLd from "@/components/LocalBusinessJsonLd";

export default function Home() {
  return (
    <>
      <LocalBusinessJsonLd />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <ServiceArea />
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
