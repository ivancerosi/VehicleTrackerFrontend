import { connect } from "react-redux";
import styles from "./VehicleStatus.module.css";
import React from "react";
import {BsThermometerSun, BsFillCompassFill, BsSpeedometer} from 'react-icons/bs';
import { getFocusedVehicle, isMobile } from "../../redux/selectors";
import {FaTractor,FaBus,FaCar,FaTruck,FaShip,FaHelicopter, FaQuestion} from 'react-icons/fa';
import {MdOutlineAirplanemodeActive} from 'react-icons/md';

const ICON_COLOR="white";
//const ICON_SIZE=100;

class VehicleStatus extends React.Component {
    mobileStyle() {
        if (this.props.isMobile) return {width:"100%"}
    }

    moveMarginOnMobile() {
        if (this.props.isMobile) return {marginLeft:"-30px"}
    }

    constructor(props) {
        super(props);
        this.ICON_SIZE=this.props.isMobile?90:100;
    }

    render() {
        return (
            <div className={this.props.hidden?styles.mainWrapperHidden:styles.mainWrapper} style={this.mobileStyle()} onMouseDown={e=>document.clickedOnStatus=true} onMouseUp={e=>document.clickedOnStatus=false}>


                <div className={styles.titleBar}>

                </div>
                <div className={[styles.row, styles.rowUpper].join(" ")}>
                    <div className={styles.vehicleSprite}>
                        {this.props.renderSprite(this.props.vehicle.type,this.ICON_SIZE,ICON_COLOR)}
                        <div className={styles.column}>
                            <span>Vehicle type</span>
                            <div className={styles.optionsWrapper} style={this.moveMarginOnMobile()}>
                                <span onClick={()=>this.props.showEdit()}>EDIT</span>
                                <span onClick={()=>this.props.showTrips()}>TRIPS</span>
                                <span onClick={()=>this.props.showRoute()}>ROUTE</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.vehicleInformation}>
                        <div className={styles.vehicleInfoRow}>
                            <div className={styles.vehicleInfoLabel}>Name:</div>
                            <div className={styles.vehicleInfoValue}>
                                {this.props.vehicle.name}
                            </div>
                        </div>
                        <div className={styles.vehicleInfoRow}>
                            <div className={styles.vehicleInfoLabel}>Registration:</div>
                            <div className={styles.vehicleInfoValue}>
                                {this.props.vehicle.registration}
                            </div>
                        </div>
                        <div className={styles.vehicleInfoRow}>
                            <div className={styles.vehicleInfoLabel}>Driver:</div>
                            <div className={styles.vehicleInfoValue}>
                                {this.props.vehicle.driver}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={[styles.row, styles.rowBottom].join(" ")}>
                    <div className={styles.sensorCell}>
                        <div className={styles.sensorValue}>{new Date(this.props.vehicle.time).toLocaleString()}</div>
                        <div className={styles.sensorIcon}><BsFillCompassFill size={this.ICON_SIZE} color={ICON_COLOR}/></div>
                        <span className={styles.tooltip}>Vehicle's last date of report</span>
                    </div>
                    <div className={styles.sensorCell}>
                        <div className={styles.sensorValue}>{this.props.vehicle.speed} m/s</div>
                        <div className={styles.sensorIcon}><BsSpeedometer size={this.ICON_SIZE} color={ICON_COLOR} /></div>
                        <span className={styles.tooltip}>Vehicle's last reported speed</span>
                    </div>
                    <div className={styles.sensorCell}>
                        <div className={styles.sensorValue}>{this.props.vehicle.temperature}&#176;C</div>
                        <div className={styles.sensorIcon}><BsThermometerSun size={this.ICON_SIZE} color={ICON_COLOR}/></div>
                        <span className={styles.tooltip}>Vehicle's last reported temperature</span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps=(state)=>({vehicle:getFocusedVehicle(state), isMobile:isMobile(state)});
const mapDispatchToProps=()=>({});

export default connect(mapStateToProps,null)(VehicleStatus);