import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0d804e',
            light: '#13a867',
            dark: '#094f31',
            contrastText: '#fff',
        },
        secondary: {
            main: '#31e0ba',
            light: '#34ebc3',
            dark: '#21a387',
            contrastText: '#fff',
        },
    },
});

export default theme;
