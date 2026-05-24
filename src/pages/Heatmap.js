import React, { useState } from "react";
import axios from "axios";

const Heatmap = () => {
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "http://127.0.0.1:8000/heatmap/",
      formData,
      { responseType: "blob" }
    );

    const url = URL.createObjectURL(res.data);
    setImage(url);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>AI Heatmap Visualization</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={handleUpload}>
        Generate Heatmap
      </button>

      <br /><br />

      {image && (
        <img
          src={image}
          width="400"
          alt="heatmap"
        />
      )}
    </div>
  );
};

export default Heatmap;