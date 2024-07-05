import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);

  const getData = async () => {
    let dataArray;
    const Otheraddress = document.querySelector(".address").value;

    try {
      if (Otheraddress) {
        dataArray = await contract.display(Otheraddress);
        console.log(dataArray);
      } else {
        dataArray = await contract.display(account);
      }
    } catch (e) {
      alert("You don't have access");
      return;
    }

    if (dataArray.length > 0) {
      const images = dataArray.map((item, i) => {
        return (
          <a href={item} key={i} target="_blank" rel="noopener noreferrer">
            <img
              src={item}
              alt={`Uploaded ${i}`}
              className="image-list"
            ></img>
          </a>
        );
      });
      setData(images);
    } else {
      alert("No image to display");
    }
  };

  return (
    <>
      <div className="image-list-container">
        {data}
      </div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
      ></input>
      <button className="center button" onClick={getData}>
        Get Data
      </button>
    </>
  );
};

export default Display;
