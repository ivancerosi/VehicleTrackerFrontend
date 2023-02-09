import { NO_POPUP, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP, TOGGLE_FILTER_POPUP, REFRESH_VEHICLES, SET_REFRESH_METHOD, EXPAND_SIDEBAR, SET_IS_MOBILE, SET_SHOWING_TRIP, SET_ROUTE } from "../actionTypes";


const initialState = {
    isMobile: false,
    showingPopup:NO_POPUP,
    showingFilterPopup:false,
    vehicleRefresh:()=>{},
    sidebarExpanded:false,
    showingTrip:false,
    route:[]
};

export default function(state=initialState, action) {
    if (action.type==TOGGLE_FILTER_POPUP) return {...state, showingFilterPopup:!state.showingFilterPopup}
    if ([NO_POPUP, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP].includes(action.type)) {
        return {...state,showingPopup:action.type};
    }
    if (action.type==SET_REFRESH_METHOD) return {...state, vehicleRefresh:action.payload}
    if (action.type==EXPAND_SIDEBAR) return {...state, sidebarExpanded: action.payload};
    if (action.type==SET_IS_MOBILE) return {...state, isMobile: action.payload};
    if (action.type==SET_SHOWING_TRIP) return {...state, showingTrip:action.payload};

    if (action.type==SET_ROUTE) return {...state, route: action.payload}
    return state;
}