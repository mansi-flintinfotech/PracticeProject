import React from "react";
import "../Styles/vendor.css";

export default function VendorTable({ data }) {
  return (
    <div className="table-container">
      <table className="vendor-data-table">
        <thead>
          <tr>
            <th>Vendor Entry No</th>
            <th>LR No</th>
            <th>Vendor Entry Date</th>
            <th>Vendor Name</th>
            <th>From Area</th>
            <th>To Area</th>
            <th>Freight</th>
            <th>Add</th>
            <th>Less</th>
            <th>Total Freight</th>
            <th>Advance</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item.memoNo}>
                <td>{item.memoNo || "-"}</td>
                <td>{item.lrNo || "-"}</td>
                <td>{item.memoDate || "-"}</td>
                <td>{item.supplierName || "-"}</td>
                <td>{item.fromArea || "-"}</td>
                <td>{item.toArea || "-"}</td>
                <td>{item.freight || "0"}</td>
                <td>{item.add || "0"}</td>
                <td>{item.less || "0"}</td>
                <td>{item.totalFreight || "0"}</td>
                <td>{item.advance || "0"}</td>
                <td>{item.balance || "0"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="no-data-cell">
                <div className="no-data-content">
                  <img src="/no-data-icon.png" alt="No data" /> 
                  
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}