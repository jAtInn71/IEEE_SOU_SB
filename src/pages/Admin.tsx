import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Assuming firebase.tsx is in parent folder

const Admin = () => {
  // State for active tab and modal visibility
  const [activeTab, setActiveTab] = useState("members");
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  
  // Member form state
  const [memberType, setMemberType] = useState("faculty");
  const [memberImage, setMemberImage] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberDesignation, setMemberDesignation] = useState("");
  const [memberDepartment, setMemberDepartment] = useState("");
  const [memberPosition, setMemberPosition] = useState("");
  const [memberEducation, setMemberEducation] = useState("");
  const [memberLinkedin, setMemberLinkedin] = useState("");

  // Event form state
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventSpeakers, setEventSpeakers] = useState("");
  const [eventImage, setEventImage] = useState("");

  // Award form state
  const [awardType, setAwardType] = useState("branch");
  const [awardTitle, setAwardTitle] = useState("");
  const [awardImage, setAwardImage] = useState("");
  const [awardDescription, setAwardDescription] = useState("");
  const [awardYear, setAwardYear] = useState("");
  const [studentName, setStudentName] = useState("");

  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Reset form states
  const resetMemberForm = () => {
    setMemberType("faculty");
    setMemberImage("");
    setMemberName("");
    setMemberDesignation("");
    setMemberDepartment("");
    setMemberPosition("");
    setMemberEducation("");
    setMemberLinkedin("");
  };

  const resetEventForm = () => {
    setEventName("");
    setEventDate("");
    setEventTime("");
    setEventDescription("");
    setEventSpeakers("");
    setEventImage("");
  };

  const resetAwardForm = () => {
    setAwardType("branch");
    setAwardTitle("");
    setAwardImage("");
    setAwardDescription("");
    setAwardYear("");
    setStudentName("");
  };

  // Image validation function
  const isValidImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp)$/) !== null;
  };

  // Handle form submissions
  const handleMemberSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      // Create member object based on form data
      const memberData = {
        type: memberType,
        image: memberImage,
        name: memberName,
        designation: memberDesignation,
        linkedin: memberLinkedin, // Add LinkedIn URL
        createdAt: serverTimestamp(),
      };

      // Add conditional fields based on member type
      if (memberType === "faculty") {
        memberData.department = memberDepartment;
      } else {
        if (["executive", "core"].includes(memberType)) {
          memberData.position = memberPosition;
        }
        memberData.education = memberEducation;
      }

      // Add document to Firestore
      await addDoc(collection(db, "members"), memberData);
      
      setSuccess("Member added successfully!");
      resetMemberForm();
      setShowMemberModal(false);
    } catch (err) {
      setError(`Error adding member: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const eventData = {
        name: eventName,
        date: eventDate,
        time: eventTime,
        description: eventDescription,
        speakers: eventSpeakers,
        image: eventImage, // Add image URL
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), eventData);
      
      setSuccess("Event added successfully!");
      resetEventForm();
      setShowEventModal(false);
    } catch (err) {
      setError(`Error adding event: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAwardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const awardData = {
        type: awardType,
        title: awardTitle,
        image: awardImage,
        description: awardDescription,
        year: awardYear,
        createdAt: serverTimestamp(),
      };

      if (awardType === "student") {
        awardData.studentName = studentName;
      }

      await addDoc(collection(db, "awards"), awardData);
      
      setSuccess("Award added successfully!");
      resetAwardForm();
      setShowAwardModal(false);
    } catch (err) {
      setError(`Error adding award: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Image URL input with preview component
  const ImageUrlInput = ({ value, onChange, label, placeholder }) => {
    return (
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">{label}</label>
        <input
          type="url"
          className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
        
        {value && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <div className="border rounded-md overflow-hidden bg-gray-100 flex items-center justify-center" style={{ height: "150px" }}>
              {isValidImageUrl(value) ? (
                <img 
                  src={value} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cline x1='18' y1='6' x2='6' y2='18'%3E%3C/line%3E%3Cline x1='6' y1='6' x2='18' y2='18'%3E%3C/line%3E%3C/svg%3E";
                    e.target.style.padding = "50px";
                    e.target.style.color = "#f87171";
                  }}
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center p-4">
                  <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>Enter a valid image URL</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Panel</h1>
      
      {/* Success and Error notifications */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="flex border-b">
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "members" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("members")}
          >
            Members
          </button>
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "events" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === "awards" ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            onClick={() => setActiveTab("awards")}
          >
            Awards
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "members" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Members</h2>
              <p className="text-gray-600 mb-4">Add various types of members to your organization.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                onClick={() => setShowMemberModal(true)}
              >
                Add New Member
              </button>
            </div>
          )}
          
          {activeTab === "events" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Events</h2>
              <p className="text-gray-600 mb-4">Add and manage events for your organization.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                onClick={() => setShowEventModal(true)}
              >
                Add New Event
              </button>
            </div>
          )}
          
          {activeTab === "awards" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Manage Awards</h2>
              <p className="text-gray-600 mb-4">Add branch and student achievements.</p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm transition-colors"
                onClick={() => setShowAwardModal(true)}
              >
                Add New Award
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Member Modal */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Member</h3>
                <button 
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setShowMemberModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleMemberSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Member Type</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white focus:ring-blue-500 focus:border-blue-500" 
                    value={memberType}
                    onChange={(e) => setMemberType(e.target.value)}
                    required
                  >
                    <option value="faculty">Faculty Member</option>
                    <option value="advisory">Advisory Board Member</option>
                    <option value="executive">Executive Committee Member</option>
                    <option value="core">Core Committee Member</option>
                    <option value="member">Member</option>
                  </select>
                </div>
                
                <ImageUrlInput 
                  value={memberImage}
                  onChange={setMemberImage}
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Designation</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Professor"
                    value={memberDesignation}
                    onChange={(e) => setMemberDesignation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://linkedin.com/in/johndoe"
                    value={memberLinkedin}
                    onChange={(e) => setMemberLinkedin(e.target.value)}
                  />
                </div>
                
                {memberType === "faculty" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Department</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Computer Science"
                      value={memberDepartment}
                      onChange={(e) => setMemberDepartment(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                {["executive", "core"].includes(memberType) && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Position</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Secretary"
                      value={memberPosition}
                      onChange={(e) => setMemberPosition(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                {memberType !== "faculty" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Education</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ph.D. in Computer Science"
                      value={memberEducation}
                      onChange={(e) => setMemberEducation(e.target.value)}
                      required
                    />
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowMemberModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Member"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Event</h3>
                <button 
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setShowEventModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleEventSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Event Name</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Annual Tech Conference"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                      type="date"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Time</label>
                    <input
                      type="time"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* Added image URL field for events */}
                <ImageUrlInput 
                  value={eventImage}
                  onChange={setEventImage}
                  label="Event Image URL"
                  placeholder="https://example.com/event-image.jpg"
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Event description..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Speakers</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Dr. Jane Smith, Prof. John Doe"
                    value={eventSpeakers}
                    onChange={(e) => setEventSpeakers(e.target.value)}
                    required
                  />
                  <p className="text-gray-500 text-sm mt-1">Separate multiple speakers with commas</p>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowEventModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Award Modal */}
      {showAwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Add New Award</h3>
                <button 
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => setShowAwardModal(false)}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleAwardSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Award Type</label>
                  <select 
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 bg-white focus:ring-blue-500 focus:border-blue-500" 
                    value={awardType}
                    onChange={(e) => setAwardType(e.target.value)}
                    required
                  >
                    <option value="branch">Branch Achievement</option>
                    <option value="student">Student Achievement</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Award Title</label>
                  <input
                    type="text"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Best Department Award"
                    value={awardTitle}
                    onChange={(e) => setAwardTitle(e.target.value)}
                    required
                  />
                </div>
                
                {awardType === "student" && (
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Student Name</label>
                    <input
                      type="text"
                      className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Jane Smith"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required={awardType === "student"}
                    />
                  </div>
                )}
                
                <ImageUrlInput 
                  value={awardImage}
                  onChange={setAwardImage}
                  label="Award Image URL"
                  placeholder="https://example.com/award-image.jpg"
                />
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Description</label>
                  <textarea
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                    placeholder="Award description..."
                    value={awardDescription}
                    onChange={(e) => setAwardDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Year</label>
                  <input
                    type="number"
                    min="1900"
                    max="2099"
                    step="1"
                    className="w-full border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="2025"
                    value={awardYear}
                    onChange={(e) => setAwardYear(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    onClick={() => setShowAwardModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Award"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;