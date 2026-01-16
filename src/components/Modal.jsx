import { useEffect, useRef } from "react";
import "./Modal.css";

function Modal({ isOpen, onClose, title, children, buttonText }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current.showModal();
    } else {
      dialogRef.current.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-content">
        <h2 className="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <button className="modal-button" onClick={onClose}>
          {buttonText}
        </button>
      </div>
    </dialog>
  );
}

export default Modal;
