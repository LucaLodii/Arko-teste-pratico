## 🚗 Project: Rent vs. Buy Car Calculator

Your task is to create a web application that compares the financial viability of **renting a car** (e.g., subscription services like Localiza) versus **buying a car**.

### Simulation Modes

* **Cash Purchase:** Buying the vehicle upfront.
* **Financed Purchase:** Buying through a loan/financing plan.

### Key Input Fields

You should include fields for:

* **Car Value:** Total price of the vehicle.
* **Monthly Rent:** Cost of the long-term rental.
* **Interest Rate:** For the financing simulation.
* **Financing Term:** Number of months/years.
* **Other Relevant Factors:** (e.g., Maintenance, IPVA/Taxes, Insurance, Depreciation, or Opportunity Cost of the capital).

---

## 🛠 Tech Stack

* **Frontend:** React + TypeScript.
* **Backend:** Node.js with Express.
* **Architecture:** Frontend and Backend must be decoupled (separate repositories or distinct folders).
* **Documentation:** A `README.md` explaining exactly how to run the project.

---

## 📦 Delivery Requirements

* **GitHub:** Code must be hosted in a repository.
* **Deployment (Bonus):** Having a live URL is highly recommended for easy access.
* **Local Execution:** If not hosted, the project must run locally without issues by following the README instructions.

### Extra Credit (Optional)

* **UI/UX:** A clean, beautiful, and intuitive interface.
* **Documentation:** A brief explanation of your technical decisions (why you chose a specific library, how you handled the math, etc.).

> **The Goal:** The recruiters aren't just looking for functional code; they want to see your **project structure**, **code quality**, and **problem-solving logic**.

---

## 💡 Quick Tips for Success

Since they mentioned "understanding how you structure the project," keep these things in mind:

1. **The "Hidden" Math:** To really impress them, don't forget **Opportunity Cost**. If I spend $50k on a car, I lose the interest I would have earned if that money stayed in a savings account. Adding this to your logic shows "Senior" level business awareness.
2. **Validation:** Use a library like `Zod` or `Joi` on the backend to validate the numeric inputs.
3. **Clean Code:** Since it's a "Buy vs Rent" calculator, keep your calculation logic in a separate utility folder/service so it's easy to unit test.
4. **Visuals:** Use a simple library like `Chart.js` or `Recharts` to show the "Break-even point" (where buying becomes cheaper than renting). Recruiters love a good graph.