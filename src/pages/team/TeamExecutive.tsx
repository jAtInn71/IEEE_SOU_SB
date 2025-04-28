import { useState, useEffect } from "react";
import { Search, Linkedin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

// Define position hierarchy
const positionOrder = [
  "Chairperson",
  "Vice-Chairperson",
  "Secretary",
  "Treasurer",
  "Webmaster",
];

const SOCIETY_TITLES = {
  SB: "Student Branch",
  WIE: "Women in Engineering",
  CS: "Computer Society",
  SPS: "Signal Processing Society",
  SIGHT: "Special Interest Group on Humanitarian Technology",
};

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

  // Function to sort members based on the position order
  const sortMembersByPosition = (members: any[]) => {
    return members.sort((a, b) => {
      return positionOrder.indexOf(a.position) - positionOrder.indexOf(b.position);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-24 pb-16 animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Executive Team</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

            // Sort members by position
            const sortedMembers = sortMembersByPosition(members);

            return (
              <div key={societyKey} className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 text-primary">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedMembers.map((member) => (
                    <div key={member.id} className="glass rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start mb-4">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-16 h-16 rounded-full object-cover mr-4"
                          />
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
                            <p className="text-sm text-muted-foreground">{member.position}</p>
                            <p className="text-sm text-muted-foreground">{member.education}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
