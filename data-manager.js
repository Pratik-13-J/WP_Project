// Data Manager for FinTrack application
// Uses localStorage to persist data between pages

// Initialize default data if not exists
function initializeData() {
  // User data
  if (!localStorage.getItem("user")) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        avatar: "avatar.jpg",
        memberSince: "January 2025",
      }),
    )
  }

  // Transactions
  if (!localStorage.getItem("transactions")) {
    localStorage.setItem(
      "transactions",
      JSON.stringify([
        {
          id: 1,
          description: "Grocery Shopping",
          amount: -125.3,
          date: new Date().toISOString(),
          formattedDate: "Today",
          category: "food",
          icon: "🍎",
          notes: "Weekly grocery shopping",
        },
        {
          id: 2,
          description: "Salary Deposit",
          amount: 3200.0,
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          formattedDate: "Yesterday",
          category: "income",
          icon: "💰",
          notes: "Monthly salary",
        },
        {
          id: 3,
          description: "Amazon Purchase",
          amount: -59.99,
          date: new Date("2025-06-02").toISOString(),
          formattedDate: "Jun 2, 2025",
          category: "shopping",
          icon: "🛒",
          notes: "New headphones",
        },
      ]),
    )
  }

  // Budgets
  if (!localStorage.getItem("budgets")) {
    localStorage.setItem(
      "budgets",
      JSON.stringify([
        {
          id: 1,
          category: "Food",
          limit: 500,
          spent: 0, // Will be calculated
          period: "month",
        },
        {
          id: 2,
          category: "Shopping",
          limit: 300,
          spent: 0, // Will be calculated
          period: "month",
        },
        {
          id: 3,
          category: "Entertainment",
          limit: 150,
          spent: 0, // Will be calculated
          period: "month",
        },
      ]),
    )
  }

  // Goals
  if (!localStorage.getItem("goals")) {
    localStorage.setItem(
      "goals",
      JSON.stringify([
        {
          id: 1,
          name: "Emergency Fund",
          target: 10000.0,
          current: 5500.0,
          deadline: "2025-12-31",
          formattedDeadline: "December 31, 2025",
          notes: "Save for unexpected expenses",
        },
        {
          id: 2,
          name: "New Car",
          target: 25000.0,
          current: 8000.0,
          deadline: "2026-06-30",
          formattedDeadline: "June 30, 2026",
          notes: "Saving for a new electric car",
        },
      ]),
    )
  }

  // Notifications
  if (!localStorage.getItem("notifications")) {
    localStorage.setItem(
      "notifications",
      JSON.stringify([
        {
          id: 1,
          type: "alert",
          icon: "⚠️",
          message: "You've exceeded your Entertainment budget by $25!",
          time: "2 hours ago",
          read: false,
        },
        {
          id: 2,
          type: "info",
          icon: "📊",
          message: "Your monthly financial report is ready to view.",
          time: "Yesterday",
          read: false,
        },
      ]),
    )
  }

  // Settings/Preferences
  if (!localStorage.getItem("preferences")) {
    localStorage.setItem(
      "preferences",
      JSON.stringify({
        currency: "USD",
        theme: "light",
        notifications: true,
      }),
    )
  }
}

// Get user data
function getUser() {
  return JSON.parse(localStorage.getItem("user"))
}

// Update user data
function updateUser(userData) {
  localStorage.setItem("user", JSON.stringify(userData))
}

// Get all transactions
function getTransactions() {
  return JSON.parse(localStorage.getItem("transactions"))
}

// Get recent transactions (last 5)
function getRecentTransactions() {
  const transactions = getTransactions()
  return transactions.slice(0, 5)
}

