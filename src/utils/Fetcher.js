const SERVER="https://smartino-2023.azurewebsites.net/";
const GET_ALL_VEHICLES_ENDPOINT="vehicles";
const EDIT_VEHICLE_ENDPOINT="vehicles/";
const MOVEMENT_HISTORY_ENDPOINT="timeseries/history/";
const SETTINGS_ENDPOINT="settings/";
const EMAIL_ENDPOINT="emails/";
const TRIPS_ENDPOINT="trips/";


export const getAllVehiclesMock=(cb_success, cb_fail)=>{
    const vehicles=[
        {name:"Vehicle1",location:"-22+25", registration:"none", type:"truck", direction:"NW", speed:"50", temperature:"23.1", driver:"Driver1"},
        {name:"Vehicle2",location:"-21+25", registration:"none", type:"tractor", direction:"SW", speed:"64.3", temperature:"30.1",driver:"Driver2"},
        {name:"Vehicle3",location:"-22+26", registration:"none", type:"car", direction:"E", speed:"23.52", temperature:"19.2",driver:"Driver3"}
    ];

    
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
            cb_success(returnVehs);
        },1000);
    
};

export const getAllVehicles = (cb_success,cb_fail) => {
    fetch(SERVER+GET_ALL_VEHICLES_ENDPOINT).then(resp=>{
        if (resp.ok) {
            resp.json().then(json=>cb_success(json));
        } else resp.text().then(txt=>cb_fail(txt));
    });
};

export const submitVehicleEdit=(vehicle)=>{
    return fetch(SERVER+EDIT_VEHICLE_ENDPOINT+vehicle.id,{
        method:'PUT',
        body: JSON.stringify({
            "label":vehicle.name,
            "registration":vehicle.registration,
            "type":vehicle.type
        }),
        headers:{
            'Content-Type':'application/json'
        }
    });
};

export const getValidVehicleTypes=()=>{
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve(["car", "truck", "tractor"]);
        },200);
    });
}

export const getRoute=(id,start,end,resolution)=>{
    return fetch(`${SERVER+MOVEMENT_HISTORY_ENDPOINT+id}?from=${start}&to=${end}&resolution=${resolution}`);
}



export const getSettings=()=>{
    return fetch(`${SERVER}${SETTINGS_ENDPOINT}`);
}


export const postSettings=(speed, temperature)=>{
    return fetch(`${SERVER+SETTINGS_ENDPOINT}?speed=${speed}&temperature=${temperature}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'}
    });
}

export const updateSettings=(id,speed,temperature)=>{
    return fetch(`${SERVER+SETTINGS_ENDPOINT}${id}?speed=${speed}&temperature=${temperature}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'}
    });
}   

export const updateSettingsAll=(speed,temperature)=>{
    return fetch(`${SERVER+SETTINGS_ENDPOINT}?speed=${speed}&temperature=${temperature}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'}
    });
}

export const getEmails=()=>{
    return fetch(`${SERVER+EMAIL_ENDPOINT}`);
}

export const postEmail=(firstName, lastName, email)=>{
    return fetch(`${SERVER+EMAIL_ENDPOINT}?firstName=${firstName}&lastName=${lastName}&email=${email}`,{
        method:'POST',
        headers:{'Content-Type':'application/json'}
    });
}

export const updateEmail=(id, firstName, lastName, email)=>{
    return fetch(`${SERVER+EMAIL_ENDPOINT}${id}?firstName=${firstName}&lastName=${lastName}&email=${email}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'}
    });
}

export const deleteEmail=(id)=>{
    return fetch(`${SERVER+EMAIL_ENDPOINT}${id}`,{
        method:'DELETE',
        headers:{'Content-Type':'application/json'}
    });
}

export const getTrips=(id)=>{
}

export const getTripsOld=(id)=>{
    return fetch(`${SERVER+TRIPS_ENDPOINT}`);
}