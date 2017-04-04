import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {green100, green500, green700, blue500, blue700, blue100} from 'material-ui/styles/colors';

import Routing from './Router.jsx'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blue500,
    primary2Color: blue700,
    primary3Color: blue100,
  },
}, {
  avatar: {
    borderColor: null,
  },
});


injectTapEventPlugin();
render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Routing/>
  </MuiThemeProvider>
  , document.getElementById('root'));
