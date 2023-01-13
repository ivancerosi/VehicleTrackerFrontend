import React from "react";
import styles from "./DataRow.module.css";

export default class DataRow extends React.Component {
    constructor(props) {
        super(props);
        this.state={value:null};
    }
    onChangeHandler=(e)=>{
        this.setState({value:e.target.value});
        if (this.props.onChange) this.props.onChange(e);
    }

    renderInput = () => {
        switch (this.props.type) {
            case 'select':
                return (<div className={styles.value}><select ref={this.props.inputRef} name={this.props.name}
                 value={this.props.value} defaultValue={this.props.defaultValue} onChange={this.onChangeHandler}> 
                    {this.props.options.map(option=>(<option name={option.label}>{option.value}</option>))}
                </select></div>);
            case 'text':
            default:
                return (<input type="text" ref={this.props.inputRef} className={styles.value} value={this.props.value}
                 defaultValue={this.props.defaultValue} onChange={this.onChangeHandler} />);

        }
    }

    render() { return(
        <div className={styles.dataRow} style={this.props.style}>
            <div className={styles.label}>{this.props.label}</div>
            {this.renderInput()}
            
        </div>);
    }
}