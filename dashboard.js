import { Chart } from "@/components/ui/chart"
// Initialize AngularJS application
var app = angular.module("dashboardApp", [])

// Dashboard controller
app.controller("DashboardController", ($scope) => {
  // User data
  $scope.user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "avatar.jpg",
    memberSince: "January 2025",
    transactionCount: 156,
    budgetCount: 5,
    goalCount: 3,
  }

  // Modal state
  $scope.modals = {
    profile: false,
    addTransaction: false,
    addBudget: false,
    addGoal: false,
    contributeGoal: false,
    notifications: false,
  }

  // Close all modals
  $scope.closeModals = () => {
    for (var key in $scope.modals) {
      $scope.modals[key] = false
    }
  }

  // Show profile modal
  $scope.showProfileModal = () => {
    $scope.closeModals()
    $scope.modals.profile = true
  }

  // Edit profile
  $scope.editProfile = () => {
    $scope.closeModals()
    $scope.setActiveTab("settings")
  }

  // Mobile sidebar toggle
  $scope.sidebarActive = false
  $scope.toggleSidebar = () => {
    $scope.sidebarActive = !$scope.sidebarActive
  }

  // Set active tab
  $scope.activeTab = "overview"
  $scope.setActiveTab = (tab) => {
    $scope.activeTab = tab
    $scope.sidebarActive = false

    // Initialize charts when switching to reports tab
    if (tab === "reports") {
      setTimeout(() => {
        initReportChart()
      }, 100)
    }
  }

  // Format currency
  $scope.formatCurrency = (amount) => "$" + amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")

  // Summary data
  $scope.summaryData = {
    balance: 5840.23,
    income: 3200.0,
    expenses: 1850.45,
    savings: 1349.55,
  }

  // Recent transactions
  $scope.recentTransactions = [
    {
      id: 1,
      description: "Grocery Shopping",
      amount: -125.3,
      date: "Today",
      category: "food",
      icon: "🍎",
      notes: "Weekly grocery shopping",
    },
    {
      id: 2,
      description: "Salary Deposit",
      amount: 3200.0,
      date: "Yesterday",
      category: "income",
      icon: "💰",
      notes: "Monthly salary",
    },
    {
      id: 3,
      description: "Amazon Purchase",
      amount: -59.99,
      date: "Jun 2, 2025",
      category: "shopping",
      icon: "🛒",
      notes: "New headphones",
    },
    {
      id: 4,
      description: "Uber Ride",
      amount: -24.5,
      date: "Jun 1, 2025",
      category: "transport",
      icon: "🚗",
      notes: "Trip to airport",
    },
    {
      id: 5,
      description: "Movie Tickets",
      amount: -32.0,
      date: "May 29, 2025",
      category: "entertainment",
      icon: "🎬",
      notes: "Movie night with friends",
    },
  ]

  // All transactions (including recent ones)
  $scope.allTransactions = [
    ...$scope.recentTransactions,
    {
      id: 6,
      description: "Electricity Bill",
      amount: -85.4,
      date: "May 25, 2025",
      category: "utilities",
      icon: "💡",
      notes: "Monthly electricity bill",
    },
    {
      id: 7,
      description: "Internet Bill",
      amount: -65.0,
      date: "May 24, 2025",
      category: "utilities",
      icon: "🌐",
      notes: "Monthly internet bill",
    },
    {
      id: 8,
      description: "Gym Membership",
      amount: -49.99,
      date: "May 20, 2025",
      category: "health",
      icon: "🏋️",
      notes: "Monthly gym membership",
    },
    {
      id: 9,
      description: "Freelance Work",
      amount: 350.0,
      date: "May 18, 2025",
      category: "income",
      icon: "💰",
      notes: "Website design project",
    },
    {
      id: 10,
      description: "Restaurant Dinner",
      amount: -78.5,
      date: "May 15, 2025",
      category: "food",
      icon: "🍽️",
      notes: "Dinner with family",
    },
  ]

  // Transaction filter
  $scope.transactionFilter = {
    category: "",
    period: "all",
  }

  // Filter transactions
  $scope.filterTransactions = (transaction) => {
    // Filter by category
    if ($scope.transactionFilter.category && transaction.category !== $scope.transactionFilter.category) {
      return false
    }

    // Filter by period (simplified for demo)
    if ($scope.transactionFilter.period === "day" && transaction.date !== "Today") {
      return false
    }
    if ($scope.transactionFilter.period === "week" && !["Today", "Yesterday"].includes(transaction.date)) {
      return false
    }
    if (
      $scope.transactionFilter.period === "month" &&
      transaction.date.includes("May") === false &&
      !["Today", "Yesterday"].includes(transaction.date)
    ) {
      return false
    }

    return true
  }

  // Transaction form
  $scope.transactionForm = {
    description: "",
    amount: 0,
    type: "expense",
    category: "food",
    date: new Date(),
    notes: "",
  }

  // Show add transaction modal
  $scope.showAddTransactionModal = () => {
    $scope.closeModals()
    $scope.editingTransaction = null
    $scope.transactionForm = {
      description: "",
      amount: 0,
      type: "expense",
      category: "food",
      date: new Date(),
      notes: "",
    }
    $scope.modals.addTransaction = true
  }

  // Edit transaction
  $scope.editTransaction = (transaction) => {
    $scope.closeModals()
    $scope.editingTransaction = transaction
    $scope.transactionForm = {
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      type: transaction.amount < 0 ? "expense" : "income",
      category: transaction.category,
      date: new Date(), // In a real app, parse the date string
      notes: transaction.notes,
    }
    $scope.modals.addTransaction = true
  }

  // Save transaction
  $scope.saveTransaction = () => {
    // Calculate actual amount based on type
    var amount = Number.parseFloat($scope.transactionForm.amount)
    if ($scope.transactionForm.type === "expense") {
      amount = -amount
    }

    // Create transaction object
    var transaction = {
      description: $scope.transactionForm.description,
      amount: amount,
      date: $scope.transactionForm.date.toLocaleDateString(), // Simplified for demo
      category: $scope.transactionForm.category,
      notes: $scope.transactionForm.notes,
      icon: getCategoryIcon($scope.transactionForm.category),
    }

    // If editing, update existing transaction
    if ($scope.editingTransaction) {
      var index = $scope.allTransactions.findIndex((t) => t.id === $scope.editingTransaction.id)
      if (index !== -1) {
        transaction.id = $scope.editingTransaction.id
        $scope.allTransactions[index] = transaction
      }
    } else {
      // Add new transaction
      transaction.id = $scope.allTransactions.length + 1
      $scope.allTransactions.unshift(transaction)

      // Update recent transactions
      $scope.recentTransactions = $scope.allTransactions.slice(0, 5)
    }

    // Update summary data
    updateSummaryData()

    // Close modal
    $scope.closeModals()

    // Show notification
    addNotification({
      type: "success",
      icon: "✅",
      message: $scope.editingTransaction ? "Transaction updated successfully!" : "Transaction added successfully!",
      time: "Just now",
    })
  }

  // Delete transaction
  $scope.deleteTransaction = (transaction) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      // Remove from allTransactions
      var index = $scope.allTransactions.findIndex((t) => t.id === transaction.id)
      if (index !== -1) {
        $scope.allTransactions.splice(index, 1)
      }

      // Update recent transactions
      $scope.recentTransactions = $scope.allTransactions.slice(0, 5)

      // Update summary data
      updateSummaryData()

      // Show notification
      addNotification({
        type: "info",
        icon: "🗑️",
        message: "Transaction deleted successfully!",
        time: "Just now",
      })
    }
  }

  // Get category icon
  function getCategoryIcon(category) {
    var icons = {
      food: "🍎",
      shopping: "🛒",
      transport: "🚗",
      entertainment: "🎬",
      income: "💰",
      utilities: "💡",
      health: "🏋️",
      other: "📝",
    }
    return icons[category] || "📝"
  }

  // Update summary data
  function updateSummaryData() {
    var income = 0
    var expenses = 0

    $scope.allTransactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount
      } else {
        expenses += Math.abs(transaction.amount)
      }
    })

    $scope.summaryData.income = income
    $scope.summaryData.expenses = expenses
    $scope.summaryData.savings = income - expenses
    $scope.summaryData.balance = 5840.23 // In a real app, calculate this based on all transactions
  }

  // Budgets
  $scope.budgets = [
    {
      id: 1,
      category: "Food",
      limit: 500,
      spent: 350,
      period: "month",
    },
    {
      id: 2,
      category: "Shopping",
      limit: 300,
      spent: 210,
      period: "month",
    },
    {
      id: 3,
      category: "Transport",
      limit: 200,
      spent: 180,
      period: "month",
    },
    {
      id: 4,
      category: "Entertainment",
      limit: 150,
      spent: 175,
      period: "month",
    },
    {
      id: 5,
      category: "Utilities",
      limit: 300,
      spent: 250,
      period: "month",
    },
  ]

  // Budget filter
  $scope.budgetFilter = {
    period: "month",
  }

  // Get budget percentage
  $scope.getBudgetPercentage = (budget) => Math.min(Math.round((budget.spent / budget.limit) * 100), 100)

  // Get budget color
  $scope.getBudgetColor = (budget) => {
    var percentage = $scope.getBudgetPercentage(budget)
    if (percentage < 50) {
      return "#27ae60" // Green
    } else if (percentage < 80) {
      return "#f39c12" // Orange
    } else {
      return "#e74c3c" // Red
    }
  }

  // Budget form
  $scope.budgetForm = {
    category: "",
    limit: 0,
    period: "month",
  }

  // Show add budget modal
  $scope.showAddBudgetModal = () => {
    $scope.closeModals()
    $scope.editingBudget = null
    $scope.budgetForm = {
      category: "Food",
      limit: 0,
      period: "month",
    }
    $scope.modals.addBudget = true
  }

  // Edit budget
  $scope.editBudget = (budget) => {
    $scope.closeModals()
    $scope.editingBudget = budget
    $scope.budgetForm = {
      category: budget.category,
      limit: budget.limit,
      period: budget.period,
    }
    $scope.modals.addBudget = true
  }

  // Save budget
  $scope.saveBudget = () => {
    // Create budget object
    var budget = {
      category: $scope.budgetForm.category,
      limit: Number.parseFloat($scope.budgetForm.limit),
      spent: 0, // In a real app, calculate this based on transactions
      period: $scope.budgetForm.period,
    }

    // If editing, update existing budget
    if ($scope.editingBudget) {
      var index = $scope.budgets.findIndex((b) => b.id === $scope.editingBudget.id)
      if (index !== -1) {
        budget.id = $scope.editingBudget.id
        budget.spent = $scope.editingBudget.spent // Preserve spent amount
        $scope.budgets[index] = budget
      }
    } else {
      // Add new budget
      budget.id = $scope.budgets.length + 1
      $scope.budgets.push(budget)
    }

    // Close modal
    $scope.closeModals()

    // Show notification
    addNotification({
      type: "success",
      icon: "✅",
      message: $scope.editingBudget ? "Budget updated successfully!" : "Budget created successfully!",
      time: "Just now",
    })
  }

  // Delete budget
  $scope.deleteBudget = (budget) => {
    if (confirm("Are you sure you want to delete this budget?")) {
      // Remove from budgets
      var index = $scope.budgets.findIndex((b) => b.id === budget.id)
      if (index !== -1) {
        $scope.budgets.splice(index, 1)
      }

      // Show notification
      addNotification({
        type: "info",
        icon: "🗑️",
        message: "Budget deleted successfully!",
        time: "Just now",
      })
    }
  }

  // Goals
  $scope.goals = [
    {
      id: 1,
      name: "Emergency Fund",
      target: 10000,
      current: 5500,
      deadline: "December 31, 2025",
      notes: "Save for unexpected expenses",
    },
    {
      id: 2,
      name: "New Car",
      target: 25000,
      current: 8000,
      deadline: "June 30, 2026",
      notes: "Saving for a new electric car",
    },
    {
      id: 3,
      name: "Vacation",
      target: 5000,
      current: 2800,
      deadline: "August 15, 2025",
      notes: "Summer vacation in Europe",
    },
  ]

  // Get goal percentage
  $scope.getGoalPercentage = (goal) => Math.min(Math.round((goal.current / goal.target) * 100), 100)

  // Goal form
  $scope.goalForm = {
    name: "",
    target: 0,
    current: 0,
    deadline: new Date(),
    notes: "",
  }

  // Show add goal modal
  $scope.showAddGoalModal = () => {
    $scope.closeModals()
    $scope.editingGoal = null
    $scope.goalForm = {
      name: "",
      target: 0,
      current: 0,
      deadline: new Date(),
      notes: "",
    }
    $scope.modals.addGoal = true
  }

  // Edit goal
  $scope.editGoal = (goal) => {
    $scope.closeModals()
    $scope.editingGoal = goal
    $scope.goalForm = {
      name: goal.name,
      target: goal.target,
      current: goal.current,
      deadline: new Date(), // In a real app, parse the date string
      notes: goal.notes,
    }
    $scope.modals.addGoal = true
  }

  // Save goal
  $scope.saveGoal = () => {
    // Create goal object
    var goal = {
      name: $scope.goalForm.name,
      target: Number.parseFloat($scope.goalForm.target),
      current: Number.parseFloat($scope.goalForm.current),
      deadline: $scope.goalForm.deadline.toLocaleDateString(), // Simplified for demo
      notes: $scope.goalForm.notes,
    }

    // If editing, update existing goal
    if ($scope.editingGoal) {
      var index = $scope.goals.findIndex((g) => g.id === $scope.editingGoal.id)
      if (index !== -1) {
        goal.id = $scope.editingGoal.id
        $scope.goals[index] = goal
      }
    } else {
      // Add new goal
      goal.id = $scope.goals.length + 1
      $scope.goals.push(goal)
    }

    // Close modal
    $scope.closeModals()

    // Show notification
    addNotification({
      type: "success",
      icon: "✅",
      message: $scope.editingGoal ? "Goal updated successfully!" : "Goal added successfully!",
      time: "Just now",
    })
  }

  // Delete goal
  $scope.deleteGoal = (goal) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      // Remove from goals
      var index = $scope.goals.findIndex((g) => g.id === goal.id)
      if (index !== -1) {
        $scope.goals.splice(index, 1)
      }

      // Show notification
      addNotification({
        type: "info",
        icon: "🗑️",
        message: "Goal deleted successfully!",
        time: "Just now",
      })
    }
  }

  // Contribute to goal
  $scope.contributeToGoal = (goal) => {
    $scope.closeModals()
    $scope.selectedGoal = goal
    $scope.contributionForm = {
      amount: 0,
      date: new Date(),
      notes: "",
    }
    $scope.modals.contributeGoal = true
  }

  // Save contribution
  $scope.saveContribution = () => {
    // Add contribution to goal
    var index = $scope.goals.findIndex((g) => g.id === $scope.selectedGoal.id)
    if (index !== -1) {
      $scope.goals[index].current += Number.parseFloat($scope.contributionForm.amount)

      // Show notification
      addNotification({
        type: "success",
        icon: "💰",
        message: "Contribution added to " + $scope.selectedGoal.name + "!",
        time: "Just now",
      })
    }

    // Close modal
    $scope.closeModals()
  }

  // Reports
  $scope.reportFilter = {
    type: "spending",
    period: "month",
  }

  // Get report title
  $scope.getReportTitle = () => {
    var type = $scope.reportFilter.type
    var period = $scope.reportFilter.period

    var typeText =
      type === "spending" ? "Spending by Category" : type === "income" ? "Income vs Expenses" : "Savings Rate"

    var periodText =
      period === "month"
        ? "This Month"
        : period === "quarter"
          ? "This Quarter"
          : period === "year"
            ? "This Year"
            : "Custom Range"

    return typeText + " - " + periodText
  }

  // Report summary
  $scope.reportSummary = [
    { label: "Total Income", value: "$3,550.00" },
    { label: "Total Expenses", value: "$1,850.45" },
    { label: "Net Savings", value: "$1,699.55" },
    { label: "Savings Rate", value: "47.9%" },
    { label: "Largest Expense", value: "Food ($350.00)" },
  ]

  // Export report
  $scope.exportReport = () => {
    alert("Report exported! (This would download a PDF or CSV in a real app)")
  }

  // Initialize report chart
  function initReportChart() {
    if (document.getElementById("reportChart")) {
      var ctx = document.getElementById("reportChart").getContext("2d")

      // Different chart based on report type
      if ($scope.reportFilter.type === "spending") {
        // Spending by category chart
        var chartSpending = new Chart(ctx, {
          type: "pie",
          data: {
            labels: ["Food", "Shopping", "Transport", "Entertainment", "Utilities", "Other"],
            datasets: [
              {
                data: [350, 210, 180, 175, 250, 685.45],
                backgroundColor: ["#ffeaa7", "#fab1a0", "#81ecec", "#a29bfe", "#74b9ff", "#b2bec3"],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "right",
            },
          },
        })
      } else if ($scope.reportFilter.type === "income") {
        // Income vs Expenses chart
        var chartIncome = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Income",
                backgroundColor: "#27ae60",
                data: [3000, 3000, 3200, 3200, 3550, 3550],
              },
              {
                label: "Expenses",
                backgroundColor: "#e74c3c",
                data: [1800, 1750, 1900, 1700, 1850, 1850],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    callback: (value) => "$" + value,
                  },
                },
              ],
            },
          },
        })
      } else {
        // Savings rate chart
        var chartSavings = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Savings Rate (%)",
                borderColor: "#3498db",
                backgroundColor: "rgba(52, 152, 219, 0.2)",
                data: [40, 41.7, 40.6, 46.9, 47.9, 47.9],
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    callback: (value) => value + "%",
                  },
                },
              ],
            },
          },
        })
      }
    }
  }

  // Settings
  $scope.settings = {
    profile: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
    },
    password: {
      current: "",
      new: "",
      confirm: "",
    },
    preferences: {
      currency: "USD",
      theme: "light",
      notifications: true,
    },
  }

  // Save profile settings
  $scope.saveProfileSettings = () => {
    // Update user name
    $scope.user.name = $scope.settings.profile.name
    $scope.user.email = $scope.settings.profile.email

    // Show notification
    addNotification({
      type: "success",
      icon: "✅",
      message: "Profile settings saved successfully!",
      time: "Just now",
    })
  }

  // Change password
  $scope.changePassword = () => {
    // Validate password
    if ($scope.settings.password.new !== $scope.settings.password.confirm) {
      alert("New passwords do not match!")
      return
    }

    // In a real app, validate current password and update password

    // Reset form
    $scope.settings.password = {
      current: "",
      new: "",
      confirm: "",
    }

    // Show notification
    addNotification({
      type: "success",
      icon: "🔒",
      message: "Password changed successfully!",
      time: "Just now",
    })
  }

  // Save preferences
  $scope.savePreferences = () => {
    // In a real app, save preferences to server

    // Show notification
    addNotification({
      type: "success",
      icon: "⚙️",
      message: "Preferences saved successfully!",
      time: "Just now",
    })
  }

  // Notifications
  $scope.notifications = [
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
    {
      id: 3,
      type: "success",
      icon: "🎯",
      message: "You're halfway to your Vacation savings goal!",
      time: "3 days ago",
      read: true,
    },
  ]

  // Show notifications
  $scope.showNotifications = () => {
    $scope.closeModals()
    $scope.modals.notifications = true
  }

  // Mark notification as read
  $scope.markAsRead = (notification) => {
    notification.read = true
  }

  // Mark all notifications as read
  $scope.markAllAsRead = () => {
    $scope.notifications.forEach((notification) => {
      notification.read = true
    })
  }

  // Check if there are unread notifications
  $scope.hasUnreadNotifications = () => $scope.notifications.some((notification) => !notification.read)

  // Add notification
  function addNotification(notification) {
    notification.id = $scope.notifications.length + 1
    notification.read = false
    $scope.notifications.unshift(notification)
  }

  // Initialize spending chart
  setTimeout(() => {
    if (document.getElementById("spendingChart")) {
      var ctx = document.getElementById("spendingChart").getContext("2d")
      var chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [
            {
              label: "Expenses",
              backgroundColor: "#e74c3c",
              data: [1250, 1500, 1320, 1800, 1650, 1850],
            },
            {
              label: "Income",
              backgroundColor: "#27ae60",
              data: [2800, 2800, 3000, 3200, 3200, 3200],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                  callback: (value) => "$" + value,
                },
              },
            ],
          },
        },
      })
    }
  }, 100)
})

