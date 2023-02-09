import React from 'react';
import styles from './Popup.module.css';
import { MdClose } from 'react-icons/md';

const DEFAULT_WIDTH="400px";
const DEFAULT_HEIGHT="400px";
const DEFAULT_COLOR="white";

let shouldClose=true;

class Popup extends React.Component {
    constructor(props) {
        super(props);
    }

    setStyles=()=>{
        const color=this.props.color?this.props.color:DEFAULT_COLOR;
        const width=this.props.width?this.props.width:DEFAULT_WIDTH;
        const height=this.props.height?this.props.height:DEFAULT_HEIGHT;

        return {...this.props.style,color, minWidth:width, minHeight:height}
    };

    tryClose=()=>{
        if (!shouldClose) {
            shouldClose=true;
            return;
        }
        this.props.onClose();
    };
    forceClose=()=>{
        shouldClose=true;
        this.props.onClose();
    }

    render() {
        return (
            <div className={styles.shadeOverlay} onClick={()=>{this.tryClose();}}>
            <div className={styles.popupMain} style={this.setStyles()} onClick={()=>{shouldClose=false;}}>
                <div className={styles.topBar}><div className={styles.closeWrapper} onClick={()=>this.forceClose()}><MdClose /></div></div>
                {this.props.children}
            </div>
            </div>
        );
    }
}


export default Popup;