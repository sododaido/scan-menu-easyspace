/**
 * Toast — Reusable notification popup
 * ------------------------------------
 * Shows a message at the bottom-center of the screen.
 * Auto-dismisses after `duration` ms (default 2000).
 * Supports "success" (green) and "error" (red) types.
 * Smooth fade-in on mount, fade-out before unmount.
 */

import { useState, useEffect } from "react";
import "./Toast.css";

function Toast({ message, type = "success", duration = 2000, onClose }) {
  const [phase, setPhase] = useState("enter");

  useEffect(() => {
    // Start fade-out 300ms before the total duration ends
    const fadeOutTimer = setTimeout(() => {
      setPhase("exit");
    }, duration - 300);

    // Remove the toast after the full duration
    const removeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(removeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`toast toast-${type} toast-${phase}`}>
      <span className="toast-msg">{message}</span>
    </div>
  );
}

export default Toast;
