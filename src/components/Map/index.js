import React from 'react';
import { Map, Marker} from "pigeon-maps"
import { connect } from 'react-redux';
import styles from './Map.module.css';
import { getFocusedVehicle, getVehiclesToRender, isRecenterPending, isVehicleInFocus, isFilterActive, isMobile, isShowingTrip, getVehiclePosition } from '../../redux/selectors';
import { recenterMap, recenterMapFinish, queueMethod, focusVehicle, unfocusVehicle, showEdit, clearPopup, showTrips, expandSidebar, showRoute, setShowingTrip, setRoute } from '../../redux/actions';
import VehicleStatus from '../VehicleStatus';
import {FaTractor,FaBus,FaCar,FaTruck,FaShip,FaHelicopter, FaQuestion} from 'react-icons/fa';
import {MdOutlineAirplanemodeActive} from 'react-icons/md';
import UpperInfoBar from '../UpperInfoBar';
import { getRoute } from '../../utils/Fetcher';
import PlayBar from '../PlayBar/PlayBar';

const ZOOM_FACTOR=4;
const MAX_ZOOM=18;

class MyMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: 45.52007,
            lng: 45.79014,
            prevLat: 0,
            prevLng: 0,
            zoom: 11,
            prevZoom:11,
            clickedLatLng:["n/a","n/a"],
            chartRoute:true,
            routeStart:undefined,
            routeEnd:undefined,
            rawCoords:[],
            routeCoords:[],
            blockMap:false
          };
          this.mapRef=React.createRef();
          this.routeRef=React.createRef();
          this.polylineRef=React.createRef();
          this.polylineBorderRef=React.createRef();

          this.rerenderTimeout=React.createRef();

    }


    static getDerivedStateFromProps(props, prevState) {
        return {...prevState, recenterPending:props.recenterPending};
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.state.recenterPending) {
            this.recenterMap();
        }
        if (this.state.zoom!=this.state.prevState) {
            this.rerenderRoute();
        }

        if (prevState.lng!=this.state.lng || prevState.lat!=this.state.lat) this.rerenderRoute();

    }



    mapMoveHandler(e) {
        if (e.detail==2) return;
        if (e.buttons!=1) return;
        console.log(document.clickedOnStatus);
        if (document.clickedOnStatus) return;

        if (document.isMouseDown==false || document.blockTranslate) return;

        var diffX= e.clientX-document.prevPos[0];
        var diffY= e.clientY-document.prevPos[1];
        document.translateAcc[0]+=diffX;
        document.translateAcc[1]+=diffY;

        document.routeSvg.setAttribute('transform',`translate(${document.translateAcc[0]} ${document.translateAcc[1]})`);

        document.prevPos[0]=e.clientX;
        document.prevPos[1]=e.clientY;

        if (e.buttons!=0 && e.buttons!=1) console.log(e.buttons);

    }
    mouseUpHandler() {
        document.isMouseDown=false;
        document.blockTranslate=false;
    }


    
    setRoute(start,end) {
        getRoute(this.props.focusedVehicle.id,start,end,100).then(resp=>resp.json()).then(json=>{
            const routeMarkers=[];
            let i=0;
            let lastTimestamp=null;

            let n=0;

            while (i<json.length) {
                if (lastTimestamp!=json[i].time) {
                    if (lastTimestamp!=null) {
                        routeMarkers[routeMarkers.length-1].lat/=n;
                        routeMarkers[routeMarkers.length-1].lng/=n;
                    }
                    lastTimestamp=json[i].time
                    routeMarkers.push({time:json[i].time, lat:Number(json[i].lat), lng:Number(json[i].long)});
                    n=1;
                } else {
                    routeMarkers[routeMarkers.length-1].lat+=Number(json[i].lat);
                    routeMarkers[routeMarkers.length-1].lng+=Number(json[i].long);
                    n++;
                }
                i++;
            }
            this.setState({rawCoords:routeMarkers});

            this.polylineRef.current.setAttribute("points",routeMarkers.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
            this.polylineBorderRef.current.setAttribute("points",routeMarkers.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
            document.translateAcc=[0,0];
            document.routeSvg.setAttribute("transform",`translate(${document.translateAcc[0]},${document.translateAcc[1]})`);

            this.setState({chartRoute:true,routeCoords:this.state.routeCoords});
            this.setState({showRoutePopup:false});
            this.props.setShowingTrip(true);
            
            this.props.setRoute(routeMarkers);
        });
    }


    componentDidMount(props) {
        document.isMouseDown=false;
        window.addEventListener('mousemove', this.mapMoveHandler.bind(this));
        window.addEventListener('mouseup', this.mouseUpHandler.bind(this));
        document.routeSvg=document.getElementById("route-svg");
        document.translateAcc=[0,0];
        document.blockTranslate=false;

        this.props.injectSetRoute(this.setRoute.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.mapMoveHandler.bind(this));
        window.removeEventListener('mouseup', this.mouseUpHandler.bind(this));
    }

    recenterMap() {
        this.props.expandSidebar(false);
        this.props.recenterMapFinish();
        this.setState({prevLat:this.state.lat, prevLng:this.state.lng,
            chartRoute:false,lat:this.props.focusedVehicle.lat,lng:this.props.focusedVehicle.lng,clickedLatLng:[this.props.focusedVehicle.lat,this.props.focusedVehicle.lng]})
    }

    focusVehicle(vehicle) {
        this.props.focusVehicle(vehicle);
        this.setState({ prevLat:this.state.lat, prevLng:this.state.lng,
            lat:vehicle.lat, lng:vehicle.lng, clickedLatLng:[vehicle.lat, vehicle.lng]});
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


    rerenderRoute() {  
        document.translateAcc=[0,0];
        //clearTimeout(document.rerenderTimeout);
        this.polylineRef.current.setAttribute("points",this.state.rawCoords.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
        this.polylineBorderRef.current.setAttribute("points",this.state.rawCoords.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
        document.routeSvg.setAttribute("transform",`translate(${document.translateAcc[0]} ${document.translateAcc[1]})`);
        /*
        document.rerenderTimeout = setTimeout(()=>{
            this.polylineRef.current.setAttribute("points",this.state.rawCoords.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
            this.polylineBorderRef.current.setAttribute("points",this.state.rawCoords.map(coords=>this.mapRef.current.latLngToPixel([coords.lat, coords.lng],[this.state.lat, this.state.lng],this.state.zoom).join(",")).join(" "));
            document.routeSvg.setAttribute("transform",`translate(${document.translateAcc[0]} ${document.translateAcc[1]})`);
            console.log(this.state.routeCoords);
        },10);*/
    }

    calculatePosition(lat,lng) {

        console.log(`${lat} ${lng}`)
        let x= this.mapRef.current.latLngToPixel([lat, lng],[this.state.lat, this.state.lng],this.state.zoom);
        console.log(x);
        return x;
    }

    render () {
        return (
            <div className={styles.mapWrapper} onDoubleClick={()=>{document.blockTranslate=false;}} onMouseUp={(e)=>{
                if (e.detail==2) {document.blockTranslate=false;}
                document.clickedOnStatus=false;

            }}
                onMouseDown={(e)=>{document.isMouseDown=true; document.prevPos=[e.clientX, e.clientY]; if (e.detail==2) {document.blockTranslate=true;}}} >
            <UpperInfoBar location={{lat:this.state.clickedLatLng[0],lng:this.state.clickedLatLng[1]}}/>
            
            {!this.props.isShowingTrip && <VehicleStatus hidden={!this.props.isVehicleInFocus} renderSprite={this.renderSprite} showEdit={()=>this.props.queueMethod(this.props.showEdit.bind(this),100,"details")}
                showTrips={()=>{this.props.queueMethod(this.props.showTrips.bind(this),100,"details")}} showRoute={()=>{this.props.queueMethod(this.props.showRoute.bind(this),100,"details")}}
                clearPopup={()=>this.props.queueMethod(this.props.clearPopup.bind(this),100,"details")} />}
            {this.props.isShowingTrip && <PlayBar />}
            
            <Map zoom={this.state.zoom} ref={this.mapRef} animate={false}
                center={[this.state.lat,this.state.lng]} mouseEvents={!this.state.blockMap} touchEvents={!this.state.blockMap}
                onBoundsChanged={({center,zoom})=>{
                    this.setState({prevLat:this.state.lat, prevLng:this.state.lng,lat:center[0],lng:center[1], prevZoom:this.state.zoom,zoom:zoom, markerWidth:zoom*ZOOM_FACTOR});
                }}
                onClick={({event, latLng,pixel})=>{this.props.unfocusVehicle(); this.setState({clickedLatLng:latLng}); this.props.expandSidebar(false);}}
            >
                
                {!this.props.isShowingTrip && this.props.vehicles.filter(vehicle=>!vehicle.filteredOut || !this.props.isFilterActive).map(vehicle=>(<Marker key={vehicle.key} anchor={[vehicle.lat, vehicle.lng]}>
                    <div className={styles.iconWrapper} onClick={()=>{this.props.queueMethod(this.focusVehicle.bind(this,vehicle))}}>{this.renderSprite(vehicle.type,this.state.zoom*ZOOM_FACTOR,
                         this.props.focusedVehicle.key==vehicle.key?"green":"black")}</div>
                </Marker>))}
                {this.props.isShowingTrip && this.props.selectedPosition!=null && <Marker key="VEHICLE_FOCUSED_SPECIAL" anchor={[this.props.selectedPosition.lat, this.props.selectedPosition.lng]} >
                    <div className={styles.iconWrapper}>{this.renderSprite("car",this.state.zoom*ZOOM_FACTOR,"green")}</div>
                </Marker>}
                <svg overflow={"visible"} pointerEvents={"none"} height="100%" width="100%" id="route-svg" ref={this.routeRef} visibility={this.props.isShowingTrip?"visible":"hidden"}>
                <polyline ref={this.polylineRef} id="route-polyline" style={{fill:"none", stroke: "black", strokeWidth: "7"}} />
                <polyline ref={this.polylineBorderRef}  style={{fill:"none", stroke: "#00ABF0", strokeWidth: "3"}} />
                </svg>
            </Map></div>
        );
    }
}


const mapStateToProps=(state)=>{
    return {
        vehicles:getVehiclesToRender(state),
        recenterPending: isRecenterPending(state),
        focusedVehicle: getFocusedVehicle(state),
        isVehicleInFocus: isVehicleInFocus(state),
        isFilterActive: isFilterActive(state),
        isMobile: isMobile(state),
        isShowingTrip: isShowingTrip(state),
        selectedPosition: getVehiclePosition(state)
    };
};
const mapDispatchToProps=({recenterMapFinish, queueMethod, focusVehicle, unfocusVehicle, showEdit, showRoute, showTrips, clearPopup, expandSidebar, setShowingTrip, setRoute});

export default connect(mapStateToProps, mapDispatchToProps)(MyMap);