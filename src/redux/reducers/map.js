import { RECENTER_MAP, RECENTER_MAP_FINISH } from "../actionTypes";

const initialState={
    recenterPending:false
};

export default function(state=initialState, action) {
    switch (action.type) {
        case RECENTER_MAP:
            return {
                ...state,
                recenterPending:true
            };
        case RECENTER_MAP_FINISH:
            return {
                ...state,
                recenterPending:false
            }
        default:
            return state;
    }
}