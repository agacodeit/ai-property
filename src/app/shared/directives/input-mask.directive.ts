import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[inputMask]'
})
export class InputMaskDirective implements OnInit {
    @Input('inputMask') mask: string = '';

    private regexMap: { [key: string]: RegExp } = {
        '0': /\d/,          // números
        'A': /[a-zA-Z]/,    // letras
        '*': /[a-zA-Z0-9]/  // alfanumérico
    };

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.el.nativeElement.maxLength = this.mask.length;
    }

    @HostListener('input', ['$event'])
    onInput(event: any): void {
        const rawValue = this.el.nativeElement.value.replace(/\W/g, '');
        let formattedValue = '';
        let rawIndex = 0;

        for (let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            const rawChar = rawValue[rawIndex];

            if (!rawChar) break;

            const matcher = this.regexMap[maskChar];
            if (matcher) {
                if (matcher.test(rawChar)) {
                    formattedValue += rawChar;
                    rawIndex++;
                } else {
                    break;
                }
            } else {
                formattedValue += maskChar;
                if (rawChar === maskChar) rawIndex++; // skip literal if matched
            }
        }

        this.el.nativeElement.value = formattedValue;
    }
}