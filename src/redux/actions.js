import { FOCUS_VEHICLE, SET_VEHICLES, UNFOCUS_VEHICLE, RECENTER_MAP_FINISH, RECENTER_MAP,
     SET_TIMEOUT, CLEAR_TIMEOUT, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP, NO_POPUP,
      TOGGLE_FILTER_POPUP, SET_FILTER_ACTIVE, SET_REFRESH_METHOD, EXPAND_SIDEBAR, SET_IS_MOBILE, UPDATE_ALARM_DATA, SET_SHOWING_TRIP, SET_ROUTE, SELECT_VEHICLE_POSITION } from "./actionTypes";

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
export const showTrips= () => showPopup(TRIPS_POPUP);
export const showRoute= () => showPopup(ROUTE_POPUP);
export const clearPopup=() => showPopup(NO_POPUP);


export const toggleFilterPopup = () => ({type:TOGGLE_FILTER_POPUP});

export const setFilterActive = (isActive) => ({type:SET_FILTER_ACTIVE,payload:isActive});

export const setGlobalVehicleRefresh = (cb) => ({type:SET_REFRESH_METHOD, payload:cb});

export const expandSidebar = (bool) => ({type:EXPAND_SIDEBAR, payload: bool});
export const setIsMobile = (bool) => ({type:SET_IS_MOBILE, payload: bool});

export const updateAlarmData = (data) => ({type:UPDATE_ALARM_DATA, payload:data});

export const setShowingTrip = (boolflag) => ({type:SET_SHOWING_TRIP, payload:boolflag});

export const setRoute = (route) => ({type:SET_ROUTE, payload:route});

export const selectVehiclePosition = (position)=>({type:SELECT_VEHICLE_POSITION, payload:position});