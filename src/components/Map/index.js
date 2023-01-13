import React from 'react';
import { Map, Marker} from "pigeon-maps"
import { connect } from 'react-redux';
import styles from './Map.module.css';
import { getFocusedVehicle, getVehiclesToRender, isRecenterPending, isVehicleInFocus } from '../../redux/selectors';
import { recenterMap, recenterMapFinish, queueMethod, focusVehicle, unfocusVehicle, showEdit, showRoute, clearPopup, showTrips } from '../../redux/actions';
import VehicleStatus from '../VehicleStatus';
import {FaTractor,FaBus,FaCar,FaTruck,FaShip,FaHelicopter, FaQuestion} from 'react-icons/fa';
import {MdOutlineAirplanemodeActive} from 'react-icons/md';
import UpperInfoBar from '../UpperInfoBar';

const ZOOM_FACTOR=4;

class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 45.52007,
            lng: 45.79014,
            zoom: 11,
            clickedLatLng:["n/a","n/a"]
          };
          this.mapRef=React.createRef();
    }


    static getDerivedStateFromProps(props, prevState) {
        return {...prevState, recenterPending:props.recenterPending};
    }

    componentDidUpdate(props) {
        if (this.state.recenterPending) {
            this.recenterMap();
        }
    }

    componentDidMount(props) {
    }

    recenterMap() {
        this.props.recenterMapFinish();
        this.setState({lat:this.props.focusedVehicle.lat,lng:this.props.focusedVehicle.lng,clickedLatLng:[this.props.focusedVehicle.lat,this.props.focusedVehicle.lng]})
    }

    focusVehicle(vehicle) {
        this.props.focusVehicle(vehicle);
        this.setState({lat:vehicle.lat, lng:vehicle.lng, clickedLatLng:[vehicle.lat, vehicle.lng]});
    }

    renderSprite=(type, size, color)=> {
        if (type=='helicopter') return (<FaHelicopter size={size} color={color} ></FaHelicopter>);
        if (type=='plane' || type=='airplane') return (<MdOutlineAirplanemodeActive size={size} color={color} ></MdOutlineAirplanemodeActive>);
        if (type=='ship') return (<FaShip size={size} color={color} ></FaShip>)
        if (type=='tractor') return (<FaTractor size={size} color={color} ></FaTractor>)
        if (type=='truck') return (<FaTruck size={size} color={color} ></FaTruck>)
        if (type=='bus') return (<FaBus size={size} color={color} ></FaBus>)
        if (type=='car') return (<FaCar size={size} color={color} ></FaCar>)
        return (<FaQuestion size={size} color={color} ></FaQuestion>)
    }


    render () {
        return (
            <div className={styles.mapWrapper}>
            <UpperInfoBar location={`Latitude: ${parseFloat(this.state.clickedLatLng[0]).toFixed(5)} Longitude:${parseFloat(this.state.clickedLatLng[1]).toFixed(5)}`}/>
            <VehicleStatus hidden={!this.props.isVehicleInFocus} renderSprite={this.renderSprite} showEdit={()=>this.props.queueMethod(this.props.showEdit.bind(this),100,"details")}
                showTrips={()=>this.props.queueMethod(this.props.showTrips.bind(this),100,"details")} showRoute={()=>this.props.queueMethod(this.props.showRoute.bind(this),100,"details")}
                clearPopup={()=>this.props.queueMethod(this.props.clearPopup.bind(this),100,"details")} />
            <Map zoom={this.state.zoom} ref={this.mapRef}
                center={[this.state.lat,this.state.lng]}
                onBoundsChanged={({center,zoom})=>{
                    this.setState({lat:center[0],lng:center[1],zoom:zoom, markerWidth:zoom*ZOOM_FACTOR});
                    console.log(`zoom: ${zoom}`);
                }}
                onClick={({event, latLng,pixel})=>{this.props.unfocusVehicle(); this.setState({clickedLatLng:latLng});}}
            >
                
                {this.props.vehicles.map(vehicle=>(<Marker key={vehicle.key} anchor={[vehicle.lat, vehicle.lng]}>
                    <div className={styles.iconWrapper} onClick={()=>{this.props.queueMethod(this.focusVehicle.bind(this,vehicle))}}>{this.renderSprite(vehicle.type,this.state.zoom*ZOOM_FACTOR,
                         this.props.focusedVehicle.key==vehicle.key?"green":"black")}</div>
                </Marker>))}
            </Map></div>
        );
    }
}


const mapStateToProps=(state)=>{
    return {
        vehicles:getVehiclesToRender(state),
        recenterPending: isRecenterPending(state),
        focusedVehicle: getFocusedVehicle(state),
        isVehicleInFocus: isVehicleInFocus(state)
    };
};
const mapDispatchToProps=({recenterMapFinish, queueMethod, focusVehicle, unfocusVehicle, showEdit, showRoute, showTrips, clearPopup});

export default connect(mapStateToProps, mapDispatchToProps)(MyMap);