// services/logoService.js

export const fetchCompanyLogo = async (headers) => {
  try {
     const response = await fetch("https://vikrantpatiloffice.in:8443/transportmgmtdev/transaction/getAllMemoData?page=0&size=10&paginate=false", {
    method: "GET",
      headers: headers,
    });

    const data = await response.json();

    // Agar backend base64 bhej raha hai
    return data.companyLogo;

  } catch (error) {
    console.error("Logo fetch failed:", error);
    return null;
  }
};