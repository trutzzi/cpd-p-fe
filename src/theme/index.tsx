import { red } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000',
    },
    secondary: {
      main: red[500],
    },
  },
  typography: {
    fontFamily: [
      '"Open Sans"',
    ].join(','),
  },
  spacing: 10,
});
export default theme;