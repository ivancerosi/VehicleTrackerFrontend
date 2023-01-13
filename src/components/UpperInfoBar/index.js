import React from "react";
import { connect } from "react-redux";
import styles from "./UpperInfoBar.module.css";

class UpperInfoBar extends React.Component {
    constructor(props) {
        super(props);
        this.state={expanded:true}
    }

    renderCoordinates() {
        return (<div className={styles.coordinates}>
            {this.props.location}
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

export default connect(null,null)(UpperInfoBar);