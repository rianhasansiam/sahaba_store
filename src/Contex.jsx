import { createContext } from "react";


export const contextData = createContext();

const Contex = ({ children }) => {







  const info = {
   


  };

  return (
    <contextData.Provider value={info}>
      {children}
    </contextData.Provider>
  );
};

export default Contex;
