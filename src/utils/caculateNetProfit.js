import expenseModel from "../../DB/models/Expense.model.js";
import orderModel from "../../DB/models/Order.schema.js";

export const calculateNetProfit = async (startDate, endDate) => {
  const totalRevenue = await orderModel
    .aggregate([
      {
        $match: {
          receiptDate: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalCost" },
        },
      },
    ])
    .then((result) => (result.length > 0 ? result[0].total : 0));

  const totalExpenses = await expenseModel
    .aggregate([
      {
        $match: {
          date: { $gte: new Date(startDate), $lte: new Date(endDate) },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ])
    .then((result) => (result.length > 0 ? result[0].total : 0));

  // Calculate net profit
  const netProfit = totalRevenue - totalExpenses;

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
  };
};
