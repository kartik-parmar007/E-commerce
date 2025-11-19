// useRegisterUser.js - Custom hook to register user with role
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useRegisterUser = (role) => {
  const { user, isLoaded } = useUser();
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { 
    const registerUserWithRole = async () => {
      if (!isLoaded || !user || isRegistered) return;

      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            role: role,
            firstName: user.firstName,
            lastName: user.lastName,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ User registered successfully:", data);
          setIsRegistered(true);
        } else {
          console.error("❌ Registration failed:", data.message);
          setError(data.message);
        }
      } catch (err) {
        console.error("❌ Registration error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    registerUserWithRole();
  }, [user, isLoaded, role, isRegistered]);

  return { isRegistered, error, loading };
};
