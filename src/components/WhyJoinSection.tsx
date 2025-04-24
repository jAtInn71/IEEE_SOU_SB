
import { useEffect, useRef } from "react";
import { FeatureItem } from "@/types";

const FEATURES: FeatureItem[] = [
  {
    id: 1,
    title: "Keep Technically Up to Date",
    description: "Access cutting-edge research, publications, and technical information. Stay ahead with workshops, webinars, and conferences focused on the latest technological advancements and innovations.",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    alt: "Technical Knowledge"
  },
  {
    id: 2,
    title: "Join Global Network",
    description: "Connect with over 400,000 IEEE members worldwide. Build relationships with professionals, academics, and fellow students that can last throughout your career and open doors to collaboration and opportunities.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    alt: "Global Network"
  },
  {
    id: 3,
    title: "Gain Expertise, Open Career Doors",
    description: "Develop leadership, communication, and teamwork skills. Enhance your resume with IEEE activities and certifications while gaining access to career resources, job portals, and mentorship opportunities.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
    alt: "Career Growth"
  }
];

export default function WhyJoinSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = sectionRef.current?.querySelectorAll(".animate-on-scroll");
    if (elements) {
      elements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (elements) {
        elements.forEach((el) => observer.unobserve(el));
      }
    };
  }, []);

  return (
    <div
      id="why-join-section"
      ref={sectionRef}
      className="section-container"
    >
      <div className="text-center mb-16">
        <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
          Why Silver Oak University IEEE SB?
        </h2>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6 animate-on-scroll" />
      </div>

      <div className="space-y-24 md:space-y-32">
        {FEATURES.map((feature) => (
          <div
            key={feature.id}
            className={`flex flex-col ${
              feature.id % 2 === 0 ? "md:flex-row-reverse" : "md:flex-row"
            } gap-8 md:gap-12 items-center`}
          >
            <div className="w-full md:w-1/2 animate-on-scroll">
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/10 rounded-xl rotate-3 dark:bg-primary/5"></div>
                <img
                  src={feature.image}
                  alt={feature.alt}
                  className="relative rounded-lg w-full h-auto object-cover shadow-lg"
                  style={{ height: "320px" }}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 animate-on-scroll">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">{feature.title}</h3>
              <p className="text-muted-foreground text-balance">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
