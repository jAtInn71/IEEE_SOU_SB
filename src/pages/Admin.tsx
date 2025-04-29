import React, { useState, useEffect } from "react";
import AwardModal from "../Admin/AwardModal";
import AwardPreviewList from "../Admin/AwardPreviewList";
import EventModal from "../Admin/EventModal";
import EventPreviewList from "../Admin/EventPreviewList";
import MemberModal from "../Admin/MemberModal";
import MemberPreviewList from "../Admin/MemberPreviewList";
import { db } from "../firebase"; // your firebase config
import { doc, deleteDoc } from "firebase/firestore";

const Admin = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [selectedAward, setSelectedAward] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // ✅ Edit Handlers
  const handleEditAward = (award: any) => {
    setSelectedAward(award);
    setShowAwardModal(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  // ✅ Delete Handlers
  const handleDeleteAward = async (id: string) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection.");
      return;
    }
    try {
      await deleteDoc(doc(db, "awards", id));
      setSuccessMessage("Award deleted successfully.");
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMessage(`Error deleting award: ${err.message}`);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!navigator.onLine) {
      setErrorMessage("No internet connection.");
      return;
    }
    try {
      await deleteDoc(doc(db, "members", id));
      setSuccessMessage("Member deleted successfully.");
    } catch (err: any) {
      console.error("Delete error:", err);
      setErrorMessage(`Error deleting member: ${err.message}`);
    }
  };

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <button
          onClick={() => setShowEventModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Event
        </button>
        <button
          onClick={() => {
            setSelectedAward(null);
            setShowAwardModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Award
        </button>
        <button
          onClick={() => {
            setSelectedMember(null);
            setShowMemberModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Member
        </button>
      </div>

      {/* Preview Lists */}
      <div className="space-y-10">
        <EventPreviewList />
        <AwardPreviewList onEdit={handleEditAward} onDelete={handleDeleteAward} />
        <MemberPreviewList onEdit={handleEditMember} onDelete={handleDeleteMember} />
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}

      {showAwardModal && (
        <AwardModal
          isOpen={showAwardModal}
          onClose={() => setShowAwardModal(false)}
          award={selectedAward}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}

      {showMemberModal && (
        <MemberModal
          isOpen={showMemberModal}
          onClose={() => setShowMemberModal(false)}
          member={selectedMember}
          setSuccess={setSuccessMessage}
          setError={setErrorMessage}
        />
      )}

      {/* Alerts */}
      {successMessage && (
        <div className="mt-4 text-green-600 text-center">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="mt-4 text-red-600 text-center">{errorMessage}</div>
      )}
    </div>
  );
};

export default Admin;
