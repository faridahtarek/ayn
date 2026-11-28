// Ayn: "Quick jump", a search box over any company page (use case 5's navigation).
// Press Ctrl + K (or / ), type a farmer, village or page, then Enter to go there.
// Not in the labs: it listens to the keyboard on the whole window (useEffect below)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { pairProofs } from "../reviewQueue.js";

// The pages, always in the list
const pages = [
  { label: "Home", hint: "Page", to: "/" },
  { label: "Fund a farm", hint: "Page", to: "/browse" },
  { label: "My farms funded", hint: "Page", to: "/funded" },
  { label: "Review proof", hint: "Page", to: "/review" },
];

function QuickJump({ fundings, openFarms, reviews }) {
  // Is the box showing? What is typed? Which row is highlighted?
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  // Open on Ctrl + K (Cmd + K on a Mac) or "/", close on Escape.
  // The header's search button sends the same "ayn:quickjump" signal
  useEffect(() => {
    function onKey(e) {
      // Typing "/" in a text box is just typing, not a shortcut
      const typing = ["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); // stop the browser's own Ctrl + K
        setOpen(true);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape" && document.querySelector(".jump-box")) {
        // stopImmediatePropagation: this Escape only closes the box; the page
        // underneath (e.g. a proof, where Escape goes back to the list) never hears it
        e.stopImmediatePropagation();
        setOpen(false);
      }
    }
    function onSignal() {
      setOpen(true);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("ayn:quickjump", onSignal);
    // Clean up: stop listening when the component leaves the page
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ayn:quickjump", onSignal);
    };
  }, []);

  if (!open) return null;

  // Every place it can jump to: pages, proofs to review, farms funded, farms waiting
  const pairs = pairProofs(reviews, fundings);
  const results = [
    ...pages,
    ...pairs
      .filter((p) => p.proof.status === "pending")
      .map((p) => ({ label: p.funding.farm.farmerName, hint: "Proof to review", to: `/review/${p.proof._id}`, place: p.funding.farm.village })),
    ...fundings
      .filter((f) => f.farm)
      .map((f) => ({ label: f.farm.farmerName, hint: "Funded", to: `/funded/${f._id}`, place: f.farm.village })),
    ...openFarms.map((f) => ({ label: f.farmerName, hint: "Waiting for a company", to: `/browse/${f._id}`, place: `${f.village}, ${f.governorate}` })),
  ];

  // Keep the rows whose name, place or kind contains what was typed (any case)
  const words = text.trim().toLowerCase();
  const shown = results
    .filter((r) => `${r.label} ${r.place || ""} ${r.hint}`.toLowerCase().includes(words))
    .slice(0, 8); // at most 8 rows

  function go(row) {
    setOpen(false);
    setText("");
    setActive(0);
    navigate(row.to);
  }

  // Arrow keys move the highlight; Enter opens the highlighted row
  function onInputKey(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(active + 1, shown.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(active - 1, 0));
    } else if (e.key === "Enter" && shown[active]) {
      go(shown[active]);
    }
  }

  return (
    // Clicking the dark area around the box closes it
    <div className="jump-backdrop" onClick={() => setOpen(false)}>
      {/* stopPropagation: a click inside the box doesn't count as a click outside */}
      <div className="jump-box glass" role="dialog" aria-label="Quick jump" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={text}
          placeholder="Jump to a farm or page..."
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
          }}
          onKeyDown={onInputKey}
        />
        <ul className="jump-list">
          {shown.length === 0 && <li className="jump-empty">Nothing matches "{text}"</li>}
          {shown.map((r, i) => (
            // onMouseEnter: the mouse highlights a row too
            <li key={r.to} className={i === active ? "on" : ""} onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
              <span className="jump-label">{r.label}</span>
              {r.place && <span className="jump-place">{r.place}</span>}
              <span className="jump-hint">{r.hint}</span>
            </li>
          ))}
        </ul>
        <div className="jump-keys">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>Enter</kbd> open</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export default QuickJump;
