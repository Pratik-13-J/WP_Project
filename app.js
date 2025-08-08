// Initialize AngularJS application
var app = angular.module("financeApp", [])

// Main controller
app.controller("MainController", ($scope, $http) => {
  // Modal state
  $scope.modals = {
    login: false,
    signup: false,
  }

  // Form models
  $scope.loginForm = {
    email: "",
    password: "",
  }

  $scope.signupForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  }

  $scope.contactForm = {
    name: "",
    email: "",
    message: "",
  }

  // Features data
  $scope.features = [
    {
      title: "Expense Tracking",
      description:
        "Easily track all your expenses in one place. Categorize and tag transactions for better organization.",
      icon: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Budget Planning",
      description: "Create custom budgets for different categories and track your spending against them.",
      icon: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Financial Reports",
      description: "Get detailed insights with visual reports and analytics about your spending habits.",
      icon: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Goal Setting",
      description: "Set financial goals and track your progress towards achieving them over time.",
      icon: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Bill Reminders",
      description: "Never miss a payment with automated bill reminders and payment tracking.",
      icon: "/placeholder.svg?height=60&width=60",
    },
    {
      title: "Secure Data",
      description: "Your financial data is encrypted and secured with bank-level security protocols.",
      icon: "/placeholder.svg?height=60&width=60",
    },
  ]

  // Pricing plans data
  $scope.pricingPlans = [
    {
      name: "Free",
      price: "$0/month",
      features: ["Basic expense tracking", "Up to 2 budgets", "Monthly reports", "Mobile app access", "Email support"],
    },
    {
      name: "Premium",
      price: "$9.99/month",
      features: [
        "Unlimited expense tracking",
        "Unlimited budgets",
        "Advanced reports & analytics",
        "Goal setting & tracking",
        "Bill reminders",
        "Priority support",
      ],
    },
    {
      name: "Family",
      price: "$19.99/month",
      features: [
        "Everything in Premium",
        "Up to 5 user accounts",
        "Family budget sharing",
        "Shared goals",
        "Financial planning tools",
        "24/7 premium support",
      ],
    },
  ]

  // Modal functions
  $scope.showLoginModal = () => {
    $scope.modals.login = true
    $scope.modals.signup = false
  }

  $scope.showSignupModal = () => {
    $scope.modals.signup = true
    $scope.modals.login = false
  }

  $scope.closeModals = () => {
    $scope.modals.login = false
    $scope.modals.signup = false
  }

  $scope.switchToLogin = () => {
    $scope.modals.login = true
    $scope.modals.signup = false
  }

  $scope.switchToSignup = () => {
    $scope.modals.signup = true
    $scope.modals.login = false
  }

  // Form submission functions
  $scope.login = () => {
    console.log("Login form submitted", $scope.loginForm)

    // For demo purposes, just redirect to dashboard
    // In a real app, you would make an API call to your Node.js backend
    // $http.post('/api/login', $scope.loginForm)
    //     .then(function(response) {
    //         if (response.data.success) {
    //             window.location.href = response.data.redirect;
    //         }
    //     })
    //     .catch(function(error) {
    //         // Handle error
    //     });

    // For demo purposes, just redirect to dashboard
    window.location.href = "dashboard.html"
  }

  $scope.signup = () => {
    console.log("Signup form submitted", $scope.signupForm)

    // Validate password match
    if ($scope.signupForm.password !== $scope.signupForm.confirmPassword) {
      alert("Passwords do not match")
      return
    }

    // Here you would typically make an API call to your Node.js backend
    // $http.post('/api/signup', $scope.signupForm)
    //     .then(function(response) {
    //         // Handle successful signup
    //     })
    //     .catch(function(error) {
    //         // Handle error
    //     });

    // For demo purposes, just close the modal
    $scope.closeModals()
    alert("Signup functionality would be implemented with Node.js backend")
  }

  $scope.submitContactForm = () => {
    console.log("Contact form submitted", $scope.contactForm)

    // Here you would typically make an API call to your Node.js backend
    // $http.post('/api/contact', $scope.contactForm)
    //     .then(function(response) {
    //         // Handle successful submission
    //     })
    //     .catch(function(error) {
    //         // Handle error
    //     });

    // For demo purposes, just reset the form
    $scope.contactForm = {
      name: "",
      email: "",
      message: "",
    }
    alert("Message sent! (This would be implemented with Node.js backend)")
  }

  $scope.selectPlan = (plan) => {
    console.log("Selected plan:", plan)
    // Show signup modal with the selected plan
    $scope.showSignupModal()
  }

  // Close modals when clicking outside
  window.onclick = (event) => {
    if (event.target.className === "modal") {
      $scope.$apply(() => {
        $scope.closeModals()
      })
    }
  }
})

