import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [loading, setLoading] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vehicleOptions, setVehicleOptions] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const AUTH_TOKEN = "eyJhbGciOiJIUzUxMiJ9.eyJmaW5hbmNpYWxZZWFyIjp7ImVuZERhdGUiOiIyMDI2LTAzLTMxIiwic3RhcnREYXRlIjoiMjAyNS0wNC0wMSJ9LCJzdWIiOiJUU1QuTWFuc2kiLCJjcmVhdGVkIjoxNzcyMTY1ODE1MzkzLCJjbGllbnRDb2RlIjoiQ0xUMDAxIiwiZXhwIjoxNzcyNzcwNjE1fQ.doTFx5QQlKC_P_ceFb5ymtyjTm-e_BFgJcmwra6__RcZPFKGgNn0taNevoOySfPE2zWRwf4jSEWwU9au6Ehhsw";

  const headers = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
    "Content-Type": "application/json",
  };

  const fetchMemoData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData?page=0&size=1000&paginate=false",
        {
          method: "POST",
          headers,
          body: JSON.stringify(filters),
        }
      );

      const result = await response.json();
      const memoArray = result?.body?.content || result?.body || [];
      setMemos(Array.isArray(memoArray) ? memoArray : []);
      return result;
    } catch (error) {
      console.error("Memo API error:", error);
      setMemos([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getVendorListFunction = useCallback(async () => {
    try {
      const response = await fetch("https://vikrantpatiloffice.in:8443/transportmgmtdev/financialLedgers/getAllFinancialLedgersByFilter", {
        method: "POST",
        headers,
        body: JSON.stringify({ groupTypeCode: [8] }),
      });
      const result = await response.json();
      const vendorArray = result?.body?.content || result?.body || [];
      setVendorOptions(vendorArray.map(item => ({ value: item.financialLedgerId, label: item.accountName })));
    } catch (e) { console.error(e); }
  }, []);

  const getVehicleListFunction = useCallback(async () => {
    try {
      const response = await fetch("https://vikrantpatiloffice.in:8443/transportmgmtdev/vehicles/getAllVehiclesByFilter", {
        method: "POST",
        headers,
        body: JSON.stringify({}),
      });
      const result = await response.json();
      const vehicleArray = result?.body || [];
      setVehicleOptions(vehicleArray.map(item => ({ value: item.vehicleId, label: item.vehicleName })));
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchMemoData();
    getVendorListFunction();
    getVehicleListFunction();
  }, [fetchMemoData, getVendorListFunction, getVehicleListFunction]);

  const getFilters = () => {
    const filter = {};
    if (selectedVendor?.value) filter.creditAc = selectedVendor.value;
    if (selectedVehicle?.value) filter.vehicleNo = selectedVehicle.value;
    if (fromDate && toDate) {
      filter.range = {
        memoDate: {
          start: dayjs(fromDate).format("YYYY-MM-DD"),
          end: dayjs(toDate).format("YYYY-MM-DD"),
        },
      };
    }
    return filter;
  };

  const handleSearch = () => fetchMemoData(getFilters());

  const handleClear = () => {
    setSelectedVendor(null);
    setSelectedVehicle(null);
    setFromDate(null);
    setToDate(null);
    fetchMemoData({});
  };

  // ================= DYNAMIC EXPORT PDF =================
  const exportPDF = async () => {
    const result = await fetchMemoData(getFilters());
    if (!result || !result.body) return alert("Failed to fetch data for export.");

    const dataRoot = Array.isArray(result.body) ? result.body[0] : result.body;
    const client = dataRoot?.clientDTO || {};
    const memoData = Array.isArray(result.body) ? result.body : (result.body.content || []);

    const doc = new jsPDF("landscape");
    const centerX = 148; 

    // 1. Company Name (Flint Transporters)
    doc.setTextColor(170, 0, 0); // Dark Red
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(client.clientName || "Flint Transporters", centerX, 15, { align: "center" });

    // 2. Logo (Positioned precisely as per SS)
    if (client.logo) {
      try {
        const logoSrc = client.logo.startsWith("data:image") ? client.logo : `data:image/png;base64,${client.logo}`;
        doc.addImage(logoSrc, "PNG", 15, 15, 35, 35);
      } catch (e) { console.error("Logo Error", e); }
    }

    // 3. Sub-Header Info (Address & Contact)
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(client.typesOfWork || "", centerX, 22, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.text(client.address || "", centerX, 28, { align: "center" });
    
    const locationStr = `${client.city || ""}, ${client.state || ""} - ${client.pinCode || ""}`;
    doc.text(locationStr, centerX, 34, { align: "center" });
    
    doc.text(`Contact No: ${client.mobNo || ""} / ${client.altMobNo || ""}`, centerX, 40, { align: "center" });
    doc.text(`Email: ${client.emailId || ""}`, centerX, 46, { align: "center" });

    

    // 4. Report Title (Underlined style with Bold Line)
    doc.setTextColor(170, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Vendor Entry Register", centerX, 55, { align: "center" });
    
    // Setting bold underline
    doc.setDrawColor(170, 0, 0);
    doc.setLineWidth(0.8); // Increased from default to make it Bold
    doc.line(centerX - 38, 57, centerX + 38, 57); // Adjusted width and position
    doc.setLineWidth(0.1); // Reset line width so it doesn't affect the table

    // 5. Centered Dates (Reduced Space between From and To)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    const fDate = fromDate ? dayjs(fromDate).format("YYYY-MM-DD") : (dataRoot.fromDate || "N/A");
    const tDate = toDate ? dayjs(toDate).format("YYYY-MM-DD") : (dataRoot.toDate || "N/A");
    
    // Combining them into one centered line to match the screenshot layout
    const dateRangeString = `From Date: ${fDate}            To Date: ${tDate}`;
    doc.text(dateRangeString, centerX, 68, { align: "center" });

    // 6. Table (Matching Screenshot Columns and Styling)
    const tableColumn = [
      "Vendor Entry No", "LR No", "Vendor Entry Date", "Vendor Name", 
      "From Area", "To Area", "Freight", "Add", "Less", "Total Freight", "Advance", "Balance"
    ];

    const tableRows = memoData.map((item, idx) => [
      item.memoNo || idx + 1,
      item.lrNo || "",
      item.memoDate || "",
      item.supplierName || "",
      item.fromArea || "",
      item.toArea || "",
      item.freight || 0,
      item.extraAdd || 0,
      item.extraLess || 0,
      item.totalFreight || 0,
      item.advance || 0,
      item.balance || 0,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { 
        fontSize: 9, 
        cellPadding: 2, 
        valign: 'middle',
        textColor: [0, 0, 0],
        lineColor: [100, 100, 100],
        lineWidth: 0.1,
      },
      headStyles: { 
        fillColor: [255, 255, 255], // White header as per SS
        textColor: [0, 0, 0], 
        fontStyle: 'bold',
        halign: 'left',
        lineWidth: 0.2,
      },
      columnStyles: {
        0: { cellWidth: 15 }, // Vendor Entry No
        1: { cellWidth: 12 }, // LR No
        2: { cellWidth: 25 }, // Date
        6: { halign: 'left' }, // Matching SS left-align
       // 9: { fontStyle: 'bold' } // Emphasize Total
       
      },
      margin: { left: 10, right: 10 },
      // Summary "Total" row as seen in screenshot
      foot: [['Total', '', '', '', '', '', '', '', '', '', '', '']],
      footStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    doc.save(`Vendor_Register_${client.clientCode || "Export"}.pdf`);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Header />
        <div className="filter-card">
          <div className="filter-grid" style={{ gap: "25px" }}>
            <Select 
              options={vendorOptions} 
              value={selectedVendor} 
              onChange={setSelectedVendor} 
              placeholder="Select Vendor" 
              isSearchable 
            />
            <DatePicker 
              selected={fromDate} 
              onChange={setFromDate} 
              dateFormat="dd/MM/yyyy" 
              placeholderText="From Date" 
              className="custom-input" 
            />
            <DatePicker 
              selected={toDate} 
              onChange={setToDate} 
              minDate={fromDate} 
              dateFormat="dd/MM/yyyy" 
              placeholderText="To Date" 
              className="custom-input" 
            />
            <Select 
              options={vehicleOptions} 
              value={selectedVehicle} 
              onChange={setSelectedVehicle} 
              placeholder="Select Vehicle" 
              isSearchable 
            />
            <div className="filter-actions">
              <button className="btn-clear" onClick={handleSearch}>Search</button>
              <button className="btn-clear" onClick={handleClear}>Clear</button>
              <button className="btn-export" onClick={exportPDF} disabled={loading}>
                {loading ? "Loading..." : "Export"}
              </button>
            </div>
          </div>
        </div>
        <VendorTable data={memos} />
      </div>
    </div>
  );
}