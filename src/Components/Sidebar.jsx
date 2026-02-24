import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../Styles/sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="logo">☰ TransBillbook</div>

      {/* Reports dropdown right under logo */}
      <div className="menu">
        <div 
          className="menu-title report-header"
          onClick={() => setOpen(!open)}
        >
          <span>Reports</span>
          {open ? <FaChevronDown /> : <FaChevronRight />}
        </div>

        {open && (
          <div className="submenu">
            <div className="menu-item vendor-entry active">
              Vendor Entry Register
            </div>
          </div>
        )}
      </div>

      {/* Optional: other menus can go here */}

      <div className="user">TST.Mansi</div>
    </div>
  );
}