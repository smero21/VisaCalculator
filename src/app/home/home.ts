import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  diffInDays: number = 0;
  lastDayStay: Date = new Date();
  reEnter90Days: String = '';
  isActive: boolean = false;
  dates: Array<{ initialDate: Date | null, finalDate: Date | null }> = [
    { initialDate: null, finalDate: null }
  ];

  constructor() {
  }

  calculateDates() {
    for (let date in this.dates) {
      if (!this.dates[date].initialDate || !this.dates[date].finalDate) {
        alert('Por favor, ingrese ambas fechas.');
        return;
      }
    }

    try {
      const result = this.calculateStayDays(this.dates);
      this.diffInDays = result.diffInDays;
      this.isActive = true;
      this.lastDayStay = result.lastDayStay;
      this.reEnter90Days = result.reEnter90Days;
    } catch (error: any) {
      alert(error.message);
    }
  }


  private calculateStayDays(dates: any[]) {
    let finalDay: string = dates[dates.length - 1].finalDate;
    let finalDayMlSec = Date.parse(finalDay);
    let minCountableDay = finalDayMlSec - (180 * 24 * 60 * 60 * 1000);
    let sumDates = 0;
    let initialCountableDate: number = 0;
    console.log('Final: ', finalDay, ' Min countable: ', minCountableDay);

    for (let date in this.dates) {
      let final = new Date(!this.dates[date].finalDate ? new Date() : this.dates[date].finalDate);
      let initial = new Date(!this.dates[date].initialDate ? new Date() : this.dates[date].initialDate);
      if (initial.getTime() < minCountableDay && final.getTime() < minCountableDay) {
        continue;
      } else if (initial.getTime() < minCountableDay) {
        initialCountableDate = minCountableDay;
      } else {
        initialCountableDate = initial.getTime();
      }
      // + 1 because the final date also counts in the countable days inside the schenguen zone
      const diffInTime = final.getTime() + (1000 * 60 * 60 * 24) - initialCountableDate;
      sumDates += diffInTime;
    }

    const diffInDays = sumDates / (1000 * 60 * 60 * 24);
    if (this.diffInDays > 90) {
      throw new Error('La diferencia entre las fechas es mayor a 90 días.');
    }
    const lastDayStay = new Date(
      finalDayMlSec + ((89 * 24 * 60 * 60 * 1000) - sumDates)
    );
    const reEnter90Days: String = new Date(
      finalDayMlSec + (1000 * 60 * 60 * 24 * 180)
    ).toLocaleDateString();
    return { diffInDays, lastDayStay, reEnter90Days };
  }

  addDateRange() {
    this.dates.push({ initialDate: null, finalDate: null });
    console.log(this.dates);
  }
  removeStay(index: number) {
    this.dates.splice(index, 1);
  }
  resetForm() {
    this.diffInDays = 0;
    this.isActive = false;
    this.dates.splice(1, this.dates.length);
    this.dates[0].initialDate = null;
    this.dates[0].finalDate = null;
  }
}
