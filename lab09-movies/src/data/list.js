import {createContext, useContext} from 'react';
export const ListContext = createContext(null);
export const useList = () => useContext(ListContext);
