// Get HTML elements
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addButton = document.getElementById("addButton");

const totalAmount = document.getElementById("totalAmount");
const expenseList = document.getElementById("expenseList");
const filterCategory = document.getElementById("filterCategory");

const budgetInput = document.getElementById("budget");
const remaining = document.getElementById("remaining");
const highestExpense = document.getElementById("highestExpense");

// Load saved expenses
let expenses = JSON.parse(
    localStorage.getItem("expenses") || "[]"
);

// Load saved budget
budgetInput.value = localStorage.getItem("budget") || "";

// Add a new expense
addButton.addEventListener("click", function () {
    const name = expenseName.value.trim();
    const amount = Number(expenseAmount.value);
    const category = expenseCategory.value;

    // Check user input
    if (name === "" || expenseAmount.value === "" ||
        !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount!");
        return;
    }

    // Create an expense object
    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category
    };

    // Add expense to the array
    expenses.push(expense);

    // Save and display expenses
    saveExpenses();
    displayExpenses();

    // Clear input fields
    expenseName.value = "";
    expenseAmount.value = "";
});

// Save expenses in localStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Display expenses
function displayExpenses() {
    expenseList.innerHTML = "";

    // Filter expenses by category
    const selectedCategory = filterCategory.value;

    const filteredExpenses = expenses.filter(function (expense) {
        return selectedCategory === "All" ||
               expense.category === selectedCategory;
    });

    // Show message if list is empty
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty-message">No expenses found.</p>';
    }

    // Create a card for each expense
    filteredExpenses.forEach(function (expense) {
        const card = document.createElement("div");
        card.className = "expense-card";

        const title = document.createElement("h3");
        title.textContent = expense.name;

        const amountText = document.createElement("p");
        amountText.textContent = "Amount: ₹" + expense.amount.toFixed(2);

        const categoryText = document.createElement("p");
        categoryText.textContent = "Category: " + expense.category;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";

        // Delete the selected expense
        deleteButton.addEventListener("click", function () {
            expenses = expenses.filter(function (item) {
                return item.id !== expense.id;
            });

            saveExpenses();
            displayExpenses();
        });

        card.appendChild(title);
        card.appendChild(amountText);
        card.appendChild(categoryText);
        card.appendChild(deleteButton);

        expenseList.appendChild(card);
    });

    // Calculate total of all expenses
    let total = 0;

    expenses.forEach(function (expense) {
        total += expense.amount;
    });

    totalAmount.textContent = total.toFixed(2);

    // Calculate remaining budget
    const budget = Number(budgetInput.value) || 0;
    remaining.textContent = (budget - total).toFixed(2);

    // Find the highest expense
    if (expenses.length === 0) {
        highestExpense.textContent = "No expenses yet";
    } else {
        let highest = expenses[0];

        expenses.forEach(function (expense) {
            if (expense.amount > highest.amount) {
                highest = expense;
            }
        });

        highestExpense.textContent =
            highest.name + " - ₹" + highest.amount.toFixed(2);
    }
}

// Update the list when the category changes
filterCategory.addEventListener("change", displayExpenses);

// Save the budget
budgetInput.addEventListener("input", function () {
    localStorage.setItem("budget", budgetInput.value);
    displayExpenses();
});

// Show saved expenses when the page opens
displayExpenses();