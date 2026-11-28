// Ayn: a short message at the bottom of the page that fades away (use case 5),
// e.g. "Confirmed: Youssef's reward is released"
// The review page sends it while moving on: navigate(page, { state: { toast: "..." } })
import { useEffect, useState } from "react";

function Toast({ message }) {
  const [shown, setShown] = useState(Boolean(message));

  // A new message: show it, then hide it after 3.5 seconds
  useEffect(() => {
    if (!message) return;
    setShown(true);
    const timer = setTimeout(() => setShown(false), 3500);
    return () => clearTimeout(timer); // a newer message cancels the old timer
  }, [message]);

  if (!message || !shown) return null;
  // role="status": screen readers read it out
  return <div className="toast glass" role="status">{message}</div>;
}

export default Toast;