// Add a new transaction
function addTransaction(transaction) {
  const transactions = getTransactions()

  // Generate a new ID
  const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1

  // Format the date
  const transactionDate = new Date(transaction.date)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  let formattedDate
  if (transactionDate.toDateString() === today.toDateString()) {
    formattedDate = "Today"
  } else if (transactionDate.toDateString() === yesterday.toDateString()) {
    formattedDate = "Yesterday"
  } else {
    formattedDate = transactionDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Create the new transaction object
  const newTransaction = {
    id: newId,
    description: transaction.description,
    amount: transaction.type === "expense" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
    date: transaction.date,
    formattedDate: formattedDate,
    category: transaction.category,
    icon: getCategoryIcon(transaction.category),
    notes: transaction.notes || "",
  }

  // Add to the beginning of the array (most recent first)
  transactions.unshift(newTransaction)

  // Save to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions))

  // Update budget spent amounts
  updateBudgetSpending()

  return newTransaction
}

// Update an existing transaction
function updateTransaction(transaction) {
  const transactions = getTransactions()
  const index = transactions.findIndex((t) => t.id === transaction.id)

  if (index !== -1) {
    // Format the date
    const transactionDate = new Date(transaction.date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    let formattedDate
    if (transactionDate.toDateString() === today.toDateString()) {
      formattedDate = "Today"
    } else if (transactionDate.toDateString() === yesterday.toDateString()) {
      formattedDate = "Yesterday"
    } else {
      formattedDate = transactionDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    }

    // Update the transaction
    transactions[index] = {
      ...transactions[index],
      description: transaction.description,
      amount: transaction.type === "expense" ? -Math.abs(transaction.amount) : Math.abs(transaction.amount),
      date: transaction.date,
      formattedDate: formattedDate,
      category: transaction.category,
      icon: getCategoryIcon(transaction.category),
      notes: transaction.notes || "",
    }

    // Save to localStorage
    localStorage.setItem("transactions", JSON.stringify(transactions))

    // Update budget spent amounts
    updateBudgetSpending()

    return transactions[index]
  }

  return null
}

// Delete a transaction
function deleteTransaction(id) {
  const transactions = getTransactions()
  const filteredTransactions = transactions.filter((t) => t.id !== id)

  localStorage.setItem("transactions", JSON.stringify(filteredTransactions))

  // Update budget spent amounts
  updateBudgetSpending()

  return true
}

// Get financial summary (balance, income, expenses, savings)
function getFinancialSummary() {
  const transactions = getTransactions()

  let income = 0
  let expenses = 0

  transactions.forEach((transaction) => {
    if (transaction.amount > 0) {
      income += transaction.amount
    } else {
      expenses += Math.abs(transaction.amount)
    }
  })

  const savings = income - expenses
  const balance = 5000 + savings // Starting balance + savings

  return {
    balance,
    income,
    expenses,
    savings,
  }
}

// Get all budgets
function getBudgets() {
  return JSON.parse(localStorage.getItem("budgets"))
}

// Add a new budget
function addBudget(budget) {
  const budgets = getBudgets()

  // Generate a new ID
  const newId = budgets.length > 0 ? Math.max(...budgets.map((b) => b.id)) + 1 : 1

  // Create the new budget object
  const newBudget = {
    id: newId,
    category: budget.category,
    limit: Number.parseFloat(budget.limit),
    spent: 0, // Will be calculated
    period: budget.period,
  }

  // Add to the array
  budgets.push(newBudget)

  // Save to localStorage
  localStorage.setItem("budgets", JSON.stringify(budgets))

  // Update budget spent amounts
  updateBudgetSpending()

  return newBudget
}

// Update an existing budget
function updateBudget(budget) {
  const budgets = getBudgets()
  const index = budgets.findIndex((b) => b.id === budget.id)

  if (index !== -1) {
    // Update the budget (preserve the spent amount)
    const spent = budgets[index].spent

    budgets[index] = {
      ...budgets[index],
      category: budget.category,
      limit: Number.parseFloat(budget.limit),
      period: budget.period,
    }

    // Save to localStorage
    localStorage.setItem("budgets", JSON.stringify(budgets))

    // Update budget spent amounts
    updateBudgetSpending()

    return budgets[index]
  }

  return null
}

// Delete a budget
function deleteBudget(id) {
  const budgets = getBudgets()
  const filteredBudgets = budgets.filter((b) => b.id !== id)

  localStorage.setItem("budgets", JSON.stringify(filteredBudgets))

  return true
}

// Update budget spending based on transactions
function updateBudgetSpending() {
  const transactions = getTransactions()
  const budgets = getBudgets()

  // Reset all spent amounts
  budgets.forEach((budget) => {
    budget.spent = 0
  })

  // Calculate spent amount for each budget
  transactions.forEach((transaction) => {
    if (transaction.amount < 0) {
      // Only expenses
      const category = transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)
      const budget = budgets.find((b) => b.category === category)

      if (budget) {
        budget.spent += Math.abs(transaction.amount)
      }
    }
  })

  // Save updated budgets
  localStorage.setItem("budgets", JSON.stringify(budgets))
}

// Get all goals
function getGoals() {
  return JSON.parse(localStorage.getItem("goals"))
}

// Add a new goal
function addGoal(goal) {
  const goals = getGoals()

  // Generate a new ID
  const newId = goals.length > 0 ? Math.max(...goals.map((g) => g.id)) + 1 : 1

  // Format the deadline
  const deadlineDate = new Date(goal.deadline)
  const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  // Create the new goal object
  const newGoal = {
    id: newId,
    name: goal.name,
    target: Number.parseFloat(goal.target),
    current: Number.parseFloat(goal.current),
    deadline: goal.deadline,
    formattedDeadline: formattedDeadline,
    notes: goal.notes || "",
  }

  // Add to the array
  goals.push(newGoal)

  // Save to localStorage
  localStorage.setItem("goals", JSON.stringify(goals))

  return newGoal
}

// Update an existing goal
function updateGoal(goal) {
  const goals = getGoals()
  const index = goals.findIndex((g) => g.id === goal.id)

  if (index !== -1) {
    // Format the deadline
    const deadlineDate = new Date(goal.deadline)
    const formattedDeadline = deadlineDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })

    // Update the goal
    goals[index] = {
      ...goals[index],
      name: goal.name,
      target: Number.parseFloat(goal.target),
      current: Number.parseFloat(goal.current),
      deadline: goal.deadline,
      formattedDeadline: formattedDeadline,
      notes: goal.notes || "",
    }

    // Save to localStorage
    localStorage.setItem("goals", JSON.stringify(goals))

    return goals[index]
  }

  return null
}

