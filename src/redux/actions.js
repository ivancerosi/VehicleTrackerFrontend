import { FOCUS_VEHICLE, SET_VEHICLES, UNFOCUS_VEHICLE, RECENTER_MAP_FINISH, RECENTER_MAP, SET_TIMEOUT, CLEAR_TIMEOUT, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP, NO_POPUP, TOGGLE_FILTER_POPUP } from "./actionTypes";

export const setVehiclesToRender = vehicles => ({
    type:SET_VEHICLES,
    payload:vehicles
});


export const focusVehicle = vehicle => ({
    type:FOCUS_VEHICLE,
    payload: vehicle
});

export const unfocusVehicle=vehicle=>({
    type:UNFOCUS_VEHICLE
});

export const recenterMap=()=>({type:RECENTER_MAP});
export const recenterMapFinish=()=>({type:RECENTER_MAP_FINISH});

export const queueMethod=(method, timeout=100, queueName=null)=>({
    type:SET_TIMEOUT,
    payload: {method, timeout, queueName}
});

export const clearQueue = (method, queueName=null)=>({
    type:CLEAR_TIMEOUT,
    payload: {method, queueName}
});


export const showPopup = (popup) => ({type:popup});

export const showEdit = () => showPopup(EDIT_POPUP);
export const showRoute= () => showPopup(ROUTE_POPUP);
export const showTrips= () => showPopup(TRIPS_POPUP);
export const clearPopup=() => showPopup(NO_POPUP);


export const toggleFilterPopup = () => ({type:TOGGLE_FILTER_POPUP});