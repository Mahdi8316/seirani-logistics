import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Story from "@/components/Story";
import Services from "@/components/Services";
import Blog from "@/components/Blog";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import JsonLd from "@/components/JsonLd";

// محتوا از دیتابیس خوانده می‌شود؛ همیشه در زمان درخواست رندر شود.
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Header />
      <main>
        <Hero />
        <Story />
        <Services />
        <Blog />
        <About />
        {/* پنل پایانی: فرم تماس + پاورقی در یک صفحه‌ی کامل (تا snap پاورقی را نبلعد) */}
        <div id="contact" className="contactPanel">
          <Contact />
          <Footer />
        </div>
      </main>
      <ScrollEffects />
    </>
  );
}
