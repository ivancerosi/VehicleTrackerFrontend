import React from "react";
import { connect } from "react-redux";
import styles from "./UpperInfoBar.module.css";
import { getIsSidebarExpanded, isMobile } from "../../redux/selectors";

class UpperInfoBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={expanded:true}
    }

    renderCoordinates() {
        if (this.props.isSidebarExpanded && this.props.isMobile) return;
        if (this.props.isMobile) {
            return (<div className={styles.coordinates}>
                {`Latitude: ${parseFloat(this.props.location.lat).toFixed(5)}`}
                <br/>
                {`Longitude: ${parseFloat(this.props.location.lng).toFixed(5)}`}
            </div>);
        } else return (<div className={styles.coordinates}>
            {`Latitude: ${parseFloat(this.props.location.lat).toFixed(5)} Longitude:${parseFloat(this.props.location.lng).toFixed(5)}`}
        </div>);
    }

    renderMarkerSettings() {
        return (<div></div>);
    }

    render() {return(
        <div className={this.state.expanded?styles.barExpanded:styles.barCollapsed}>
            {this.state.expanded && this.renderCoordinates()}
            {this.state.expanded && this.renderMarkerSettings()}
        </div>);
    }
}
const mapStateToProps=(state)=>{return {isMobile: isMobile(state), isSidebarExpanded: getIsSidebarExpanded(state)}};
export default connect(mapStateToProps,null)(UpperInfoBar);