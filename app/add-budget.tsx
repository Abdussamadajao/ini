import { BudgetForm } from "@/screens/budgets/budget-form";
import React from "react";

const Budget = () => {
  const handleSubmit = (data: any) => {
    console.log("Creating budget:", data);
    // API call to create budget
  };

  return (
    <BudgetForm
      mode="create"
      onSubmit={handleSubmit}
      // onCancel={() => navigation.goBack()}
      // isLoading={isSubmitting}
    />
  );
};

export default Budget;
