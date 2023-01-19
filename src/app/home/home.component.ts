import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { HomeService } from '../services/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private _fb: FormBuilder, private service: HomeService) { }

  bookingsForm!: FormGroup;
  public data$!: Observable<any>;
  public sevenSeater = [1, 2, 3, 4, 5, 6, 7];
  public threeSeater = [1, 2, 3];
  public message = "";
  total: number = 0;
  booked: number = 0;
  rem: any;
  seats: any;

  bookings = [];

  ngOnInit(): void {
    this.createForm();
    this.data$ = this.service.data.pipe(tap(d => (this.rem = d.rem)));
  }

  createForm() {
    this.bookingsForm = this._fb.group({
      seatsToBook: ["", Validators.required]
    });
  }

  getSeatNum(n: number, row: number): number {
    return (row - 1) * 7 + n;
  }

  checkBook(n: number, row: number, bs: number[]): boolean {

    const seat = this.getSeatNum(n, row);
    console.log(seat);
    return bs.some(bs => bs === seat);
  }

  book() {
    if (!this.bookingsForm.valid) return;
    let { seatsToBook } = this.bookingsForm.value;
    if (seatsToBook > 7) {
      this.message = "Max 7 seats at a time";
      this.hideMessage();
      return;
    }
    if (seatsToBook <= 0) {
      this.message = "Min of 1 seat required";
      this.hideMessage();
      return;
    }
    if (this.rem < seatsToBook) {
      this.message = `Only ${this.rem} seats available, reduce num of seats`;
      this.hideMessage();
      return;
    }

    const [bookedSeats, rem] = this.service.bookSeats(seatsToBook);
    this.rem = rem;
    //  this.bookings.unshift({
    //   time: Date.now(),
    //   seats: bookedSeats
    // });
  }

  hideMessage(t = 1500) {
    setTimeout(() => (this.message = ""), t);
  }

}