// Delete a goal
function deleteGoal(id) {
  const goals = getGoals()
  const filteredGoals = goals.filter((g) => g.id !== id)

  localStorage.setItem("goals", JSON.stringify(filteredGoals))

  return true
}

// Add contribution to a goal
function contributeToGoal(id, amount) {
  const goals = getGoals()
  const index = goals.findIndex((g) => g.id === id)

  if (index !== -1) {
    // Update the current amount
    goals[index].current += Number.parseFloat(amount)

    // Save to localStorage
    localStorage.setItem("goals", JSON.stringify(goals))

    return goals[index]
  }

  return null
}

// Get all notifications
function getNotifications() {
  return JSON.parse(localStorage.getItem("notifications"))
}

// Mark notification as read
function markNotificationAsRead(id) {
  const notifications = getNotifications()
  const index = notifications.findIndex((n) => n.id === id)

  if (index !== -1) {
    notifications[index].read = true
    localStorage.setItem("notifications", JSON.stringify(notifications))
    return true
  }

  return false
}

// Mark all notifications as read
function markAllNotificationsAsRead() {
  const notifications = getNotifications()

  notifications.forEach((notification) => {
    notification.read = true
  })

  localStorage.setItem("notifications", JSON.stringify(notifications))
  return true
}

// Add a new notification
function addNotification(notification) {
  const notifications = getNotifications()

  // Generate a new ID
  const newId = notifications.length > 0 ? Math.max(...notifications.map((n) => n.id)) + 1 : 1

  // Create the new notification object
  const newNotification = {
    id: newId,
    type: notification.type,
    icon: notification.icon,
    message: notification.message,
    time: "Just now",
    read: false,
  }

  // Add to the beginning of the array (most recent first)
  notifications.unshift(newNotification)

  // Save to localStorage
  localStorage.setItem("notifications", JSON.stringify(notifications))

  return newNotification
}

// Get preferences
function getPreferences() {
  return JSON.parse(localStorage.getItem("preferences"))
}

// Update preferences
function updatePreferences(preferences) {
  localStorage.setItem("preferences", JSON.stringify(preferences))
  return preferences
}

// Format currency based on preferences
function formatCurrency(amount) {
  const preferences = getPreferences()

  // Format based on currency
  switch (preferences.currency) {
    case "EUR":
      return "€" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    case "GBP":
      return "£" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
    case "JPY":
      return (
        "¥" +
        Math.round(amount)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      )
    case "USD":
    default:
      return "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")
  }
}

// Get category icon
function getCategoryIcon(category) {
  const icons = {
    food: "🍎",
    shopping: "🛒",
    transport: "🚗",
    entertainment: "🎬",
    income: "💰",
    utilities: "💡",
    health: "🏋️",
    other: "📝",
  }

  return icons[category.toLowerCase()] || "📝"
}

// Calculate budget percentage
function getBudgetPercentage(budget) {
  return Math.min(Math.round((budget.spent / budget.limit) * 100), 100)
}

// Get budget color based on percentage
function getBudgetColor(budget) {
  const percentage = getBudgetPercentage(budget)

  if (percentage < 50) {
    return "#27ae60" // Green
  } else if (percentage < 80) {
    return "#f39c12" // Orange
  } else {
    return "#e74c3c" // Red
  }
}

// Calculate goal percentage
function getGoalPercentage(goal) {
  return Math.min(Math.round((goal.current / goal.target) * 100), 100)
}

// Initialize data on load
initializeData()

// Export functions
window.DataManager = {
  getUser,
  updateUser,
  getTransactions,
  getRecentTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getFinancialSummary,
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  updateBudgetSpending,
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  addNotification,
  getPreferences,
  updatePreferences,
  formatCurrency,
  getBudgetPercentage,
  getBudgetColor,
  getGoalPercentage,
}

