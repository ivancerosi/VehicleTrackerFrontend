import {combineReducers} from "redux";
import vehicles from "./vehicles";
import map from "./map";
import timeout from "./timeout";
import ui from "./ui";

export default combineReducers({vehicles, map, timeout, ui});