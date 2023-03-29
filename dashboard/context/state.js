import { createContext, useContext } from 'react';

const MyContext = createContext();

export function MyProvider({ children }) {
    const value = {};

    return (
        <MyContext.Provider value={value}>
            {children}
        </MyContext.Provider>
    );
}

export function useMyContext() {
    return useContext(MyContext);
}