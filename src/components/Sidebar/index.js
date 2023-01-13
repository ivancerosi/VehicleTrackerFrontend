import React from 'react';
import { connect } from 'react-redux';
import styles from './Sidebar.module.css';
import { getAllVehicles } from '../../utils/Fetcher';
import vehicles from '../../redux/reducers/vehicles';
import {focusVehicle, setVehiclesToRender, unfocusVehicle, recenterMap, queueMethod, clearQueue} from '../../redux/actions';
import { getFocusedVehicle } from '../../redux/selectors';
import { FilterPopup } from '../FilterPopup';

const timeouts=[];

String.prototype.includes_insensitive= function (searchString, position) {
    return this.toLowerCase().includes(searchString.toLowerCase(), position);
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state={width:window.innerWidth, vehicles:[],previousTimeout:null
            ,filterActive:false, filterFlipCd:false, updatedVehicleFilters:true,
            showingFilterPopup:false, filterShowPopupCd:false,
            filters:{}
        };
        this.SCREEN_LIMIT=800;
    }

    componentDidMount() {
        console.log('mounted');
        window.addEventListener('resize',()=>{
            for (let timeout in timeouts) {
                clearTimeout(timeout);
            }
            const timeoutId=setTimeout(()=>this.setState({width:window.innerWidth}),100);
            timeouts.unshift(timeoutId);
        });

        getAllVehicles().then(list=>{
            this.setState({vehicles:list});
            this.props.setVehiclesToRender(list);
        });

    }


    componentDidUpdate() {
        if (!this.state.updatedVehicleFilters) {
            let vehiclesUpdated=this.state.vehicles;
            vehiclesUpdated=vehiclesUpdated.filter(vehicle=>{
                for (const filterIndex in this.state.filterState) {
                    const filter=this.state.filterState[filterIndex];
                    if (filter && filter.length>0) {
                        switch (filterIndex) {
                            case 'name':
                                return vehicle.name.includes_insensitive(filter);
                            case 'registration':
                                return vehicle.registration.includes_insensitive(filter);
                            case 'driver':
                                return vehicle.driver.includes_insensitive(filter);
                            case 'type':
                                return vehicle.type.includes_insensitive(filter);
                            case 'tempFrom':
                                return vehicle.temperature>=filter;
                            case 'tempTo':
                                return vehicle.temperature<=filter;
                            case 'speedFrom':
                                return vehicle.speed>=filter;
                            case 'speedTo':
                                return vehicle.speed<=filter;
                            case 'latFrom':
                                return vehicle.lat>=filter;
                            case 'latTo':
                                return vehicle.lat<=filter;
                            case 'lngFrom':
                                return vehicle.lng>=filter;
                            case 'lngTo':
                                return vehicle.lng<=filter;
                            default:
                                throw new Error("Unknown filter parameter");
                        }
                    }
                }
            });
            this.setState({updatedVehicleFilters:true, vehicles:vehiclesUpdated});
        }
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
                console.log(`Searching ${field}`);
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
        //this.props.setVehiclesToRender(vehiclesToRender);
        console.log(this.state.vehicles);
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

    closeFilterPopup=()=>this.setState({showingFilterPopup:!this.state.showingFilterPopup});

    setFilterState=(fstate)=>{
        let filterActive=false;
        for (const i in fstate) {
            if (fstate[i] && fstate[i].length>0) {
                filterActive=true;
                break;
            }
        }
        this.setState({filterState:fstate, filterActive:filterActive, updatedVehicleFilters:false});
    }


    renderFilterOptions() {
        return (<div className={styles.filterMainWrapper}>
            {this.state.showingFilterPopup && <FilterPopup setFilterState={this.setFilterState.bind(this)} onSubmit={null} onClose={this.closeFilterPopup}
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
                <div className={styles.clearBtn} onClick={()=>{this.setState({filterState:{}, filterActive:false}); this.vehicleSearchOnChange({target:{value:""}})}}>CLEAR</div>
            </div>
        </div>);
    }

    renderVehicles= ()=>{
        return this.state.vehicles.filter(vehicle=>vehicle.show&&!vehicles.filteredOut).map(vehicle=> (
            <div key={vehicle.key} className={styles.sidebarRow+" "+this.isFocused(vehicle)}
             onClick={()=>this.props.queueMethod(this.focusVehicleHandler.bind(this,vehicle))}>{vehicle.name}</div>
        ));
    }


    renderDefault() {
        return (<div className={styles.sidebarDefault} >
            <div className={styles.sidebarRow}><form onSubmit={this.searchVehiclesHandler}><input type="text" className={styles.vehicleSearch} value={this.state.vehicleSearchTerm} onChange={this.vehicleSearchOnChange}></input></form></div>
            {this.renderFilterOptions()}
            <div><hr/></div>

            {this.renderVehicles()}            
        </div>);
    }

    renderMobile() {
        return (<div className={styles.sidebarMobile}>Mobile</div>);
    }

    render() {
        console.log(this.SCREEN_LIMIT);
        console.log(this.state.width);
        if (this.state.width<this.SCREEN_LIMIT) return this.renderMobile();
        return this.renderDefault();
    }
}

const mapDispatchToProps=({ setVehiclesToRender, focusVehicle, unfocusVehicle, recenterMap, queueMethod });
const mapStateToProps=(state)=>{return {focusedVehicle:getFocusedVehicle(state)}};
export default connect(mapStateToProps,mapDispatchToProps)(Sidebar);