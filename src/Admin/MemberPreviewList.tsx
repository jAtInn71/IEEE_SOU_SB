import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
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

  const memberTypes = [
    { value: "all", label: "All Members" },
    { value: "faculty", label: "Faculty" },
    { value: "advisory", label: "Advisory Board" },
    { value: "executive", label: "Executive Committee" },
    { value: "core", label: "Core Committee" },
    { value: "member", label: "Members" },
  ];

  const fetchMembers = async () => {
    setLoading(true);
    try {
      let membersQuery;

      if (activeType === "all") {
        membersQuery = query(
          collection(db, "members"),
          orderBy("createdAt", "desc")
        );
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

  const handleEdit = (member: any) => {
    setEditMember(member);
    setShowMemberModal(true);
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.position?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(
    indexOfFirstMember,
    indexOfLastMember
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchMembers();
  }, [activeType]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Filter Tabs */}
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

      {/* Search Bar */}
      <div className="p-4">
        <input
          type="text"
          placeholder="Search Members"
          className="w-full px-4 py-2 rounded-lg border border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* No Members Found */}
      {!loading && filteredMembers.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No members found. Add a new member to get started.
        </div>
      )}

      {/* Member Cards */}
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
                      e.currentTarget.src =
                        "https://via.placeholder.com/300x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-64 flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-16 h-16 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.designation}</p>
                {member.department && (
                  <p className="text-sm text-gray-500">Dept: {member.department}</p>
                )}
                {member.position && (
                  <p className="text-sm text-gray-500">Position: {member.position}</p>
                )}
                {member.education && (
                  <p className="text-sm text-gray-500">Education: {member.education}</p>
                )}

                <div className="flex justify-between items-center mt-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      LinkedIn
                    </a>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(member)}
                      title="Edit"
                      className="text-gray-500 hover:text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setConfirmDelete(member.id)}
                      title="Delete"
                      className="text-gray-500 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
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

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this member?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberPreviewList;
