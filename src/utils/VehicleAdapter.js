export const VehicleAdapter=(vehicles)=>{
    return vehicles.map(vehicle=>{
        vehicle.lat=Number(vehicle.position.lat);
        vehicle.lng=Number(vehicle.position.long);
        vehicle.key=vehicle.id;
        vehicle.show=true;
        vehicle.filteredOut=false;
        vehicle.name=vehicle.label;
        return vehicle;
    });
};