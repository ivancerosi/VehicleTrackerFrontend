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
        console.log(this.usernameRef);
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
                <DataRow label={"Name"} value={this.state.name} inputRef={this.usernameRef} style={{"borderBottom":"none"}}
                 onChange={(e)=>this.setState({name:e.target.value})} />
                <DataRow label={"Registration"} value={this.state.registration} inputRef={this.registrationRef} style={{"borderBottom":"none"}}
                 onChange={(e)=>this.setState({registration:e.target.value})} />
                <DataRow label={"Vehicle type"} value={this.state.type} inputRef={this.vehicleRef} style={{"borderBottom":"none"}}
                 onChange={(e)=>this.setState({type:e.target.value})} />
                <DataRow label={"Driver"} value={this.state.driver} inputRef={this.driverRef}
                 onChange={(e)=>this.setState({driver:e.target.value})} />
            </div>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Sensor data</div>
                <DataRow label={"Latitude from"} value={this.state.latFrom} inputRef={this.latFromRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({latFrom:e.target.value})} />
                <DataRow label={"Latitude to"} value={this.state.latTo} inputRef={this.latToRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({latTo:e.target.value})}/>
                <DataRow label={"Longitude from"} value={this.state.lngFrom} inputRef={this.lngFromRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({lngFrom:e.target.value})}/>
                <DataRow label={"Longitude to"} value={this.state.lngTo} inputRef={this.lngToRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({lngTo:e.target.value})} />
                <DataRow label={"Speed from"} value={this.state.speedFrom} inputRef={this.speedFromRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({speedFrom:e.target.value})} />
                <DataRow label={"Speed to"} value={this.state.speedTo} inputRef={this.speedToRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({speedTo:e.target.value})}/>
                <DataRow label={"Temperature from"} value={this.state.tempFrom} inputRef={this.tempFromRef}
                 style={{"borderBottom":"none"}} onChange={(e)=>this.setState({tempFrom:e.target.value})}/>
                <DataRow label={"Temperature to"} value={this.state.tempTo} inputRef={this.tempToRef}
                 onChange={(e)=>this.setState({tempTo:e.target.value})}/>
            </div>
            <div className={styles.buttonGroup}>
                <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                <div className={styles.button} onClick={this.submitHandler}>Submit</div>
            </div>
        </Popup>)
    }
}