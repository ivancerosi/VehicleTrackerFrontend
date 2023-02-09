import React from 'react';
import { connect } from 'react-redux';
import styles from './Sidebar.module.css';
import { getAllVehicles, getAllVehiclesMock } from '../../utils/Fetcher';
import {focusVehicle, setVehiclesToRender, unfocusVehicle, recenterMap, queueMethod, setFilterActive, setGlobalVehicleRefresh, expandSidebar } from '../../redux/actions';
import { getFocusedVehicle, getIsSidebarExpanded, isMobile } from '../../redux/selectors';
import { FilterPopup } from '../FilterPopup';
import { VehicleAdapter } from '../../utils/VehicleAdapter';
import {TfiArrowCircleRight} from 'react-icons/tfi';
import AlarmPopup from '../AlarmPopup';

String.prototype.includes_insensitive= function (searchString, position) {
    return this.toLowerCase().includes(searchString.toLowerCase(), position);
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state={width:window.innerWidth, vehicles:[],previousTimeout:null
            ,filterActive:false, filterFlipCd:false,
            showingFilterPopup:false, filterShowPopupCd:false, vehicleSearchTerm:"",
            showingAlarmPopup:false,
            filters:{},
            
        };
    }

    refreshVehicles=()=>{
        getAllVehicles(list=>{
            list=VehicleAdapter(list);
            this.setState({vehicles:list});
            this.props.setVehiclesToRender(list);
        }, error=>alert(`Unable to fetch vehicles: ${error}`));
    };

    componentDidMount() {
        this.props.setGlobalVehicleRefresh(this.refreshVehicles.bind(this));
        this.refreshVehicles();
    }

    searchVehiclesHandler = (e) => {
        e.preventDefault();
        alert(`typed: ${this.state.vehicleSearchTerm}`);
    };

    searchVehicles=(term)=> {
        if (this.state.vehicles.length==0) return;
        //const vehiclesToRender=[];
        
        const vehicles=this.state.vehicles.map(vehicle=>{
            vehicle.show=false;
            for (const field in vehicle) {
                try {
                    if (vehicle[field].toLowerCase().includes(term.toLowerCase())) {
                        //vehiclesToRender.push(vehicle);
                        vehicle.show=true; break;
                    }
                } catch(e) {
                    if (e instanceof TypeError) {
                        if (vehicle[field].toString().includes(term)) {
                            //vehiclesToRender.push(vehicle);
                            vehicle.show=true; break;
                        }
                    }
                }
            }
            return vehicle;
        });
        this.setState({vehicles:vehicles});
    };

    vehicleSearchOnChange = (e) => {
        if (this.state.previousTimeout) clearTimeout(this.state.previousTimeout);
        let prevTimeout=setTimeout(()=>this.searchVehicles(e.target.value),100);
        this.setState({vehicleSearchTerm:e.target.value, previousTimeout:prevTimeout, filterState:{}});
    };


    focusVehicleHandler = (vehicle) => {
        if (!vehicle) return;
        // Toggle)
        if (this.props.focusedVehicle.key==vehicle.key) {
            this.props.unfocusVehicle(vehicle);
            return;
        }
        this.props.focusVehicle(vehicle);
        this.props.recenterMap();
    };
    
    isFocused=(vehicle) => {
        if (vehicle.key==this.props.focusedVehicle.key) return " "+styles.focused;
        else return "";
    };

    flipFilterActive=()=>{
        if (!this.state.filterFlipCd) {
            this.props.setFilterActive(!this.state.filterActive);
            this.setState({filterActive:!this.state.filterActive, filterFlipCd:true});
            this.props.queueMethod(this.setState.bind(this,{filterFlipCd:false}),300,"filterFlip");
        }
    }

    filterActiveStyle=(param)=> {
        const returnVal=styles.filterStatusOnColor;
        if (param=="foreground") return this.state.filterActive ? styles.filterActive
            : styles.filterInactive;
        else return this.state.filterActive ? returnVal
        : returnVal+" "+styles.off;
    }

    toggleFilterPopupHandler = () => {
        this.setState({showingFilterPopup:!this.state.showingFilterPopup});
    };

    toggleAlarmPopupHandler = () => {
        this.setState({showingAlarmPopup:!this.state.showingAlarmPopup});
    };
    closeAlarmPopup=()=>{
        this.setState({showingAlarmPopup:false});
    }

    setFilterState=(fstate)=>{
        let filterActive=false;
        for (const i in fstate) {
            if (fstate[i] && fstate[i].length>0) {
                filterActive=true;
                break;
            }
        }
        let vehiclesUpdated=this.state.vehicles.map(vehicle=>{
            let filteredOut=false;

            for (const filterIndex in fstate) {
                const filter=fstate[filterIndex];

                if (filter) {
                    switch (filterIndex) {
                        case 'name':
                            filteredOut |= !vehicle.name.includes_insensitive(filter);
                            break;
                        case 'registration':
                            filteredOut |= !vehicle.registration.includes_insensitive(filter);
                            break;
                        case 'driver':
                            filteredOut |= !vehicle.driver.includes_insensitive(filter);
                            break;
                        case 'type':
                            filteredOut |= !vehicle.type.includes_insensitive(filter);
                            break;
                        case 'tempFrom':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.temperature>=filter;
                            break;
                        case 'tempTo':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.temperature<=filter;
                            break;
                        case 'speedFrom':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.speed>=filter;
                            break;
                        case 'speedTo':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.speed<=filter;
                            break;
                        case 'latFrom':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.lat>=filter;
                            break;
                        case 'latTo':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.lat<=filter;
                            break;
                        case 'lngFrom':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.lng>=filter;
                            break;
                        case 'lngTo':
                            if ((Number(vehicle.temperature) && filter) == false) break;
                            filteredOut |= !vehicle.lng<=filter;
                            break;
                        default:
                            throw new Error("Unknown filter parameter");
                    }
                    if (filteredOut) break;
                }
            }
            vehicle.filteredOut=filteredOut;
            return vehicle;
        });
        this.setState({filterState:fstate, filterActive:filterActive, vehicles:vehiclesUpdated});
        this.props.setVehiclesToRender(vehiclesUpdated);
        this.props.setFilterActive(filterActive);
    }


    renderFilterOptions() {
        return (<div className={styles.filterMainWrapper}>
            {this.state.showingAlarmPopup && <AlarmPopup isMobile={this.props.isMobile} onSubmit={null} onClose={this.closeAlarmPopup} vehicle={this.props.focusedVehicle} />}
            {this.state.showingFilterPopup && <FilterPopup setFilterState={this.setFilterState.bind(this)} onSubmit={null} onClose={this.toggleFilterPopupHandler} // ADD onSUbmit
             filterState={this.state.filterState} />}
            <div className={styles.filterGroup}>
                <div className={styles.filterLabel}>Filters: </div>
                <div className={styles.filterStatus+" "+this.filterActiveStyle("foreground")} onClick={()=>this.flipFilterActive()}>
                    <span>{this.state.filterActive?"ON":"OFF"}</span>
                    <div className={styles.filterStatusBckgColor}>
                        <div className={this.filterActiveStyle("background")}></div>
                    </div>
                </div>
            </div>
            <div className={styles.filterBtnsGroup}>
                <div className={styles.editBtn} onClick={this.toggleFilterPopupHandler}>EDIT</div>
                <div className={styles.clearBtn} onClick={()=>{this.setState({filterActive:false}); this.setFilterState({}); this.vehicleSearchOnChange({target:{value:""}})}}>CLEAR</div>
            </div>
        </div>);
    }

    renderVehicles= ()=>{
        if (!this.state.vehicles || this.state.vehicles.length<1) return;
        const filteredList= this.state.vehicles.filter(vehicle => (vehicle.show && !vehicle.filteredOut) || (!this.state.filterActive&&vehicle.show))
;
        return filteredList.map(vehicle=> (
            <div key={vehicle.key} className={styles.sidebarRow+" "+this.isFocused(vehicle)}
             onClick={()=>this.props.queueMethod(this.focusVehicleHandler.bind(this,vehicle))}>{vehicle.name}</div>
        ));
    }


    expandHandler=()=>{
        this.props.expandSidebar(!this.props.sidebarExpanded);
    }
    
    addMobileStyles() {
        if (this.props.isMobile) return {position:'absolute',left:'0px', height:'100vh', zIndex:'101'};
        return;
    }

    renderDefault() {
        return (<div className={styles.sidebarDefault} style={this.addMobileStyles()} >
            <div className={styles.alarm} onClick={this.toggleAlarmPopupHandler}>ALARM SETTINGS</div>
            <div className={styles.sidebarRow}><form onSubmit={this.searchVehiclesHandler}><input type="text" className={styles.vehicleSearch} value={this.state.vehicleSearchTerm} onChange={this.vehicleSearchOnChange}></input></form></div>
            {this.renderFilterOptions()}
            <div><hr/></div>

            {this.renderVehicles()}            
        </div>);
    }

    renderMobile() {
        return (<div className={styles.sidebarMobile}><div className={styles.iconWrapper} onClick={this.expandHandler}><TfiArrowCircleRight size={28} color={"black"}/></div>
        {this.renderFilterOptions()}
        </div>);
    }

    render() {
        if (this.props.isMobile  && !this.props.sidebarExpanded) return this.renderMobile();
        return this.renderDefault();
    }
}

const mapDispatchToProps=({ setVehiclesToRender, focusVehicle, unfocusVehicle, recenterMap, queueMethod, setFilterActive, setGlobalVehicleRefresh, expandSidebar });
const mapStateToProps=(state)=>{return {focusedVehicle:getFocusedVehicle(state), sidebarExpanded: getIsSidebarExpanded(state), isMobile: isMobile(state)}};
export default connect(mapStateToProps,mapDispatchToProps)(Sidebar);