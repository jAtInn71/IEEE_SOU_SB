import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ArrowLeft } from "lucide-react";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AwardDetails = () => {
  const { id } = useParams();
  const [award, setAward] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAward = async () => {
      if (!id) return;

      try {
        const awardRef = doc(db, "awards", id);
        const awardDoc = await getDoc(awardRef);

        if (awardDoc.exists()) {
          const awardData = awardDoc.data();
          setAward({
            id: awardDoc.id,
            name: awardData.name || "",
            date: awardData.date || "",
            description: awardData.description || "",
            recipient: awardData.recipient || "",
            imageUrl: awardData.imageUrl || ""
          });
        }
      } catch (error) {
        console.error("Error fetching award:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAward();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-purple-700">Loading award details...</p>
      </div>
    );
  }

  if (!award) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-purple-900 mb-4">Award Not Found</h1>
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
            src={award.imageUrl}
            alt={award.name}
            className="w-full h-auto object-contain rounded-lg"
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 mb-4">
          {award.name}
        </h1>

        {/* Date */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2 text-purple-700">
            <CalendarIcon className="h-5 w-5" />
            <span>{award.date}</span>
          </div>
        </div>

        {/* Recipient */}
        <p className="text-lg text-purple-700 mb-6">
          <span className="font-medium">Recipient:</span> {award.recipient}
        </p>

        {/* Description */}
        <div className="prose prose-purple max-w-none">
          <h2 className="text-2xl font-semibold text-purple-800 mb-4">Award Description</h2>
          <div className="whitespace-pre-wrap">{award.description}</div>
        </div>
      </div>
    </div>
  );
};

export default AwardDetails;
