import { CLEAR_TIMEOUT, SET_TIMEOUT } from "../actionTypes";

const initialState = {
    timeoutStore:{}
};

export default function(state=initialState, action) {
    switch (action.type) {
        case SET_TIMEOUT: {
            if (action.payload.queueName==null) action.payload.queueName=action.payload.method.name;
            if (!action.payload.queueName) throw new Error("Please specify queue name or provide named function to the timeoutWrapper!");
            clearTimeout(state.timeoutStore[action.payload.queueName]);
            state.timeoutStore[action.payload.queueName]=setTimeout(action.payload.method, action.payload.timeout);
            return state;
        }
        case CLEAR_TIMEOUT: {
            if (action.payload.queueName==null) action.payload.queueName=action.payload.method.name;
            if (!action.payload.queueName) throw new Error("Please specify queue name or provide named function to the timeoutWrapper!");
            clearTimeout(state.timeoutStore[action.payload.queueName]);
            return state;
        }
        default:
            return state;
    }
}