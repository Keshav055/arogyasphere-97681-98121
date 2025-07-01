import React from "react";

/**
 * Shows an app-wide banner for events, reminders, or file notifications.
 * Supports types: info, warning, success, danger.
 * 
 * Props:
 *  - message: string (required)
 *  - type: one of "info", "success", "warning", "danger" (default "info")
 *  - onClose: optional function for dismiss button
 */
const NotificationBanner = ({ message, type = "info", onClose }) => {
  if (!message) return null;
  let bannerClass = "banner banner-" + type;

  return (
    <div className={bannerClass} role={type === "danger" ? "alert" : "status"} style={{ position: "fixed", top: 2, left: 0, right: 0, zIndex: 1350 }}>
      {message}
      {onClose &&
        <button
          onClick={onClose}
          style={{ marginLeft: 8, background: "none", border: "none", color: "#fff", fontWeight: 700, fontSize: "16px", float: "right", cursor: "pointer" }}
          aria-label="Dismiss notification"
        >&times;</button>
      }
    </div>
  );
};

export default NotificationBanner;
