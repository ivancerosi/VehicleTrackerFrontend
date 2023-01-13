import { NO_POPUP, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP, TOGGLE_FILTER_POPUP } from "../actionTypes";


const initialState = {
    showingPopup:NO_POPUP,
    showingFilterPopup:false
};

export default function(state=initialState, action) {
    if (action.type==TOGGLE_FILTER_POPUP) return {...state, showingFilterPopup:!state.showingFilterPopup}
    if ([NO_POPUP, EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP].includes(action.type)) {
        return {...state,showingPopup:action.type};
    }
    return state;
}