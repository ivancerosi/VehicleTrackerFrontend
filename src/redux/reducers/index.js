import {combineReducers} from "redux";
import vehicles from "./vehicles";
import map from "./map";
import timeout from "./timeout";
import ui from "./ui";
import alarm from "./alarm";

export default combineReducers({vehicles, map, timeout, ui, alarm});