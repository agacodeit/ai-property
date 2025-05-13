import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
moment.locale('pt-pt');

@Pipe({
    name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

    transform(value: string | Date): string {
        if (!value) return '';

        const today = moment().startOf('day');
        const date = moment(value).startOf('day');

        if (date.isSame(today)) {
            return 'Hoje';
        }

        if (date.isSame(today.clone().subtract(1, 'day'))) {
            return 'Ontem';
        }

        return moment(value).format('DD/MM/YYYY');
    }

}