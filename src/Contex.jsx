import { createContext, useEffect, useState } from "react";
import auth from "./Page/user/Firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import Swal from "sweetalert2";

// Creating a context to share auth-related data across components
export const contextData = createContext();

const Contex = ({ children }) => {
  // State to store the current user
  const [userData, setUserData] = useState(null);
 

  // State to handle loading state
  const [loading, setLoading] = useState(true);
























































  




  // Effect hook to monitor authentication state changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Set user data if user is logged in
        setUserData(user);
      } else {
        // If user logs out or no user is found, set to null
        setUserData(null);
      }
      // Set loading to false after auth state is determined
      setLoading(false);
    });

    // Cleanup the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);








const [logoutLoading, setLogoutLoading]= useState(false)

  // Function to handle user sign-out
  const signoutHandle = () => {
setLogoutLoading(true)
    signOut(auth)
      .then(() => {
        // Show success message
        Swal.fire({
          icon: 'info',
          title: 'Signed Out',
          text: 'You have been signed out successfully!',
          confirmButtonText: 'OK',
        });

        // Clear user data after sign out
        setUserData(null);
        setLogoutLoading(false)
      })
      .catch((error) => {
        // Handle any error during sign out (optional)
        console.error("Sign-out error:", error);
      });
  };


  // Data to be shared via context
  const info = {
    userData,
    loading,
    signoutHandle,
    logoutLoading
  };

  return (
    <contextData.Provider value={info}>
      {children}
    </contextData.Provider>
  );
};

export default Contex;
