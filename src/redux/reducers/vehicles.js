import { INCREMENT, SET_VEHICLES, FOCUS_VEHICLE, UNFOCUS_VEHICLE, SET_FILTER_ACTIVE } from "../actionTypes";
const initialState = {
    vehiclesToRender:[],
    vehicleInFocus: {key:null},
    filterActive: false
};

export default function(state=initialState, action) {
    switch (action.type) {
        case SET_FILTER_ACTIVE: {
            return {
                ...state,
                filterActive: action.payload
            };
        }
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