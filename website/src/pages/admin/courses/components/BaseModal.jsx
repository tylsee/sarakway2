import React from "react";

export default function BaseModal({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel = "Save",
}) {
  return (
    <div className="modal">
      <div className="modal-content">

        <h2>{title}</h2>

        {children}

        <div className="modal-buttons">

          <button onClick={onClose}>
            Cancel
          </button>

          <button onClick={onSubmit}>
            {submitLabel}
          </button>

        </div>

      </div>
    </div>
  );
}