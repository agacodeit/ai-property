import { trigger, transition, style, animate } from '@angular/animations';

export const menuAnimation = trigger('menuAnimation', [
    transition(':enter', [
        style({ top: '60px', right: '12px', transform: 'translateY(-20px)', opacity: 0 }),
        animate('120ms ease-in', style({ top: '60px', right: '12px', transform: 'translateY(5px)', opacity: 1 })),
        animate('100ms ease-in', style({ top: '60px', right: '12px', transform: 'translateY(-5px)', opacity: 1 })),
        animate('180ms ease-in', style({ top: '60px', right: '12px', transform: 'translateY(0px)', opacity: 1 }))
    ])
]);

export const submenuItemAnimation = trigger('submenuItemAnimation', [
    transition(':enter', [
        style({ transform: 'translateX(-30px)', opacity: 0 }),
        animate('80ms ease-in', style({ transform: 'translateX(20px)', opacity: 1 })),
        animate('100ms ease-in', style({ transform: 'translateX(-10px)', opacity: 1 })),
        animate('180ms ease-in', style({ transform: 'translateX(0px)', opacity: 1 }))
    ])
]);
