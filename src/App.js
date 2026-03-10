import logo from './logo.svg';
import { HashRouter as Switch, Route } from "react-router-dom";
import Login from "./components/screens/user_access/Login";
import ChangePassword from "./components/screens/user_access/ChangePassword";
import Dashboard from "./components/screens/dashboard/Dashboard";
import Role from "./components/screens/security/Role";
import User from "./components/screens/security/User";
import Operation from "./components/screens/operation_line/Operation";
import Station from "./components/screens/station/Station";
import Machine from "./components/screens/machine/Machine";
import Template from "./components/screens/template/Template";
import Event from "./components/screens/event/Event";
import Shift from "./components/screens/shift/Shift";
import ChartPage from "./components/screens/chart/ChartPage";
import ChartDetails from "./components/screens/chart/ChartDetails";
import Modify from "./components/screens/data/Modify";
import DataManagement from "./components/screens/data/DataManagement";
import Mes from "./components/screens/mes/Mes";
import Backup from "./components/screens/backup/Backup";
import $ from "jquery";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
 


import './App.css';

function App() {
  return (
    <div className="App">
      <div className="auth-inner">

        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/Login" component={Login} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/role" component={Role} />
          <Route exact path="/user" component={User} />
          <Route exact path="/operationLine" component={Operation} />
          <Route exact path="/station" component={Station} />
          <Route exact path="/machine" component={Machine} />
          <Route exact path="/template" component={Template} />
          <Route exact path="/event" component={Event} />
          <Route exact path="/shift" component={Shift} />
          <Route exact path="/chart" component={ChartPage} />
          <Route exact path="/chartDetails" component={ChartDetails} />
          <Route exact path="/modify" component={Modify} />
          <Route exact path="/management" component={DataManagement} />
          <Route exact path="/mes" component={Mes} />
          <Route exact path="/backup" component={Backup} />

        </Switch>
      </div>
    </div>
  );
}

export default App;
