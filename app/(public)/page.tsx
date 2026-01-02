import Hero from "@/components/Hero";
import DoctorProfile from "@/components/DoctorProfile";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import LocationBlock from "@/components/LocationBlock";
import FAQ from "@/components/FAQ";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <DoctorProfile />
      <Testimonials />
      <FAQ />
      <LocationBlock />
    </div>
  );
}
