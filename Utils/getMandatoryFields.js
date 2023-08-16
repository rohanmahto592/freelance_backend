const { fetchExcelHeaders } = require("../Models/adminModel");

const getMandatoryFields = async (orderType) => {
  const response = await fetchExcelHeaders(orderType);
  if (response.success) {
    return response.message;
  }
  return [];
};
module.exports = { getMandatoryFields };
