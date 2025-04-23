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

interface EventPreviewListProps {
  setEditEvent: (event: any) => void;
  setShowEventModal: (show: boolean) => void;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const EventPreviewList: React.FC<EventPreviewListProps> = ({
  setEditEvent,
  setShowEventModal,
  setSuccess,
  setError
}) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const eventsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsList);
    } catch (err: any) {
      setError(`Error fetching events: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setSuccess("Event deleted successfully!");
      setConfirmDelete(null);
      fetchEvents();
    } catch (err: any) {
      setError(`Error deleting event: ${err.message}`);
    }
  };

  const handleEdit = (event: any) => {
    setEditEvent(event);
    setShowEventModal(true);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!loading && events.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No events found. Add a new event to get started.
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
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
                  {event.title}
                </h3>
                {event.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium">Date:</span> {event.date}
                  </p>
                )}
                {event.venue && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Venue:</span> {event.venue}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {event.description}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleEdit(event)}
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

                  {confirmDelete === event.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(event.id)}
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
                      onClick={() => setConfirmDelete(event.id)}
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

export default EventPreviewList;
