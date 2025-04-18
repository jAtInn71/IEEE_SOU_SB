
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroElements = heroRef.current?.querySelectorAll(".animate-on-scroll");
    if (heroElements) {
      heroElements.forEach((el) => observer.observe(el));
    }

    // Add animation classes immediately on page load
    const animateElements = document.querySelectorAll(".animate-on-load");
    animateElements.forEach((el) => {
      el.classList.add("animated");
    });

    return () => {
      if (heroElements) {
        heroElements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  const scrollToNext = () => {
    const nextSection = document.getElementById("why-join-section");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      ref={heroRef} 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 to-background"></div>
      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 mx-auto text-center">
        <h1 
          className="animate-on-load opacity-0 animate-fade-in text-4xl md:text-6xl font-bold mb-6 tracking-tight flex flex-col gap-2"
          style={{ 
            transform: `translateY(${scrollY * -0.2}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <span className="animation-delay-100">Welcome to</span>
          <span className="text-primary animation-delay-300">Silver Oak University</span>
          <span className="text-primary animation-delay-500">IEEE Student Branch</span>
        </h1>
        <div 
          className="animate-on-load opacity-0 animate-fade-in animation-delay-700 flex flex-col sm:flex-row gap-4 justify-center mt-8"
          style={{ 
            transform: `translateY(${scrollY * -0.1}px)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          <Button size="lg" asChild className="animate-scale-in">
            <a href="#why-join-section">Discover More</a>
          </Button>
          <Button size="lg" variant="outline" asChild className="animate-scale-in animation-delay-300">
            <a href="/events">View Events</a>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={scrollToNext}
          className="rounded-full"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
