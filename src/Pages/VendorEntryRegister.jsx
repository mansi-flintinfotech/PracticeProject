import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import Select from "react-select";
import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import VendorTable from "../Components/VendorTable";
import "../Styles/layout.css";
import "../Styles/vendor.css";

export default function VendorEntryRegister() {
  const [memos, setMemos] = useState([]);
  const [vehicleFilter, setVehicleFilter] = useState("");
  //const [fromDate, setFromDate] = useState("");
  //const [toDate, setToDate] = useState("");
  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJmaW5hbmNpYWxZZWFyIjp7ImVuZERhdGUiOiIyMDI2LTAzLTMxIiwic3RhcnREYXRlIjoiMjAyNS0wNC0wMSJ9LCJzdWIiOiJUU1QuTWFuc2kiLCJjcmVhdGVkIjoxNzcxOTA3MzEzMDMwLCJjbGllbnRDb2RlIjoiQ0xUMDAxIiwiZXhwIjoxNzcyNTEyMTEzfQ.joYZQhx-3hW1Yhp2VMrfWjapQemR_0NDN7XbXkRfmw2P8NrrK_RM5e4yoWAyypDjGwUaTsP5Ej03wWmoyX5UIA";

  const headers = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };

  // ================= FETCH MEMO DATA =================
  const fetchMemoData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);

      const response = await fetch(
        "https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData?page=0&size=10&paginate=false",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(filters),
        }
      );

      const result = await response.json();

      const memoArray =
        result?.body?.content ||
        result?.body ||
        result?.data ||
        [];

      setMemos(Array.isArray(memoArray) ? memoArray : []);
    } catch (error) {
      console.error("Memo API error:", error);
      setMemos([]);
    } finally {
      setLoading(false);
    }
  }, []);

//   // ================= FETCH VENDOR LIST =================
//  const getVendorListFunction = async () => {
//   try {
//     const response = await fetch(
//       "https://vikrantpatiloffice.in:8443/transportmgmtdev/financialLedgers/getAllFinancialLedgersByFilter",
//       {
//         method: "POST",
//         headers: headers,
//         body: JSON.stringify({
//           groupId: 8,
//           page: 0,
//           size: 1000,
//           paginate: false,
//         }),
//       }
//     );

//     const result = await response.json();

//     console.log("FULL Vendor API Response =>", result);

//     // 🔥 FORCE correct array extraction
//     let vendorArray = [];

//     if (Array.isArray(result)) {
//       vendorArray = result;
//     } else if (Array.isArray(result?.body)) {
//       vendorArray = result.body;
//     } else if (Array.isArray(result?.body?.content)) {
//       vendorArray = result.body.content;
//     } else if (Array.isArray(result?.data)) {
//       vendorArray = result.data;
//     }

//     console.log("Extracted Vendor Array =>", vendorArray);

//     const formattedOptions = vendorArray.map((item) => ({
//       value: item.financialLedgerId || item.id,
//       label: item.accountName || item.name || "No Name",
//     }));

//     console.log("Formatted Vendor Options =>", formattedOptions);

//     setVendorOptions(formattedOptions);
//   } catch (error) {
//     console.error("Vendor list error:", error);
//     setVendorOptions([]);
//   }
// };
// ================= FETCH VENDOR LIST =================
const getVendorListFunction = async () => {
  try {
    const response = await fetch(
      "https://vikrantpatiloffice.in:8443/transportmgmtdev/financialLedgers/getAllFinancialLedgersByFilter",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          groupId: 8,
          paginate: false,
        }),
      }
    );

    const result = await response.json();
    console.log("Vendor API Response =>", result);

    // Extract correct array
    const vendorArray =
      result?.body?.content ||
      result?.body ||
      result?.data ||
      [];

    let formattedOptions = [];

    if (Array.isArray(vendorArray) && vendorArray.length > 0) {
      formattedOptions = vendorArray.map((item) => ({
        value: item.financialLedgerId || item.id,
        label: item.accountName || item.name,
      }));
    }

    // 🔥 If API empty, add default vendors so dropdown never blank
    if (formattedOptions.length === 0) {
      formattedOptions = [
        { value: 1, label: "Vendor Group Ledger 1" },
        { value: 2, label: "Vendor Group Ledger 2" },
      ];
    }

    setVendorOptions(formattedOptions);
  } catch (error) {
    console.error("Vendor list error:", error);

    // fallback if API fails
    setVendorOptions([
      { value: 1, label: "Vendor Group Ledger 1" },
      { value: 2, label: "Vendor Group Ledger 2" },
    ]);
  }
};


//============================== vehical fetch =======================
// const getVehicleListFunction = async () => {
//   try {
//     const response = await fetch("https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData?page=0&size=10&paginate=false", {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify({
//         paginate: false,
//       }),
//     });

//     const result = await response.json();
//     console.log("Vehicle API Response =>", result);

//     const vehicleArray =
//       result?.body?.content ||
//       result?.body ||
//       result?.data ||
//       [];

//     // const formattedVehicles = Array.isArray(vehicleArray)
//     //   ? vehicleArray.map((item) => ({
//     //       value: item.vehicleId || item.id,
//     //       label: item.vehicleNumber || item.number,
//     //     }))
//     //   : [];

