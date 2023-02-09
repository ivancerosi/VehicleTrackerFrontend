import './App.css';
import Sidebar from './components/Sidebar';
import Map from './components/Map';
import { connect } from 'react-redux';
import { getCurrentPopup, showingEditPopup, showingRoutePopup, showingTripsPopup, getFocusedVehicle, getGlobalVehicleRefresh } from './redux/selectors';
import React from 'react';
import { clearPopup, setIsMobile} from './redux/actions';

import VehicleEdit from './components/VehicleEdit';
import { submitVehicleEdit } from './utils/Fetcher';
import TripsPopup from './components/TripsPopup/TripsPopup';
import RoutePopup from './components/RoutePopup/RoutePopup';

const SCREEN_LIMIT=760;
const timeouts=[];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state={width:window.innerWidth, setRoute:()=>{}};
  }
  submitHandler=(vehicle)=>{
    setTimeout(this.props.globalVehicleRefresh, 400);
    return submitVehicleEdit(vehicle);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.width != this.state.width) {
      if (this.state.width<=760) this.props.setIsMobile(true);
      else this.props.setIsMobile(false);
    }
  }

  componentDidMount() {
    if (window.innerWidth<=SCREEN_LIMIT) this.props.setIsMobile(true);
    else this.props.setIsMobile(false);
    this.setState({width:window.innerWidth})
    window.addEventListener('resize',()=>{
      for (let timeout in timeouts) {
        clearTimeout(timeout);
      }
      const timeoutId = setTimeout(()=>this.setState({width:window.innerWidth}),100);
      timeouts.unshift(timeoutId);
    });
  }

  render() {return (
    <div className="outerwrap">
    <div className="App">
      {this.props.showingEditPopup && <VehicleEdit onSubmit={this.submitHandler.bind(this)} onClose={this.props.clearPopup} vehicle={this.props.selectedVehicle} isMobile={this.state.width<=760} />}
      {this.props.showingTripsPopup && <TripsPopup onClose={this.props.clearPopup} selectTrip={(start,end)=>this.state.setRoute(start,end)} />}
      {this.props.showingRoutePopup && <RoutePopup onClose={this.props.clearPopup} setRoute={this.state.setRoute} isMobile={this.state.width<=760} />}
      <Sidebar></Sidebar>
      <Map injectSetRoute={(cb)=>this.setState({setRoute:cb})} />
    </div>
    </div>
  );}
}

const mapStateToProps=(state)=>({
  showPopup: getCurrentPopup(state),
  showingTripsPopup: showingTripsPopup(state),
  showingRoutePopup: showingRoutePopup(state),
  showingEditPopup:  showingEditPopup(state),
  selectedVehicle: getFocusedVehicle(state),
  globalVehicleRefresh: getGlobalVehicleRefresh(state)
});

const mapDispatchToProps=({clearPopup, setIsMobile});

export default connect(mapStateToProps,mapDispatchToProps)(App);
