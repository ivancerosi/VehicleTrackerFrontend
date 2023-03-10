import { EDIT_POPUP, ROUTE_POPUP, TRIPS_POPUP } from "./actionTypes";

export const getIsSidebarExpanded = store => store.ui.sidebarExpanded;
export const isMobile = store=>store.ui.isMobile;

export const getVehiclesStore = store => store.vehicles;

export const getVehiclesToRender = state => state.vehicles.vehiclesToRender;

export const getFocusedVehicle = state => state.vehicles.vehicleInFocus;

export const isRecenterPending = state => state.map.recenterPending;

export const isVehicleInFocus = state => getFocusedVehicle(state).key!=null;

export const getCurrentPopup = state => state.ui.showingPopup;

export const showingEditPopup = state => state.ui.showingPopup==EDIT_POPUP;
export const showingRoutePopup= state => state.ui.showingPopup==ROUTE_POPUP;
export const showingTripsPopup= state => state.ui.showingPopup==TRIPS_POPUP;

export const showingFilterPopup = state => state.ui.showingFilterPopup;

export const isFilterActive = state => state.vehicles.filterActive;

export const getGlobalVehicleRefresh = state => state.ui.vehicleRefresh;

export const getAlarmData = state => state.alarm;

export const isShowingTrip= state => state.ui.showingTrip;

export const getRoute = state=> state.ui.route;

export const getVehiclePosition=state=>state.vehicles.selectedPosition;