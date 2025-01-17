import UsersGrid from "./components/usersGrid/UsersGrid";
import "./app.css";
import { Provider } from 'react-redux';
import { store } from './components/redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <UsersGrid />
    </Provider>
  );
};

export default App;