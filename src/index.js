import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'material-icons/iconfont/material-icons.css';
import 'typeface-roboto';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { Provider } from 'react-redux';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import frLocale from 'date-fns/locale/fr';
import format from 'date-fns/format';

class LocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date) {
    return format(date, 'D MMM YYYY', { locale: this.locale });
  }
}

const Root = (
  <MuiPickersUtilsProvider utils={LocalizedUtils} locale={frLocale}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiPickersUtilsProvider>
);

ReactDOM.render(Root, document.getElementById('root'));
registerServiceWorker();
