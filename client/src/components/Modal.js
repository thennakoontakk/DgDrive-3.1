import { useEffect } from "react";
import { ethers } from "ethers"; // Import ethers
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    try {
      // Set transaction options including gas fees
      const tx = await contract.allow(address, {
        gasLimit: ethers.utils.hexlify(1000000), // Adjust gas limit as needed
        maxFeePerGas: ethers.utils.parseUnits('2.0', 'gwei'), // Adjust max fee per gas
        maxPriorityFeePerGas: ethers.utils.parseUnits('1.5', 'gwei') // Adjust max priority fee per gas
      });
      await tx.wait();
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to share access. Make sure the address is correct.");
    }
  };

  useEffect(() => {
    const accessList = async () => {
      try {
        const addressList = await contract.shareAccess();
        let select = document.querySelector("#selectNumber");
        const options = addressList;

        for (let i = 0; i < options.length; i++) {
          let opt = options[i].user;
          let e1 = document.createElement("option");
          e1.textContent = `${opt} - ${options[i].access ? "Access Granted" : "Access Revoked"}`;
          e1.value = opt;
          select.appendChild(e1);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load access list.");
      }
    };
    contract && accessList();
  }, [contract]);

  return (
    <>
      <div className="modalBackground">
        <div className="modalContainer">
          <div className="title">Share with</div>
          <div className="body">
            <input
              type="text"
              className="address"
              placeholder="Enter Address"
            ></input>
          </div>
          <form id="myForm">
            <select id="selectNumber">
              <option className="address">People With Access</option>
            </select>
          </form>
          <div className="footer">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              id="cancelBtn"
            >
              Cancel
            </button>
            <button onClick={sharing}>Share</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
