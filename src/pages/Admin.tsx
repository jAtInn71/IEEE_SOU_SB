import React, { useState } from "react";
import AwardModal from "../Admin/AwardModal";
import AwardPreviewList from "../Admin/AwardPreviewList";
import EventModal from "../Admin/EventModal";
import EventPreviewList from "../Admin/EventPreviewList";
import MemberModal from "../Admin/MemberModal";
import MemberPreviewList from "../Admin/MemberPreviewList";

const Admin = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const [selectedAward, setSelectedAward] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Edit Handlers
  const handleEditAward = (award: any) => {
    setSelectedAward(award);
    setShowAwardModal(true);
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setShowMemberModal(true);
  };

  // Delete Handlers (you can implement real logic here)
  const handleDeleteAward = (id: string) => {
    console.log("Delete award with id:", id);
  };

  const handleDeleteMember = (id: string) => {
    console.log("Delete member with id:", id);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center mb-10">
        <button
          onClick={() => setShowEventModal(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Event
        </button>
        <button
          onClick={() => {
            setSelectedAward(null); // ✅ Reset award selection before opening modal
            setShowAwardModal(true);
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Award
        </button>
        <button
          onClick={() => {
            setSelectedMember(null); // ✅ Reset member selection before opening modal
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

      {/* Success & Error Messages */}
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
