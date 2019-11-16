const mongoose = require('mongoose')
const Schema = mongoose.Schema
const csv = require('csv-parser')
const fs = require('fs')

//connection to the MongoDB test database
mongoose.connect('mongodb://localhost/RATP', {useNewUrlParser: true, useUnifiedTopology: true})

let db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));

const calendarDateSchema = new Schema({
    service_id : Number,
    date : Date
})

const calendarSchema = new Schema({
    service_id : Number,
    start_date : Date,
    end_date : Date
})

const routesSchema = new Schema({
    route_id : Number,
    route_short_name : String,
    route_long_name : String
})

const tripsSchema = new Schema({
    service_id : Number,
    route_id : Number,
    trip_id : Number
})

const transferSchema = new Schema({
    from_stop_id : Number,
    to_stop_id : Number,
    min_transfer_time : Number
})

const stopsSchema = new Schema({
    stop_id : Number,
    stop_name : String,
    stop_desc : String,
    stop_lon : Number,
    stop_lat : Number
})

const stopTimesSchema = new Schema({
    stop_id : Number,
    trip_id : Number,
    arrival_time : String,
    departure_time : String,
    stop_sequence : Number
})

const CalendarDate = mongoose.model('CalendarDate', calendarDateSchema)
const Calendar = mongoose.model('Calendar', calendarSchema)
const Route = mongoose.model('Route', routesSchema)
const Trip = mongoose.model('Trip', tripsSchema)
const Transfer = mongoose.model('Transfer', transferSchema)
const Stop = mongoose.model('Stop', stopsSchema)
const StopTime = mongoose.model('StopTime', stopTimesSchema)

function parseDates(dateString){
    var date = dateString.split('')
    date.splice(4, 0, '-')
    date.splice(7, 0, '-')
    return date.join('')
}



function importCalendarDates(){
    fs.createReadStream('data/calendar_dates.txt')
    .pipe(csv())
    .on('data', (row) => {
        let calendarDate = new CalendarDate({
            service_id: row.service_id,
            date : new Date(parseDates(row.date))
        })
        calendarDate.save()
    })
    .on('end', () => {
        console.log('CSV file successfully processed1');
    });
}

function importCalendar(){
    fs.createReadStream('data/calendar.txt')
    .pipe(csv())
    .on('data', (row) => {
        let calendar = new Calendar({
            service_id: row.service_id,
            start_date: new Date(parseDates(row.end_date)),
            end_date: new Date(parseDates(row.start_date))
        })
        calendar.save()
    })
    .on('end', () => {
        console.log('CSV file successfully processed2');
    });
}

function importRoutes() {
    fs.createReadStream('data/routes.txt')
    .pipe(csv())
    .on('data', (row) => {
    let route = new Route({
        route_id : row.route_id,
        route_short_name : row.route_short_name,
        route_long_name : row.route_long_name
    })
    route.save()
    })
    .on('end', () => {
    console.log('CSV file successfully processed3');
    });
}

function importTrips() {
    fs.createReadStream('data/trips.txt')
    .pipe(csv())
    .on('data', (row) => {
    let trip = new Trip({
        service_id : row.service_id,
        route_id : row.route_id,
        trip_id : row.trip_id
    })
    trip.save()
    })
    .on('end', () => {
    console.log('CSV file successfully processed4');
    });
}

function importTransfers(){
    fs.createReadStream('data/transfers.txt')
    .pipe(csv())
    .on('data', (row) => {
    let transfer = new Transfer({
        from_stop_id : row.from_stop_id,
        to_stop_id : row.to_stop_id,
        min_transfer_time : row.min_transfer_time
    })
    transfer.save()
    })
    .on('end', () => {
    console.log('CSV file successfully processed5');
    });
}


function importStops() {
    fs.createReadStream('data/stops.txt')
    .pipe(csv())
    .on('data', (row) => {
    let stop = new Stop({
        stop_id: row.stop_id,
        stop_name: row.stop_name,
        stop_desc: row.stop_desc,
        stop_lat: row.stop_lat,
        stop_lon: row.stop_lon
    })
    stop.save()
    })
    .on('end', () => {
    console.log('CSV file successfully processed6');
    });
}

function importStopTimes() {
    fs.createReadStream('data/stops.txt')
    .pipe(csv())
    .on('data', (row) => {
    let stopTime = new StopTime({
        stop_id : row.stop_id,
        trip_id : row.trip_id,
        arrival_time : row.arrival_time,
        departure_time : row.departure_time,
        stop_sequence : row.stop_sequence
    })
    stopTime.save()
    })
    .on('end', () => {
    console.log('CSV file successfully processed7');
    });
}



db.once('open', function() {
    console.log("Connected to DataBase!")
    // importCalendarDates()
    // importCalendar()
    // importRoutes()
    // importTrips()
    // importTransfers()
    // importStops()
    // importStopTimes()
  });