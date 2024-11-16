import { createTheme } from '@mui/material/styles';

const theme = (darkMode: boolean) => createTheme({
    palette: {
        mode: darkMode ? 'dark' : 'light',
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
        background: {
            default: darkMode ? '#181A1B' : 'white',
            paper: darkMode ? '#181A1B' : 'white'
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiButtonBase:{
            styleOverrides: {
                root: {
                    '&:focus': {
                        outline: 'none',
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        border: 'none'
                    },
                },
            },
        }
    }
});

export default theme;
