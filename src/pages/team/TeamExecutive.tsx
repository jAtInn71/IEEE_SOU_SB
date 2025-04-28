import { useState, useEffect } from "react";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const SOCIETY_TITLES = {
  SB: "Student Branch",
  WIE: "Women in Engineering",
  CS: "Computer Society",
  SPS: "Signal Processing Society",
  SIGHT: "Special Interest Group on Humanitarian Technology",
};

const POSITION_HIERARCHY = [
  "Chairperson",
  "Vice Chairperson",
  "Secretary",
  "Treasurer",
  "Webmaster",
];

export default function TeamExecutive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [executiveMembers, setExecutiveMembers] = useState<Record<string, any[]>>({});

  useEffect(() => {
    async function fetchExecutiveMembers() {
      const membersRef = collection(db, "members");
      const q = query(membersRef, where("type", "==", "executive"));
      const querySnapshot = await getDocs(q);

      const grouped: Record<string, any[]> = {
        SB: [],
        WIE: [],
        CS: [],
        SPS: [],
        SIGHT: [],
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const societyType = data.society; // should be 'SB', 'WIE', etc.
        if (grouped[societyType]) {
          grouped[societyType].push({ ...data, id: doc.id });
        }
      });

      setExecutiveMembers(grouped);
    }

    fetchExecutiveMembers();
  }, []);

  const filterMembers = (members: any[]) =>
    members.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortMembersByPosition = (members: any[]) => {
    return members.sort((a, b) => {
      const aPosIndex = POSITION_HIERARCHY.indexOf(a.position);
      const bPosIndex = POSITION_HIERARCHY.indexOf(b.position);
      return aPosIndex - bPosIndex;
    });
  };

  // Define hover colors for each society using hex codes
  const hoverColors: Record<string, string> = {
    SB: "#cce4ff", // Light blue
    WIE: "#f3d1ff", // Light purple
    CS: "#FAF1E3", // Light green
    SPS: "#E9F2E9", // Light yellow
    SIGHT: "#ffd6e7", // Light pink
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: 'url(/path/to/your/image.jpg)' }}>
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in bg-black bg-opacity-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Executive Team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-white">
              Meet the executive members of each IEEE society.
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search executive..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {Object.entries(SOCIETY_TITLES).map(([societyKey, title]) => {
            const members = filterMembers(executiveMembers[societyKey] || []);
            if (members.length === 0) return null;

            // Sort members based on the predefined position hierarchy
            const sortedMembers = sortMembersByPosition(members);

            return (
              <div key={societyKey} className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-primary text-white">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedMembers.map((member) => {
                    // Handle positions specifically for Chairperson, Vice Chairperson, Secretary, etc.
                    const formattedPosition = member.position
                      .replace(/vice chairperson/i, "Vice Chairperson")
                      .replace(/chairperson/i, "Chairperson")
                      .replace(/secretary/i, "Secretary")
                      .replace(/treasurer/i, "Treasurer")
                      .replace(/webmaster/i, "Webmaster");

                    return (
                      <div
                        key={member.id}
                        className="glass rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                        style={{
                          backgroundColor: "#ffffff", // Default white background
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor =
                            hoverColors[societyKey] || "#f0f0f0"; // Default light gray
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.backgroundColor = "#ffffff"; // Reset to white
                        }}
                      >
                        <div className="p-6">
                          <div className="flex items-start mb-4">
                            <div className="w-16 h-16 min-w-16 rounded-full overflow-hidden mr-4">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-bold text-lg">{member.name}</h3>
                                <a
                                  href={member.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="ml-2 text-primary hover:text-primary/80"
                                >
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              </div>
                              <p className="text-sm text-muted-foreground">{formattedPosition}</p>
                              <p className="text-sm text-muted-foreground">{member.education}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
