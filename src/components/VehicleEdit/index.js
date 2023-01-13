import React from "react";
import Popup from "../Popup";
import styles from "./VehicleEdit.module.css";
import { getValidVehicleTypes } from "../../utils/Fetcher";
import DataRow from "../DataRow";

class VehicleEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state={vehicleTypes:[],vehicleRegistration:this.props.vehicle.registration, vehicleName:this.props.vehicle.name, vehicleType:this.props.vehicle.type};
    }

    data={};
    submitHandler=()=>{
        this.props.onSubmit(this.data).then(resp=>{
            if (resp=="success") this.props.onClose();
            else alert("error");
        });
    }

    inputHandler=(inputvar, inputval) => {
        switch (inputvar) {
            case 'name':
                this.setState({vehicleName:inputval});
                break;
            case 'registration':
                this.setState({vehicleRegistration:inputval});
                break;
            case 'type':
                this.setState({vehicleType:inputval});
                break;
            default:
                return;
        }
    }

    componentDidMount() {
        getValidVehicleTypes().then(resp=>this.setState({vehicleTypes:resp}));
    }

    render() {
        return (<Popup onClose={this.props.onClose} height={"180px"} style={{top:"auto", bottom:"210px", transform:"translate(-1%,25%)"}}>
            <div className={styles.mainWrapper}>
            <div className={styles.dataGroup}>
                <DataRow label="Label" value={this.state.vehicleName} onChange={(e)=>this.inputHandler('name',e.target.value)}/>
                <DataRow label="Registration" value={this.state.vehicleRegistration} onChange={(e)=>this.inputHandler('registration',e.target.value)}/>
                <DataRow label="Type" type="select" value={this.state.vehicleType} onChange={(e)=>this.inputHandler('type',e.target.value)}
                    options={this.state.vehicleTypes.map(vehtype=>({label:vehtype[0].toUpperCase()+vehtype.substr(1),value:vehtype}))}
                />
            </div>
            <div className={styles.buttonGroup}>
                <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                <div className={styles.button} onClick={this.submitHandler}>Submit</div>
            </div>
            </div>
        </Popup>);
    }
}

export default VehicleEdit;