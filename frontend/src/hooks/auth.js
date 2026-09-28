// src/hooks/auth.js

export const AUTH_HOOKS = {
  onLogin: async () => { 
    console.log("Login triggered");
    // Add your login logic here
  },
  onSignup: async () => { 
    console.log("Signup triggered");
    // Add your signup logic here
  },
  onLogout: () => { 
    console.log("Logout triggered");
    // Add your logout logic here
  },
};