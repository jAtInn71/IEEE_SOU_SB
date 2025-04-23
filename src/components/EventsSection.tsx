
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Event } from "@/types";
import { cn } from "@/lib/utils";

const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Technical Workshop on AI",
    description: "Learn about the fundamentals of Artificial Intelligence and its applications in today's world.",
    date: "May 15, 2023",
    time: "10:00 AM - 12:00 PM",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=600&q=80",
    link: "https://example.com/event1"
  },
  {
    id: "2",
    title: "IEEE Day Celebration",
    description: "Join us for the celebration of IEEE Day with exciting activities and networking opportunities.",
    date: "October 4, 2023",
    time: "2:00 PM - 5:00 PM",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    link: "https://example.com/event2"
  },
  {
    id: "3",
    title: "Webinar on Quantum Computing",
    description: "Discover the future of computing with leading experts in the field of quantum computing.",
    date: "June 22, 2023",
    time: "11:00 AM - 1:00 PM",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=600&q=80",
    link: "https://example.com/event3"
  }
];

export default function EventsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % SAMPLE_EVENTS.length);
  };

  const prevSlide = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + SAMPLE_EVENTS.length) % SAMPLE_EVENTS.length);
  };

  // Auto slide functionality
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Reset interval when manually changing slides
  const handleManualChange = (callback: () => void) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    callback();
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

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

  const currentEvent = SAMPLE_EVENTS[activeIndex];

  return (
    <div 
      ref={sectionRef}
      className="section-container"
    >
      <div className="text-center mb-12">
        <h2 className="animate-on-scroll text-3xl md:text-4xl font-bold mb-4">
          Upcoming Events
        </h2>
        <div className="w-24 h-1.5 bg-primary mx-auto rounded-full mb-6 animate-on-scroll" />
      </div>

      <div className="animate-on-scroll max-w-4xl mx-auto relative px-10">
        {/* Navigation arrows outside the slider */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 hover:bg-background shadow-md"
          onClick={() => handleManualChange(prevSlide)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 rounded-full bg-background/80 hover:bg-background shadow-md"
          onClick={() => handleManualChange(nextSlide)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="relative overflow-hidden rounded-xl shadow-lg">
          <div className="flex transition-transform duration-500 ease-in-out h-[450px] md:h-[400px]" 
               style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
            {SAMPLE_EVENTS.map((event, index) => (
              <div 
                key={event.id}
                className={cn(
                  "min-w-full flex flex-col md:flex-row glass transition-opacity duration-300",
                  index === activeIndex ? "opacity-100" : "opacity-0"
                )}
              >
                <div className="md:w-1/2">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-[200px] md:h-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-1/2 flex flex-col justify-center">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <p className="mb-4">{event.description}</p>
                  <Button 
                    variant="ghost" 
                    className="group text-primary p-0 h-auto self-start mt-auto" 
                    asChild
                  >
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      Learn More 
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Dots indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {SAMPLE_EVENTS.map((_, index) => (
              <button
                key={index}
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  index === activeIndex ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"
                )}
                onClick={() => handleManualChange(() => setActiveIndex(index))}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="text-center mt-8">
        <Button asChild>
          <a href="/events">View All Events</a>
        </Button>
      </div>
    </div>
  );
}
