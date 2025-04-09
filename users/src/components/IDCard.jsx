import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";

export default function IDCard({ data, template, idCardRef, onDownload }) {
  const commonStyles =
    "bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center relative border border-blue-200";

  const renderDefault = () => (
    <div
      ref={idCardRef}
      className={`${commonStyles} w-72 sm:w-80 p-4 flex flex-col items-center gap-3`}
    >
      
      {onDownload && (
        <button
          onClick={onDownload}
          title="Download ID"
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm hover:bg-gray-100"
        >
          <Download size={18} className="text-gray-600" />
        </button>
      )}

      <img
        src={data.photoURL || "https://via.placeholder.com/100"}
        alt="Profile"
        className="w-24 h-24 object-cover rounded-full border-4 border-blue-300 shadow"
      />

      <div className="text-lg font-bold text-blue-700 break-words leading-tight tracking-wide uppercase">
        {data.name}
      </div>

      <div className="text-sm text-gray-800 space-y-1 text-left w-full px-2">
        <p><span className="font-semibold">Roll No:</span> {data.rollNumber}</p>
        <p><span className="font-semibold">Class:</span> {data.classDivision}</p>
        <p><span className="font-semibold">Rack #:</span> {data.rackNumber || "N/A"}</p>
        <p><span className="font-semibold">Bus Route:</span> {data.busRoute}</p>
        <p><span className="font-semibold">Allergies:</span> {data.allergies.join(", ") || "None"}</p>
      </div>

      <div className="mt-2">
        <QRCodeCanvas value={data.rollNumber} size={80} />
      </div>
    </div>
  );

  const renderCompact = () => (
    <div
      ref={idCardRef}
      className={`${commonStyles} w-64 p-3 flex flex-col items-center gap-2`}
    >
      {onDownload && (
        <button
          onClick={onDownload}
          title="Download ID"
          className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm hover:bg-gray-100"
        >
          <Download size={18} className="text-gray-600" />
        </button>
      )}

      <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 shadow-sm">
        <img
          src={data.photoURL || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      <h2 className="text-base font-bold text-blue-800 uppercase">
        {data.name}
      </h2>

      <div className="text-xs text-gray-700 space-y-0.5 leading-snug text-left w-full px-2">
        <p><span className="font-medium">Roll No:</span> {data.rollNumber}</p>
        <p><span className="font-medium">Class:</span> {data.classDivision}</p>
        <p><span className="font-medium">Rack #:</span> {data.rackNumber || "N/A"}</p>
        <p><span className="font-medium">Route:</span> {data.busRoute}</p>
        <p><span className="font-medium">Allergies:</span> {data.allergies.join(", ") || "None"}</p>
      </div>

      <div className="bg-gray-100 p-2 rounded shadow-inner">
        <QRCodeCanvas value={data.rollNumber} size={64} />
      </div>
    </div>
  );

  return template === "compact" ? renderCompact() : renderDefault();
}
