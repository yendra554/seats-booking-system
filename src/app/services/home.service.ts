import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
type SEAT_ROW = {
  row: number;
  booked: number;
  max: number;
  start: number;
  booked_seats: number[];
};

type DATASTORE = {
  seatChart: SEAT_ROW[];
  total: number;
  booked: number;
  rem: number;
};

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor() {}

  private dataStore: DATASTORE = {
    seatChart: [
      { row: 1, booked: 0, max: 7, start: 1, booked_seats: [2,3,4,5,6,7] },
      { row: 2, booked: 0, max: 7, start: 8, booked_seats: [] },
      { row: 3, booked: 0, max: 7, start: 15, booked_seats: [] },
      { row: 4, booked: 0, max: 7, start: 22, booked_seats: [] },
      { row: 5, booked: 0, max: 7, start: 29, booked_seats: [] },
      { row: 6, booked: 0, max: 7, start: 36, booked_seats: [] },
      { row: 7, booked: 0, max: 7, start: 43, booked_seats: [] },
      { row: 8, booked: 0, max: 7, start: 50, booked_seats: [] },
      { row: 9, booked: 0, max: 7, start: 57, booked_seats: [] },
      { row: 10, booked: 0, max: 7, start: 64, booked_seats: [] },
      { row: 11, booked: 0, max: 7, start: 71, booked_seats: [] },
      { row: 12, booked: 0, max: 3, start: 78, booked_seats: [] },
    ],
    total: 80,
    booked: 6,
    rem: 74,
  };
  private _data = new BehaviorSubject<DATASTORE>(this.dataStore);

  get data() {
    return this._data.asObservable();
  }

  bookSeats(seatsToBook: number) {
    let rem = seatsToBook;
    let bookedSeats = [];

    main: for (let row of this.dataStore.seatChart) {
      console.log(row.booked)
      if (rem === 0) break main;
      let priority : boolean =this.dataStore.seatChart.some(
        ele => ele.booked == 0
      );
      if(priority && row.booked > 0) continue main;
      const rowBookings = Math.min(row.max - row.booked, rem);
      rem -= rowBookings;
      row.booked += rowBookings;
      console.log(rowBookings);
      console.log('scope is ' + rem);
      const bs = row.booked_seats;
      let count = 0;
      inner: for (let i = row.start; i <= row.start + row.max; i++) {
        if (count === rowBookings) break inner;
        const alreadyBooked = bs.some((n) => n === i);
        if (!alreadyBooked) {
          count++;
          bs.push(i);
          bookedSeats.push(i);
        }
      }
    }
    this.dataStore.booked += seatsToBook;
    this.dataStore.rem -= seatsToBook;
    return [bookedSeats, this.dataStore.rem];
  }
}
