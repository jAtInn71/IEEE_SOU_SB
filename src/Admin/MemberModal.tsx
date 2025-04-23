import React, { useState, useEffect } from "react";
import { collection, addDoc, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import ImageUrlInput from "./ImageUrlInput";
import Navbar from "./components/Navbar";
import { Route } from "react-router-dom";

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: any;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, member, setSuccess, setError }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [memberType, setMemberType] = useState<string>("faculty");
  const [memberImage, setMemberImage] = useState<string>("");
  const [memberName, setMemberName] = useState<string>("");
  const [memberDesignation, setMemberDesignation] = useState<string>("");
  const [memberDepartment, setMemberDepartment] = useState<string>("");
  const [memberPosition, setMemberPosition] = useState<string>("");
  const [memberEducation, setMemberEducation] = useState<string>("");
  const [memberLinkedin, setMemberLinkedin] = useState<string>("");

  // Initialize form with member data if editing
  useEffect(() => {
    if (member) {
      setMemberType(member.type || "faculty");
      setMemberImage(member.image || "");
      setMemberName(member.name || "");
      setMemberDesignation(member.designation || "");
      setMemberDepartment(member.department || "");
      setMemberPosition(member.position || "");
      setMemberEducation(member.education || "");
      setMemberLinkedin(member.linkedin || "");
    } else {
      resetMemberForm();
    }
  }, [member]);

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

  // Handle form submissions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Create member object based on form data
      const memberData = {
        type: memberType,
        image: memberImage,
        name: memberName,
        designation: memberDesignation,
        linkedin: memberLinkedin,
        ...(member ? {} : { createdAt: serverTimestamp() }),
        updatedAt: serverTimestamp(),
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

      if (member?.id) {
        // Update existing document
        await updateDoc(doc(db, "members", member.id), memberData);
        setSuccess("Member updated successfully!");
      } else {
        // Add new document
        await addDoc(collection(db, "members"), memberData);
        setSuccess("Member added successfully!");
      }
      
      resetMemberForm();
      onClose();
    } catch (err: any) {
      setError(`Error ${member ? 'updating' : 'adding'} member: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">{member ? 'Edit' : 'Add New'} Member</h3>
            <button 
              className="text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
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
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={loading}
              >
                {loading ? "Saving..." : (member ? "Update Member" : "Save Member")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;