//     const formattedVehicles = Array.isArray(vehicleArray)
//   ? vehicleArray
//       .map((item) => ({
//         value: item.vehicleNumber,
//         label: item.vehicleNumber,
//       }))
//       .filter((item) => item.value)
//   : [];

//     setVehicleOptions(formattedVehicles);
//   } catch (error) {
//     console.error("Vehicle list error:", error);
//     setVehicleOptions([]);
//   }
// }; 

const getVehicleListFunction = async () => {
  try {
    const response = await fetch(
      "https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData?page=0&size=1000&paginate=false",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ paginate: false }),
      }
    );

    const result = await response.json();
    console.log("Vehicle API Response =>", result);

    const vehicleArray =
      result?.body?.content ||
      result?.body ||
      result?.data ||
      [];

    // extract unique vehicle numbers
    const uniqueVehicles = [
      ...new Set(
        vehicleArray
          .map((item) => item.vehicleNumber)
          .filter(Boolean)
      ),
    ];

    let formattedVehicles = uniqueVehicles.map((number) => ({
      value: number,
      label: number,
    }));

    // 🔥 fallback so dropdown never blank
    if (formattedVehicles.length === 0) {
      formattedVehicles = [
        { value: "MH-01-AA-1111", label: "MH-01-AA-1111" },
        { value: "MH-02-BB-2222", label: "MH-02-BB-2222" },
      ];
    }

    setVehicleOptions(formattedVehicles);
  } catch (error) {
    console.error("Vehicle list error:", error);

    setVehicleOptions([
      { value: "MH-01-AA-1111", label: "MH-01-AA-1111" },
      { value: "MH-02-BB-2222", label: "MH-02-BB-2222" },
    ]);
  }
};
  // ================= PAGE LOAD =================
//    useEffect(() => {
//    fetchMemoData();
//     getVendorListFunction();
//  }, []);

useEffect(() => {
  fetchMemoData();
  getVendorListFunction();
  getVehicleListFunction(); // 👈 add this
}, []);

  

  // ================= SEARCH =================
  const handleSearch = () => {
  const filter = {};

  if (selectedVendor?.value) {
    filter.financialLedgerId = selectedVendor.value;
  }

  // 🔥 IMPORTANT FIX
  if (selectedVehicle?.value) {
    filter.vehicleNumber = selectedVehicle.value;
  }

  if (fromDate) {
  filter.fromDate = dayjs(fromDate).format("YYYY-MM-DD");
}

if (toDate) {
  filter.toDate = dayjs(toDate).format("YYYY-MM-DD");
}
  fetchMemoData(filter);
};
  // ================= CLEAR =================
  const handleClear = () => {
  setSelectedVendor(null);
  setSelectedVehicle(null);   // 🔥 important hhhhh
  setFromDate("");
  setToDate("");
  fetchMemoData();
};

  return (
    <div className="layout">
      <Sidebar />

      <div className="main">
        <Header />

        <div className="filter-card">
          <div className="filter-grid" style={{ gap: "25px" }}>

            {/* Vendor Dropdown */}
            <div className="filter-input-group">
              <Select
                options={vendorOptions}
                value={selectedVendor}
                onChange={setSelectedVendor}
                placeholder="Select Vendor"
                isSearchable
                menuPortalTarget={document.body}
                maxMenuHeight={150}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>

            {/* From Date */}
            <div className="filter-input-group">
              <DatePicker
  selected={fromDate}
  onChange={(date) => setFromDate(date)}
  selectsStart
  startDate={fromDate}
  endDate={toDate}
  dateFormat="dd/MM/yyyy"
  placeholderText="From Date"
  className="custom-input"
/>
            </div>

            {/* To Date */}
            <div className="filter-input-group">
             <DatePicker
  selected={toDate}
  onChange={(date) => setToDate(date)}
  selectsEnd
  startDate={fromDate}
  endDate={toDate}
  minDate={fromDate}
  dateFormat="dd/MM/yyyy"
  placeholderText="To Date"
  className="custom-input"
/>
            </div>

            {/* Vehicle Dropdown */}
            {/* <div className="filter-input-group vehicle-col">
              <select
                className="custom-input"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
              >
                <option value="">Vehicle No.</option>
                <option value="MH-01-AA-1111">MH-01-AA-1111</option>
                <option value="MH-02-BB-2222">MH-02-BB-2222</option>
                </select>
            
            </div> */}

            {/* Vehicle Dropdown */}
<div className="filter-input-group vehicle-col">
  <Select
    options={vehicleOptions}
    value={selectedVehicle}
    onChange={setSelectedVehicle}
    placeholder="Select Vehicle"
    isSearchable
  />
</div>

            {/* Buttons */}
            <div
              className="filter-actions"
              style={{ display: "flex", gap: "15px", alignItems: "center" }}
            >
              <button className="btn-clear" onClick={handleSearch}>
                Search
              </button>

              <button className="btn-clear" onClick={handleClear}>
                Clear
              </button>

              <button className="btn-export">
                Export
              </button>
            </div>

          </div>
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: "10px" }}>
            Loading...
          </div>
        )}

        <VendorTable data={memos} />
      </div>
    </div>
  );
}