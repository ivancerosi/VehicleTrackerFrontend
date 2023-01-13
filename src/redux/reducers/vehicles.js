import { INCREMENT, SET_VEHICLES, FOCUS_VEHICLE, UNFOCUS_VEHICLE } from "../actionTypes";
const initialState = {
    vehiclesToRender:[],
    vehicleInFocus: {key:null}
};

export default function(state=initialState, action) {
    switch (action.type) {
        case FOCUS_VEHICLE: {
            return {
                ...state,
                vehicleInFocus: action.payload
            };
        }
        case UNFOCUS_VEHICLE: {
            return {
                ...state,
                vehicleInFocus: {key:null}
            };
        }
        case SET_VEHICLES: {
            return {
                ...state,
                vehiclesToRender:action.payload
            };
        }
        default:
            return state;
    }
}