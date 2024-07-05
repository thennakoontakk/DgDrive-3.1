import { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `424711aef5a747239bd5`,
            pinata_secret_api_key: `e4e6bd6a51c32725d5c88b31c9b626aae04a10cc9053fdd06cc4634d47467555`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        
        // Set transaction options including gas fees
        const tx = await contract.add(account, ImgHash, {
          gasLimit: ethers.utils.hexlify(1000000), // Adjust gas limit as needed
          maxFeePerGas: ethers.utils.parseUnits('2.0', 'gwei'), // Adjust max fee per gas
          maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei') // Adjust max priority fee per gas
        });
        await tx.wait();

        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.error(e);
        alert("Unable to upload image to Pinata");
      }
    } else {
      alert("No file selected");
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        <button type="submit" className="upload" disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
