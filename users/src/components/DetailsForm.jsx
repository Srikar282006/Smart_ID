import React, { useState, useRef, useEffect} from "react";

import { QRCodeCanvas } from 'qrcode.react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import IDCard from "./IDCard";




const classes = ["1-A", "1-B", "2-A", "2-B"];
const busRoutes = ["Route 1", "Route 2", "Route 3"];
const allergiesList = ["Peanuts", "Dairy", "Gluten", "Dust", "Pollen"];


export default function DetailsForm() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    classDivision: "",
    allergies: [],
    rackNumber: "",
    busRoute: "",
    photo: null,
    photoURL: ""
  });

  const [submittedData, setSubmittedData] = useState(null);
  const fileInputRef = useRef(null);
  const idCardRef = useRef(null);
  const [template, setTemplate] = useState("default"); 

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("students"));
    if (saved && saved.length > 0) {
      setSubmittedData(saved[saved.length - 1]); 
    }
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAllergiesChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      allergies: checked
        ? [...prev.allergies, value]
        : prev.allergies.filter(a => a !== value)
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Base64 Image Data:", reader.result);
        setFormData(prev => ({
          ...prev,
          photo: file,
          photoURL: reader.result
        }));
      };
      reader.readAsDataURL(file); 
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const previous = JSON.parse(localStorage.getItem("students")) || [];
    const updated = [...previous, formData];
    localStorage.setItem("students", JSON.stringify(updated));
    setSubmittedData(formData);

  };
  

  const handleDownloadPDF = () => {
    if (!idCardRef.current) return;

    setTimeout(() => {
      toPng(idCardRef.current, { pixelRatio: 2 }) 
        .then((dataUrl) => {
          const pdf = new jsPDF();
          const imgProps = pdf.getImageProperties(dataUrl);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${submittedData.name}_IDCard.pdf`);
        })
        .catch((err) => {
          console.log("Could not generate PDF:", err);
        });
    }, 300);
  };

  if (submittedData) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-4">
        
        <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="border p-2 rounded mb-4"
        >
          <option value="default">Default Template</option>
          <option value="compact">Compact Template</option>
        </select>
  
        <IDCard data={submittedData} template={template} idCardRef={idCardRef} />
  
        <button
          onClick={handleDownloadPDF}
          className="bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Download as PDF
        </button>
  
       
        <button
          onClick={() => {
            setSubmittedData(null);
            setFormData({
              name: "",
              rollNumber: "",
              classDivision: "",
              allergies: [],
              rackNumber: "",
              busRoute: "",
              photo: null,
              photoURL: ""
            });
          }}
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Another ID Card
        </button>
      </div>
    );
  }
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex items-center justify-center p-6">
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg space-y-6"
  >
    <h2 className="text-2xl font-bold text-center text-gray-800">🎓 Student Info Form</h2>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Name</label>
      <input
        type="text"
        name="name"
        placeholder="Enter full name"
        required
        value={formData.name}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Roll Number</label>
      <input
        type="text"
        name="rollNumber"
        placeholder="e.g., 23"
        required
        value={formData.rollNumber}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Class & Division</label>
      <select
        name="classDivision"
        required
        value={formData.classDivision}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm bg-white"
      >
        <option value="">Select Class & Division</option>
        {classes.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Allergies</label>
      <div className="grid grid-cols-2 gap-2">
        {allergiesList.map(allergy => (
          <label key={allergy} className="flex items-center text-gray-600">
            <input
              type="checkbox"
              value={allergy}
              checked={formData.allergies.includes(allergy)}
              onChange={handleAllergiesChange}
              className="mr-2 accent-blue-500"
            />
            {allergy}
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Upload Photo</label>
      <input
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        ref={fileInputRef}
        className="w-full border border-gray-300 p-2 rounded-lg"
      />
      {formData.photoURL && (
        <img
          src={formData.photoURL}
          alt="Preview"
          className="mt-2 w-24 h-24 object-cover rounded-full border-2 border-blue-400 mx-auto"
        />
      )}
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Rack Number</label>
      <input
        type="text"
        name="rackNumber"
        placeholder="e.g., R-45"
        value={formData.rackNumber}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>

    <div className="space-y-2">
      <label className="block font-semibold text-gray-700">Bus Route</label>
      <select
        name="busRoute"
        required
        value={formData.busRoute}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 rounded-xl shadow-sm bg-white"
      >
        <option value="">Select Bus Route</option>
        {busRoutes.map(route => (
          <option key={route} value={route}>{route}</option>
        ))}
      </select>
    </div>

    <button
      type="submit"
      className="w-full bg-blue-600 text-white font-bold py-3 rounded-2xl hover:bg-blue-700 transition duration-200 shadow-lg"
    >
      Submit & Preview ID
    </button>
  </form>


<button
  onClick={() => {
    setSubmittedData(null);
    setFormData({
      name: "",
      rollNumber: "",
      classDivision: "",
      allergies: [],
      rackNumber: "",
      busRoute: "",
      photo: null,
      photoURL: ""
    });
  }}
  className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
>
  Create Another ID Card
</button>


    </div>
  );
}
