import React from "react";
import { connect } from "react-redux";
import styles from "./PlayBar.module.css";
import { MdClose, MdPlayArrow, MdPause, MdStop } from 'react-icons/md';
import { setShowingTrip, selectVehiclePosition } from "../../redux/actions";
import { getRoute, isMobile } from "../../redux/selectors";


const TIME_TO_PLAY_MILLIS=30000;

class PlayBar extends React.Component {
    constructor(props) {
        super(props);
        this.barRef = React.createRef();
        this.state={leftOffset:0, paused:true, delta:0, start:null, selectedTime:null}
    }


    updateOffset() {
        document.offsetTimeout=setTimeout(this.updateOffset.bind(this), 33);
        if (!this.state.paused) {
            let offset=this.state.leftOffset+(33/TIME_TO_PLAY_MILLIS);
            offset=Math.min(offset,1);
            this.setState({leftOffset:offset})
        }
    }
    componentWillUnmount() {
        clearTimeout(document.offsetTimeout);
    }

    componentDidMount() {
        this.updateOffset.bind(this)();
        this.setState({leftOffset:0, start:new Date(this.props.route[0].time), selectedTime:new Date(this.props.route[0].time).toString()});
        this.props.selectVehiclePosition(this.props.route[0]);
    }

    componentDidUpdate(prevprops, prevstate) {
        if (this.state.leftOffset!=prevstate.leftOffset) {
            const selected = Math.max(0,Math.round(this.state.leftOffset*(this.props.route.length-1)));
            const selectedTime = new Date(this.props.route[selected].time);
            this.setState({selectedTime:selectedTime.toString()});
            this.props.selectVehiclePosition(this.props.route[selected]);
        }
    }

    barClickHandler(e) {
        const rect=this.barRef.current.getBoundingClientRect();
        const position=(e.clientX-rect.x)/rect.width;

        this.setState({leftOffset:position})
    }

    mobileSize() {
        if (this.props.isMobile) return {width:"100%"}
    }


    render() {
        return (<div className={styles.mainWrapper}  onMouseDown={e=>document.clickedOnStatus=true} style={this.mobileSize.bind(this)()}>
            <div className={styles.topbar}>
                <div className={styles.timeWrapper}>{this.state.selectedTime}</div>
                <div className={styles.closeButton} onClick={()=>{this.props.setShowingTrip(false)}}><MdClose/></div>
            </div>
            <div className={styles.playbar} ref={this.barRef} onClick={this.barClickHandler.bind(this)}>
                <div className={styles.playdot} style={{left:`${this.state.leftOffset*100}%`}}></div>
            </div>
            <div className={styles.buttonContainer}>
                <div className={styles.ptrWrap}><MdStop onClick={()=>{
                    this.setState({paused:true, leftOffset:0})
                }}/></div>
                {!this.state.paused?<div className={styles.ptrWrap}><MdPause onClick={()=>this.setState({paused:true})}/></div>:<div className={styles.ptrWrap}><MdPlayArrow onClick={()=>this.setState({paused:false})} /></div>}
            </div>
        </div>);
    }
}
const mapStateToProps=(state)=>{
    return {route: getRoute(state), isMobile: isMobile(state)}
}

const mapDispatchToProps=({
    setShowingTrip, selectVehiclePosition
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayBar);