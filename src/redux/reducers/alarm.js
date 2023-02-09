import { UPDATE_ALARM_DATA } from "../actionTypes";

const initialState={
    // ADD zamijeni s fetchanjem adresa i vrijednosti s backenda
    speed:90,
    temperature:40,
    emails:["somemail@mail.com","anotherone@mail.com"]
};

export default function(state=initialState, action) {
    switch (action.type) {
        case UPDATE_ALARM_DATA:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}