import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  diffInDays: number = 0;
  lastDayStay: Date = new Date();
  reEnter90Days: Date = new Date();
  isActive: boolean = false;

  calculateDates() {
    var initialDate = document.querySelector('.initialDate') as HTMLInputElement;
    var finalDate = document.querySelector('.finalDate') as HTMLInputElement;

    if (!initialDate.value || !finalDate.value) {
      alert('Por favor, ingrese ambas fechas.');
      return;
    }
    var initial: Date = new Date(initialDate.valueAsDate!.getTime());
    var final: Date = new Date(finalDate.valueAsDate!.getTime());
    if (initial > final) {
      alert('La fecha inicial no puede ser mayor que la fecha final.');
      return;
    }
    try {
      const result = this.calculateStayDays(initial, final);
      this.diffInDays = result.diffInDays;
      this.isActive = true;
      this.lastDayStay = result.lastDayStay;
      this.reEnter90Days = result.reEnter90Days;
    } catch (error: any) {
      alert(error.message);
    }
  }

  private calculateStayDays(initial: Date, final: Date) {
    const diffInTime = final.getTime() - initial.getTime();
    const diffInDays = diffInTime / (1000 * 60 * 60 * 24) + 1;
    //console.log('Final: ', final.getTime() / (1000 * 60 * 60 * 24), ' Inicial: ', initial.getTime() / (1000 * 60 * 60 * 24));
    //var diff: Date = new Date(diffInTime);
    //console.log(diff);
    if (this.diffInDays > 90) {
      throw new Error('La diferencia entre las fechas es mayor a 90 días.');
    }
    const lastDayStay = new Date(
      final.getTime() + ((89 * 24 * 60 * 60 * 1000) - diffInTime)
    );
    const reEnter90Days = new Date(
      final.getTime() + (1000 * 60 * 60 * 24 * 179)
    );


    return { diffInDays, lastDayStay, reEnter90Days };
  }
}
