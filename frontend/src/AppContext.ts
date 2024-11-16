import { createContext, Dispatch, SetStateAction } from "react";

export interface IAppContext {
    darkMode: boolean;
    toggleDarkMode: Dispatch<SetStateAction<boolean>>;
    displayView: string;
    toggleDisplayView: Dispatch<SetStateAction<string>>;
}

export default createContext<IAppContext>({
    darkMode: false,
    toggleDarkMode: () => null,
    displayView: 'tile',
    toggleDisplayView:() => null,
})