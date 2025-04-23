import { useEffect, useRef, useState } from "react";
import { FactItem } from "@/types";

const FACTS: FactItem[] = [
  {
    value: 413,
    label: "Members",
    suffix: "+"
  },
  {
    value: 123,
    label: "Events",
    suffix: "+"
  },
  {
    value: 33,
    label: "Awards",
    suffix: "+"
  },
  {
    value: 1400,
    label: "Participations",
    suffix: "+"
  }
];

function CountUpNumber({
  end,
  duration = 2000,
  prefix = "",
  suffix = ""
}: {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            let startTime: number;
            const startValue = 0;
            const changeInValue = end - startValue;

            const animateCount = (timestamp: number) => {
              if (!startTime) startTime = timestamp;
              const timeElapsed = timestamp - startTime;
              const progress = Math.min(timeElapsed / duration, 1);

              const easedProgress =
                progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

              const currentCount = Math.floor(
                startValue + changeInValue * easedProgress
              );
              setCount(currentCount);

              if (progress < 1) {
                requestAnimationFrame(animateCount);
              }
            };

            requestAnimationFrame(animateCount);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => {
      if (countRef.current) {
        observer.unobserve(countRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return (
    <div
      ref={countRef}
      className="font-bold text-4xl md:text-5xl text-primary"
    >
      {prefix}
      {count}
      {suffix}
    </div>
  );
}

export default function CountUpSection() {
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
    <div ref={sectionRef} className="py-4 bg-primary/5"> {/* 🔽 Reduced padding here */}
      <div className="section-container">
        <div className="text-center mb-8"> {/* 🔽 Slightly reduced margin below title */}
          <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-3">
            Some Facts About Us
          </h2>
          <div className="w-24 h-1.5 bg-primary mx-auto rounded-full animate-on-scroll" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {FACTS.map((fact, index) => (
            <div
              key={index}
              className="animate-on-scroll text-center p-4 glass rounded-xl shadow-sm"
            >
              <CountUpNumber
                end={fact.value}
                prefix={fact.prefix}
                suffix={fact.suffix}
              />
              <p className="text-lg mt-2 text-muted-foreground">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
