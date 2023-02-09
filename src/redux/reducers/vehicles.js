import { INCREMENT, SET_VEHICLES, FOCUS_VEHICLE, UNFOCUS_VEHICLE, SET_FILTER_ACTIVE, UPDATE_VEHICLE_DATA, SELECT_VEHICLE_POSITION } from "../actionTypes";
const initialState = {
    vehiclesToRender:[],
    vehicleInFocus: {key:null},
    filterActive: false,
    lastUpdate: null,
    selectedPosition: null
};

export default function(state=initialState, action) {
    switch (action.type) {
        case UPDATE_VEHICLE_DATA: {
            return {
                ...state,
                lastUpdate: action.payload
            }
        }
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
        case SELECT_VEHICLE_POSITION: {
            return {
                ...state,
                selectedPosition:action.payload
            }
        }
        default:
            return state;
    }
}