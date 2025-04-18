import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { type Event } from "../types/content";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ArrowLeft } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;

      try {
        const eventRef = doc(db, "events", id);
        const eventDoc = await getDoc(eventRef);

        if (eventDoc.exists()) {
          const eventData = eventDoc.data();
          setEvent({
            id: eventDoc.id,
            title: eventData.title || "",
            date: eventData.date || "",
            description: eventData.description || "",
            location: eventData.location || "",
            imageUrl: eventData.imageUrl || "",
            ieeeCount: eventData.ieeeCount || 0,
            nonIeeeCount: eventData.nonIeeeCount || 0
          });
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-700">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">Event Not Found</h1>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Image - fits without being cut */}
        <div className="w-full overflow-hidden rounded-lg mb-8">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          {event.title}
        </h1>

        {/* Date and Location */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-purple-700">
            <CalendarIcon className="h-5 w-5" />
            <span>{event.date}</span>
          </div>

          <div className="flex items-center gap-2 text-purple-700">
            <MapPinIcon className="h-5 w-5" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Event Description</h2>
          <div className="whitespace-pre-wrap">{event.description}</div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
