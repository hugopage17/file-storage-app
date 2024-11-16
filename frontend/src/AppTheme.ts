import { createTheme } from '@mui/material/styles';

const theme = (darkMode: boolean) => createTheme({
    palette: {
        mode: 'light',
        // primary: {
        //     main: '#0d804e',
        //     light: '#31e0ba',
        //     dark: '#094f31',
        //     contrastText: '#fff',
        // },
        primary: {
            main: '#10a394',
            light: '#12b5a4',
            dark: '#0d8074',
            contrastText: '#fff',
        },
        secondary: {
            main: '#31e0ba',
            light: '#34ebc3',
            dark: '#21a387',
            contrastText: '#fff',
        },
        // secondary: {
        //     main: '#31e0ba',
        //     light: '#34ebc3',
        //     dark: '#21a387',
        //     contrastText: '#fff',
        // }
    },
    colorSchemes: {
        // light: true,
        // dark: true
        // light:{
        //     palette: {
        //         primary: {
        //             main: '#0d804e',
        //             light: '#13a867',
        //             dark: '#094f31',
        //             contrastText: '#fff',
        //         },
        //         secondary: {
        //             main: '#31e0ba',
        //             light: '#34ebc3',
        //             dark: '#21a387',
        //             contrastText: '#fff',
        //         },
        //     },
        // },
        // dark: {
        //     palette: {
        //         primary: {
        //             main: '#0d804e',
        //             light: '#13a867',
        //             dark: '#094f31',
        //             contrastText: '#fff',
        //         },
        //         secondary: {
        //             main: '#31e0ba',
        //             light: '#34ebc3',
        //             dark: '#21a387',
        //             contrastText: '#fff',
        //         },
        //         background: {
        //             default: '#181a1b',
        //             paper: '#131517'
        //         }
        //     }
        // }
    }
});

export default theme;
