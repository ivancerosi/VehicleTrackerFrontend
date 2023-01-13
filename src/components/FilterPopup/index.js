import React from "react";
import DataRow from "../DataRow";
import Popup from "../Popup";
import styles from "./FilterPopup.module.css";


export class FilterPopup extends React.Component {
    constructor(props) {
        super(props);
        /*
        this.state={name:"name", registration:"reg", type:"type", driver:"driver",
            latFrom:-90, latTo:90, lngFrom:-45, lngTo:45, speedFrom:30, speedTo:80, tempFrom:0, tempTo:30
        };*/

        this.state=props.filterState?props.filterState:{};

        this.usernameRef=React.createRef();
        this.registrationRef=React.createRef();
        this.vehicleRef=React.createRef();
        this.driverRef=React.createRef();
        this.latFromRef=React.createRef();
        this.latToRef=React.createRef();
        this.lngFromRef=React.createRef();
        this.lngToRef=React.createRef();
        this.speedFromRef=React.createRef();
        this.speedToRef=React.createRef();
        this.tempFromRef=React.createRef();
        this.tempToRef=React.createRef();
    }

    trySet=(variable,value)=>{
        try {
            variable=value;
        } catch (e) {
            variable=0;
        }
    }

    submitHandler=()=> {
        this.props.setFilterState({
            name:this.usernameRef.current.value,
            registration:this.registrationRef.current.value,
            type:this.vehicleRef.current.value,
            driver:this.driverRef.current.value,
            latFrom:this.latFromRef.current.value,
            latTo:this.latToRef.current.value,
            lngFrom:this.lngFromRef.current.value,
            lngTo:this.lngToRef.current.value,
            speedFrom:this.speedFromRef.current.value,
            speedTo:this.speedToRef.current.value,
            tempFrom:this.tempFromRef.current.value,
            tempTo:this.tempToRef.current.value
        });
        this.props.onClose();
    }


    render() {
        return (<Popup onClose={this.props.onClose} height={"460px"} style={{left:"188px", top:"0px", transform:"translate(0%,0%)"}}>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Metadata</div>
                <DataRow label={"Name"} defaultValue={this.state.name} inputRef={this.usernameRef} style={{"borderBottom":"none"}} />
                <DataRow label={"Registration"} defaultValue={this.state.registration} inputRef={this.registrationRef} style={{"borderBottom":"none"}} />
                <DataRow label={"Vehicle type"} defaultValue={this.state.type} inputRef={this.vehicleRef} style={{"borderBottom":"none"}} />
                <DataRow label={"Driver"} defaultValue={this.state.driver} inputRef={this.driverRef} />
            </div>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Sensor data</div>
                <DataRow label={"Latitude from"} defaultValue={this.state.latFrom} inputRef={this.latFromRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Latitude to"} defaultValue={this.state.latTo} inputRef={this.latToRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Longitude from"} defaultValue={this.state.lngFrom} inputRef={this.lngFromRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Longitude to"} defaultValue={this.state.lngTo} inputRef={this.lngToRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Speed from"} defaultValue={this.state.speedFrom} inputRef={this.speedFromRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Speed to"} defaultValue={this.state.speedTo} inputRef={this.speedToRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Temperature from"} defaultValue={this.state.tempFrom} inputRef={this.tempFromRef}
                 style={{"borderBottom":"none"}} />
                <DataRow label={"Temperature to"} defaultValue={this.state.tempTo} inputRef={this.tempToRef} />
            </div>
            <div className={styles.buttonGroup}>
                <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                <div className={styles.button} onClick={this.submitHandler}>Submit</div>
            </div>
        </Popup>)
    }
}