import { trigger, transition, style, animate } from '@angular/animations';

export const cardTransaction = trigger('cardTransaction', [
    transition(':enter', [
        style({ transform: 'translateX(-20%)', opacity: 0 }),
        animate('150ms ease-in', style({ transform: 'translateX(10px)', opacity: 1 })),
        animate('100ms ease-in', style({ transform: 'translateX(-5px)', opacity: 1 })),
        animate('100ms ease-in', style({ transform: 'translateX(0px)', opacity: 1 }))
    ]),
    transition(':leave', [
        animate('150ms ease-out', style({ transform: 'translateX(30px)', opacity: 1 })),
        animate('100ms ease-out', style({ transform: 'translateX(50%)', opacity: 0 }))
    ])
]);