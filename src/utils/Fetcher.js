const SERVER="none";
const PORT="80";

export const getAllVehicles=()=>{
    const vehicles=[
        {name:"Vehicle1",location:"-22+25", registration:"none", type:"truck", direction:"NW", speed:"50", temperature:"23.1", driver:"Driver1"},
        {name:"Vehicle2",location:"-21+25", registration:"none", type:"tractor", direction:"SW", speed:"64.3", temperature:"30.1",driver:"Driver2"},
        {name:"Vehicle3",location:"-22+26", registration:"none", type:"car", direction:"E", speed:"23.52", temperature:"19.2",driver:"Driver3"}
    ];

    return new Promise(resolve=>{
        setTimeout(()=>{
            let vehKey=0;
            const returnVehs=[];

            for (const i in vehicles) {
                const vehicle = vehicles[i];
                vehicle.key=vehKey;
                vehKey++;
                vehicle.show=true;
                vehicle.filteredOut=false;

                const re =/[+-]\d+(?:[.,]\d+)?/g;

                try {
                const coords = [...vehicle.location.matchAll(re)];
                vehicle.lat=Number(coords[0]);
                vehicle.lng=Number(coords[1]);
                } catch(e) {
                    console.log(`Failed to parse location field of the vehicle ${vehicle.name}: ${vehicle.location}`);
                    continue;
                }

                returnVehs.push(vehicle);
            }
            console.log(returnVehs);
            resolve(returnVehs);
        },1000);
    });
};

export const submitVehicleEdit=(data)=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            if (!data) resolve("failure");
            else resolve("success");
        },500);
    });
};

export const getValidVehicleTypes=()=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(["car", "truck", "tractor"]);
        },200);
    });
}