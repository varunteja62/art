import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [showData, setShowData] = useState("Text");
  const [selectedStyle, setSelectedStyle] = useState("madhubani"); // Default style

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
    formData.append("style", selectedStyle); // Send style selection

    try {
      const response = await axios.post("http://localhost:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "blob", // Expect an image as response
      });

      // Convert response to an image URL
      const imageUrl = URL.createObjectURL(response.data);
      setUploadedImage(imageUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleGet = async () => {
    try {
      const response = await axios.get("http://localhost:8000/");
      setShowData(response.data);
    } catch (error) {
      console.error("Error getting response:", error);
    }
  };

  return (
    <div>
      <h1>AI Art Transformer</h1>

      <input type="file" onChange={handleFileChange} />
      <select onChange={handleStyleChange} value={selectedStyle}>
        <option value="madhubani">Madhubani</option>
        <option value="kalamkari">Kalamkari</option>
        <option value="warli">Warli</option>
      </select>

      <button onClick={handleUpload}>Upload Image</button>
      <button onClick={handleGet}>Show Data</button>

      <h2>{showData}</h2>

      {uploadedImage && (
        <div>
          <h3>Styled Image</h3>
          <img src={uploadedImage} alt="Styled" style={{ width: "300px" }} />
        </div>
      )}
    </div>
  );
}

export default App;
