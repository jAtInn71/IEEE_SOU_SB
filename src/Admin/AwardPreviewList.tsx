import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
  query
} from "firebase/firestore";

interface AwardPreviewListProps {
  setEditAward: (award: any) => void;
  setShowAwardModal: (show: boolean) => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const AwardPreviewList: React.FC<AwardPreviewListProps> = ({
  setEditAward,
  setShowAwardModal,
  setSuccess,
  setError
}) => {
  const [awards, setAwards] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "awards"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const awardsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setAwards(awardsList);
    } catch (err: any) {
      setError(`Error fetching awards: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (awardId: string) => {
    try {
      await deleteDoc(doc(db, "awards", awardId));
      setSuccess("Award deleted successfully!");
      setConfirmDelete(null);
      fetchAwards();
    } catch (err: any) {
      setError(`Error deleting award: ${err.message}`);
    }
  };

  const handleEdit = (award: any) => {
    setEditAward(award);
    setShowAwardModal(true);
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && awards.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No awards found. Add a new award to get started.
        </div>
      )}

      {!loading && awards.length > 0 && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((award) => (
            <div
              key={award.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {award.image ? (
                  <img
                    src={award.image}
                    alt={award.title}
                    className="object-cover w-full h-64"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
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
                <h3 className="font-semibold text-lg text-gray-800">
                  {award.title}
                </h3>
                {award.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Date:</span> {award.date}
                  </p>
                )}
                {award.awardedBy && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Awarded By:</span>{" "}
                    {award.awardedBy}
                  </p>
                )}
                {award.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {award.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleEdit(award)}
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  {confirmDelete === award.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(award.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Confirm Delete"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                        title="Cancel"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(award.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AwardPreviewList;
