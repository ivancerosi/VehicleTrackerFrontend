import React from "react";
import Popup from "../Popup";
import styles from "./TripsPopup.module.css";
import { connect } from 'react-redux';
import { getFocusedVehicle } from "../../redux/selectors";
import { getTripsOld } from "../../utils/Fetcher";


class TripsPopup extends React.Component {
    constructor(props) {
        super(props);

        this.state={trips:[]}
    }

    componentDidMount() {
        getTripsOld(this.props.selectedVehicle.id).then(resp=>{
            if (resp.ok) {
                resp.json().then(json=>{
                    const trips=[];
                    json.forEach(daytrip=>{
                        daytrip.forEach(trip=>{
                            let s=trip.data[0].time;
                            s=s.substr(0,s.length-1);
                            const sd=new Date(s);
                            trip.startdate=sd.toLocaleString();
                            
                            let e=trip.data[1].time;
                            e=e.substr(0,e.length-1);
                            const ed=new Date(e);
                            
                            let diff=ed.getTime()-sd.getTime();
                            const hours=Math.floor(diff/3600000);
                            diff-=hours*3600000;
                            const minutes=Math.floor(diff/60000);
                            diff-=minutes*60000;
                            const seconds=Math.floor(diff/1000);

                            trip.duration=`${hours}:${minutes}:${seconds}`;

                            trips.push(trip)
                        })
                    });
                    this.setState({trips:trips});
                    console.log(trips);
                });
            } else {
                alert("Cannot get trips data");
                this.props.onClose();
            }
        });
    }

    renderStyles() {
        return {left:"50%", top:"50%", transform:"translate(-50%,-50%)"};
    }

    decideWidth(arg) {
        if (this.props.isMobile) return "95vw";
        else return arg;
    }

    render() {
        return (
            <Popup onClose={this.props.onClose} height={"180px"} width={this.decideWidth.bind(this)("350px")} style={this.renderStyles()}>
                <div className={styles.dataGroup}>
                    <div className={styles.groupTitle}>Click on one of the routes to show it on map</div>
                    <hr style={{width:"100%"}}/>
                    <table>
                        <tr>
                            <th style={{textAlign:"start"}}>Start time</th>
                            <th style={{textAlign:"start"}}>Duration</th>
                        </tr>
                        {this.state.trips.map(trip=>(
                            <tr className={styles.tripRow} onClick={()=>{this.props.selectTrip(trip.data[0].time, trip.data[1].time); this.props.onClose();}}>
                                <td className={styles.tripRow} style={{paddingRight:"15px", textAlign:"start"}}>{trip.startdate}</td>
                                <td className={styles.tripRow} style={{textAlign:"start"}}>{trip.duration}</td>
                            </tr>
                        )
                        )}
                    </table>
                </div>
                <div className={styles.buttonGroup}>
                    <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                </div>                
            </Popup>
        );
    }
}

const mapStateToProps=(state)=>({
    selectedVehicle: getFocusedVehicle(state),
});

export default connect(mapStateToProps,null)(TripsPopup);