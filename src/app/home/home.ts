import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-home',
  imports: [FormsModule, MatExpansionModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  diffInDays: number = 0;
  lastDayStay: Date = new Date();
  reEnter90Days: String = '';
  isActive: boolean = false;
  dates: Array<{ initialDate: Date | null, finalDate: Date | null }> = [
    { initialDate: null, finalDate: null }
  ];
  readonly panelOpenState = signal(false);
  //
  acordionInfo: Array<{ title: string, content: string }> = [
    { title: '¿Cómo se añaden fechas?', content: 'Para añadir una fecha se debe dar click en el area de fecha, la fecha inicial debe ser menor a la fecha final. El formato de las fechas deben ser dd/mm/aaaa. si se añaden varios rangos de fechas debe empezar con la fecha más antigua para calcular y continuar de manera ordenada con fechas posteriores a la fecha anterior añadida, eso significa que cada fecha que se quiera añadir debe ser una fecha superior a la fecha anterior dado que el sistema no lo permite para evitar errores.' },
    { title: '¿Cómo se introducen las fechas?', content: 'Para introducir una fecha o rangos de fecha se debe mirar la fecha más antigua visitada o la primera fecha futura que desee ingresar en la zona schengen' },
    { title: '¿Qué es un rango de fechas?', content: 'Un rango de fechas es el tiempo, en días, que será calculado. Cada día se suma a la cuenta en un rango de 90 días dentro de 180 días, para más información leer aqui. Puede añadir más de un rango de fechas a calcular si desea planear o si ha salido y entrado a la zona schengen varias veces en cualquier momento. Los rangos de fechas pueden ser futuros, pasados, ambas o con fecha actual dentro del rango, tener en cuenta cómo se calculan las fechas o rangos de fechas.' },
    { title: '¿Cómo se calculan los días en los rangos de fechas?', content: 'para calcular los días que cuentan dentro de la zona schengen, se usa la regla de 90/180 , se toma la última fecha o la fecha final pasada o planificada y se cuentan 180 días para atrás, en este rango de fechas la calculadora mide que el tiempo no sea mayor a 90 días dentro de este rango. Se debe tener en cuenta que el día de entrada y salida cuentan, y que los días anteriores a ese rango de 180 días no cuentan dentro del calculo así que se recomienda hacer la planificación del viaje o estancia antes de entrar para tener un día aproximado de salida menor a la fecha máxima' }
  ];
  acordionFaqs: Array<{ title: string, content: string }> = [
    { title: '¿Qué es la zona Schengen?', content: 'La zona Schengen es un área que comprende 26 países europeos que han abolido los controles fronterizos entre ellos, permitiendo la libre circulación de personas. Esta zona incluye la mayoría de los países de la Unión Europea, así como algunos países no pertenecientes a la UE.' },
    { title: '¿Cuántos días puedo estar en la zona Schengen?', content: 'Los ciudadanos de países no pertenecientes a la zona Schengen pueden permanecer en el área por un máximo de 90 días dentro de un período de 180 días. Esto significa que después de haber pasado 90 días en la zona Schengen, debes salir y no podrás regresar hasta que hayan pasado otros 90 días.' },
    { title: '¿Qué pasa si excedo los 90 días en la zona Schengen?', content: 'Si excedes los 90 días permitidos en la zona Schengen, puedes enfrentar consecuencias como multas, deportación o incluso prohibición de entrada a la zona Schengen en el futuro. Es importante respetar las reglas de estancia para evitar problemas legales.' },
    { title: '¿Puedo extender mi estancia en la zona Schengen?', content: 'En general, no es posible extender tu estancia más allá de los 90 días permitidos sin salir de la zona Schengen. Sin embargo, en casos excepcionales, como emergencias médicas o circunstancias imprevistas, puedes solicitar una extensión a las autoridades competentes del país donde te encuentres.' }
  ];

  constructor() {
  }

  calculateDates() {
    for (let date of this.dates) {
      if (!date.initialDate || !date.finalDate) {
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
    const DAY_IN_MS = 1000 * 60 * 60 * 24;
    const finalDay = new Date(dates[dates.length - 1].finalDate).getTime();
    const minCountableDay = finalDay - (180 * DAY_IN_MS);
    let sumDates = 0;
    let initialCountableDate: number = 0;
    console.log('Final: ', finalDay, ' Min countable: ', minCountableDay);

    for (let date of dates) {
      console.log('Initial: ', date.initialDate, ' Final: ', date.finalDate);
      let final = new Date(date.finalDate);
      let initial = new Date(date.initialDate);
      if (initial.getTime() < minCountableDay && final.getTime() < minCountableDay) {
        continue;
      } else if (initial.getTime() < minCountableDay) {
        initialCountableDate = minCountableDay;
      } else {
        initialCountableDate = initial.getTime();
      }
      const diffInTime = final.getTime() + DAY_IN_MS - initialCountableDate;
      sumDates += diffInTime;
    }

    const diffInDays = sumDates / DAY_IN_MS;
    if (diffInDays > 90) {
      ;
    } else if (diffInDays == 90) {
      ;
    } else {

    }
    const lastDayStay = new Date(
      finalDay + ((90 * DAY_IN_MS) - sumDates)
    );
    const reEnter90Days: String = new Date(
      finalDay + (180 * DAY_IN_MS)
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
  // Logica para la informacion y preguntas frecuentes

}
