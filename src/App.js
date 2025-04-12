import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showData, setShowData] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("madhubani");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleStyleChange = (event) => {
    setSelectedStyle(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first!");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("style", selectedStyle);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob",
      });

      const imageUrl = URL.createObjectURL(response.data);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading or stylizing the image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGet = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get");
      setShowData(response.data);
    } catch (error) {
      console.error("GET request error:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", fontFamily: "Arial" }}>
      <h1>🖼️ AI Art Transformer</h1>

      <input type="file" onChange={handleFileChange} style={{ margin: "10px" }} />
      <select onChange={handleStyleChange} value={selectedStyle} style={{ margin: "10px" }}>
        <option value="madhubani">Madhubani</option>
        <option value="kalamkari">Kalamkari</option>
        <option value="warli">Warli</option>
      </select>

      <div style={{ margin: "20px" }}>
        {loading ? (
          <div>
            <div className="spinner"></div>
            <p>Processing Image...</p>
          </div>
        ) : (
          <>
            <button onClick={handleUpload} style={{ marginRight: "10px" }}>
              Upload & Stylize
            </button>
            <button onClick={handleGet}>Test Backend</button>
          </>
        )}
      </div>

      {showData && <h2>{showData}</h2>}

      {uploadedImage && (
        <div>
          <h3>✨ Stylized Image</h3>
          <img
            src={uploadedImage}
            alt="Styled"
            style={{
              width: "300px",
              border: "2px solid #ccc",
              borderRadius: "10px",
              marginTop: "20px",
            }}
          />
          <br />
          <a href={uploadedImage} download="styled-image.jpg">
            <button style={{ marginTop: "10px" }}>⬇️ Download Image</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
