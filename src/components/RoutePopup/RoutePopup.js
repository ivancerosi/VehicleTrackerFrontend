/*
kad se otvori unosi vremenski period
zovni props.chart
*/

/*
    Parent:
        nakon markera dodaj routePoints.map(rp=>(<Waypoint coords=[...rp.coords]><Waypoint/>))
*/

/*
decideLeft dovrsi
namjesti input za from to date
namjesti buttone
*/

import React from 'react';
import Popup from '../Popup';
import styles from './RoutePopup.module.css';
import DataRow from '../DataRow';

class RoutePopup extends React.Component {
    constructor(props) {
        super(props);
        this.fromRef = React.createRef();
        this.toRef   = React.createRef();
    }


    renderStyles() {
        if (this.props.isMobile) {
            return {left:"50%", top:"50%", transform:"translate(-50%,-50%)"};
        } else {
            return {left:"188px", top:"80px", transform:"translate(0%,0%)"};
        }
    }

    setRouteHandler() {
        if (!this.fromRef.current.value) {
            alert(`Please enter route's full start date and time`);
        } else if (!this.toRef.current.value) {
            alert(`Please enter route's full end date and time`);
        } else {
            this.props.setRoute(this.fromRef.current.value, this.toRef.current.value);
            this.props.onClose();
        }
    } 
    decideWidth(arg) {
        if (this.props.isMobile) return "95vw";
        else return arg;
    }


    render() {
        return (<Popup onClose={this.props.onClose} height={"180px"} width={this.decideWidth.bind(this)("350px")} style={this.renderStyles()}>
            <div className={styles.dataGroup}>
                <div className={styles.groupTitle}>Select start and end time</div>
                <div><div style={{width:"100px"}}>From:</div><input type="datetime-local" ref={this.fromRef} /></div>
                <div><div style={{width:"100px"}}>To:</div><input type="datetime-local" ref={this.toRef} /></div>
            </div>
            <div className={styles.buttonGroup}>
                <div className={styles.button} onClick={this.props.onClose}>Cancel</div>
                <div className={styles.button} onClick={this.setRouteHandler.bind(this)}>Submit</div>
            </div>
        </Popup>);
    }
}

export default RoutePopup;
