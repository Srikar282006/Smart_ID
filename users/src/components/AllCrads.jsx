import * as htmlToImage from 'html-to-image';
import React, { useEffect, useState, useRef } from "react";
import IDCard from "./IDCard";
import jsPDF from "jspdf";
import { Download } from "lucide-react";

export default function AllCards() {
  const [students, setStudents] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("students")) || [];
    setStudents(stored);
  }, []);

  const handleDownload = async (index, name) => {
    const element = cardRefs.current[index];

    try {
      const dataUrl = await htmlToImage.toPng(element, {
        cacheBust: true,
        style: {
          backgroundColor: "white",
        },
      });

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${name}_ID_Card.pdf`);
    } catch (error) {
      console.error('Image export error:', error);
      alert("Failed to generate image. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-4 sm:px-6 lg:px-10">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 text-center mb-10">
        All Student ID Cards
      </h1>

      {students.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">No ID cards available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {students.map((student, index) => (
            <div
              key={index}
              className="relative flex justify-center items-center hover:scale-[1.015] transition-transform duration-300"
            >
              <div
                ref={(el) => (cardRefs.current[index] = el)}
                className="w-full max-w-[320px]"
              >
                <IDCard
                  data={student}
                  template="default"
                  idCardRef={(el) => (cardRefs.current[index] = el)}
                  onDownload={() => handleDownload(index, student.name)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
