// src/Api/vendorApi.js
import axios from "axios";

export const getVendorMemoData = async () => {
  try {
    const response = await axios.get(
      "https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData"
    );
    console.log("API Response:", response.data); // debug
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return [];
  }
};