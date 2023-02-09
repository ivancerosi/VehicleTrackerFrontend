import React from "react";
import Popup from "../Popup";
import styles from "./AlarmPopup.module.css";
import DataRow from "../DataRow";
import { connect } from "react-redux";
import { updateAlarmData } from "../../redux/actions";
import { getAlarmData } from "../../redux/selectors";
import {AiOutlineClose} from 'react-icons/ai';
import { deleteEmail, getEmails, getSettings, postEmail, updateSettings, updateSettingsAll } from "../../utils/Fetcher";

class AlarmPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state={emails:[]};
        this.emailRef = React.createRef();

        this.speedRef = React.createRef();
        this.temperatureRef=React.createRef();
    }

    componentDidMount() {
        console.log(this.props.vehicle);
        getSettings().then(resp=>{
            if (resp.ok) {
                resp.json().then(json=>{
                    // add vehicle reference to this component props
                    const veh=json.find(vehicleSettings=>vehicleSettings.id==this.props.vehicle.id);
                    if (veh) {
                        this.speedRef.current.value=veh.speed;
                        this.temperatureRef.current.value=veh.temperature;
                    }
                });
            } else {
                alert("Can't load data!");
                this.props.onClose();
            }
        });

        getEmails().then(resp=>{
            if (resp.ok) {
                resp.json().then(json=>{
                    this.setState({emails:json});
                });
            } else {
                alert("Can't load data!");
                this.props.onClose();
            }
        });
    }

    validateEmail(email) {
        const regex=/^...+@..+\...+$/i;
        return regex.test(email);
    }

    isNotDuplicated(email) {
        if (this.state.emails.find(it=>it.email==email)==undefined) return true;
        return false;
    }

    addEmailHandler() {
        if (this.validateEmail(this.emailRef.current.value) && this.isNotDuplicated(this.emailRef.current.value)) {
            postEmail("","",this.emailRef.current.value).then(resp=>{
                if (resp.ok) {
                    getEmails().then(resp=>{
                        if (resp.ok) {
                            resp.json().then(json=>{
                                this.setState({emails:json});
                            });
                        } else {
                            alert("Can't load data!");
                            this.props.onClose();
                        }
                    });
                } else alert("Error");
            });
        }
        else alert('Email is invalid');
    }       
    
    deleteEmailHandler(emailArg) {
        this.setState({emails:this.state.emails.filter(email=>email!=emailArg.email)});
        deleteEmail(emailArg.id).then(resp=>{
            if (resp.ok) {
                getEmails().then(resp=>{
                    if (resp.ok) {
                        resp.json().then(json=>{
                            this.setState({emails:json});
                        });
                    } else {
                        alert("Can't load data!");
                        this.props.onClose();
                    }
                });
            } else alert("Error");
        });
    }

    submitHandler() {
        const speed=this.speedRef.current.value;
        const temp=this.temperatureRef.current.value;

        const notify=(resp)=>{
            if (resp.ok) {
                alert("Updated");
                this.props.onClose();
            } else {
                alert("Error");
            }
        }


        if (!this.props.vehicle.key) {
            updateSettingsAll(speed,temp).then(notify);
        } else {
            updateSettings(this.props.vehicle.id, speed, temp).then(notify);
        }

    }

    decideLeft=()=>this.props.isMobile?"0px":"188px";
    render() {
        return (<Popup onClose={this.props.onClose}  style={{left:this.decideLeft(), top:"80px", transform:"translate(0%,0%)"}}>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Limits</div>
                <DataRow label={"Speed limit (km/h)"} inputRef={this.speedRef} style={{"borderBottom":"none"}} />
                <DataRow label={"Temperature limit(℃)"}  inputRef={this.temperatureRef}  />
            </div>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Emails</div>
                <div className={styles.emailListContainer}>
                {this.state.emails.map(email=>(<div className={styles.emailRow}>
                    <span className={styles.emailDisplay}>{email.email}</span>
                    <div style={{cursor:'pointer'}} onClick={()=>this.deleteEmailHandler(email)}><AiOutlineClose/></div>
                </div>))}
                </div>
                <div className={styles.row} style={{width:"80%"}}>
                    <input  type="email" ref={this.emailRef} style={{flexGrow:1}} />
                    <div className={styles.buttonAddEmail} onClick={this.addEmailHandler.bind(this)}>Add e-mail</div>
                </div>
            </div>
            <div className={styles.buttonGroup}>
                <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                <div className={styles.button} onClick={this.submitHandler.bind(this)}>Update</div>
            </div>
        </Popup>);
    }
}
const mapStateToProps=(state)=>({alarmData:getAlarmData(state)});
const mapDispatchToProps=({
    updateAlarmData
});
export default connect(mapStateToProps, mapDispatchToProps)(AlarmPopup);