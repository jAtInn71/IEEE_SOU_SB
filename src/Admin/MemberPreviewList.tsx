import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

interface MemberPreviewListProps {
  setEditMember: (member: any) => void;
  setShowMemberModal: (show: boolean) => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const MemberPreviewList: React.FC<MemberPreviewListProps> = ({
  setEditMember,
  setShowMemberModal,
  setSuccess,
  setError,
}) => {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeType, setActiveType] = useState<string>("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [membersPerPage] = useState<number>(4);

  // Member types with labels for filtering
  const memberTypes = [
    { value: "all", label: "All Members" },
    { value: "faculty", label: "Faculty" },
    { value: "advisory", label: "Advisory Board" },
    { value: "executive", label: "Executive Committee" },
    { value: "core", label: "Core Committee" },
    { value: "member", label: "Members" },
  ];

  // Fetch members from Firestore
  const fetchMembers = async () => {
    setLoading(true);
    try {
      let membersQuery;

      if (activeType === "all") {
        membersQuery = query(collection(db, "members"), orderBy("createdAt", "desc"));
      } else {
        membersQuery = query(
          collection(db, "members"),
          where("type", "==", activeType),
          orderBy("createdAt", "desc")
        );
      }

      const querySnapshot = await getDocs(membersQuery);
      const membersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembers(membersList);
    } catch (err: any) {
      setError(`Error fetching members: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Delete a member
  const handleDelete = async (memberId: string) => {
    try {
      await deleteDoc(doc(db, "members", memberId));
      setSuccess("Member deleted successfully!");
      setConfirmDelete(null);
      fetchMembers();
    } catch (err: any) {
      setError(`Error deleting member: ${err.message}`);
    }
  };

  // Edit a member
  const handleEdit = (member: any) => {
    setEditMember(member);
    setShowMemberModal(true);
  };

  // Filter members based on search query
  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Fetch members on component mount and when activeType or searchQuery changes
  useEffect(() => {
    fetchMembers();
  }, [activeType]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter tabs */}
      <div className="flex border-b overflow-x-auto scrollbar-thin">
        {memberTypes.map((type) => (
          <button
            key={type.value}
            className={`px-4 py-3 whitespace-nowrap font-medium transition-colors ${
              activeType === type.value
                ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setActiveType(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Members"
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No members message */}
      {!loading && filteredMembers.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No members found. Add a new member to get started.</p>
        </div>
      )}

      {/* Members grid */}
      {!loading && currentMembers.length > 0 && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="object-cover w-full h-64"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                    <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
                    <p className="text-gray-600">{member.designation}</p>

                    {member.department && (
                      <p className="text-gray-500 text-sm mt-1">
                        <span className="font-medium">Department:</span> {member.department}
                      </p>
                    )}

                    {member.position && (
                      <p className="text-gray-500 text-sm mt-1">
                        <span className="font-medium">Position:</span> {member.position}
                      </p>
                    )}

                    {member.education && (
                      <p className="text-gray-500 text-sm mt-1">
                        <span className="font-medium">Education:</span> {member.education}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path
                              d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                            />
                          </svg>
                        </a>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h12a2 2 0 002-2v-7m-9 0l4-4m0 0l4 4m-4-4v12"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(member.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredMembers.length > 0 && (
        <div className="flex justify-center space-x-4 py-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * membersPerPage >= filteredMembers.length}
            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberPreviewList;
