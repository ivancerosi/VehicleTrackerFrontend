import './App.css';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import { connect } from 'react-redux';
import { getCurrentPopup, showingEditPopup, showingRoutePopup, showingTripsPopup, getFocusedVehicle } from './redux/selectors';
import React from 'react';
import { clearPopup} from './redux/actions';

import VehicleEdit from './components/VehicleEdit';
import { submitVehicleEdit } from './utils/Fetcher';

class App extends React.Component {
  render() {return (
    <div className="outerwrap">
    <div className="App">
      {this.props.showingEditPopup && <VehicleEdit onSubmit={submitVehicleEdit} onClose={this.props.clearPopup} vehicle={this.props.selectedVehicle}/>}
      <Sidebar></Sidebar>
      <Map />
    </div>
    </div>
  );}
}

const mapStateToProps=(state)=>({
  showPopup: getCurrentPopup(state),
  showingTripsPopup: showingTripsPopup(state),
  showingRoutePopup: showingRoutePopup(state),
  showingEditPopup:  showingEditPopup(state),
  selectedVehicle: getFocusedVehicle(state)
});

const mapDispatchToProps=({clearPopup});

export default connect(mapStateToProps,mapDispatchToProps)(App);
