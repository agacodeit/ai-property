import {
    Directive,
    HostListener,
    ElementRef,
    Renderer2,
    forwardRef
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor
} from '@angular/forms';

@Directive({
    selector: '[appCurrencyMask]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CurrencyMaskDirective),
            multi: true
        }
    ]
})
export class CurrencyMaskDirective implements ControlValueAccessor {
    private onChange = (_: any) => { };
    private onTouched = () => { };
    private el: HTMLInputElement;

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
        this.el = this.elementRef.nativeElement;
    }

    writeValue(value: any): void {
        const numericValue = this.parseToNumber(String(value));
        const formatted = this.formatToCurrency(numericValue);
        this.renderer.setProperty(this.el, 'value', formatted);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.renderer.setProperty(this.el, 'disabled', isDisabled);
    }

    @HostListener('input', ['$event.target.value'])
    onInput(value: string) {
        const numeric = this.parseToNumber(value);
        this.onChange(numeric);
        this.renderer.setProperty(this.el, 'value', this.formatToCurrency(numeric));
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    private parseToNumber(value: string): number {
        if (!value) return 0;
        const clean = value.replace(/[^\d]/g, '');
        return Number(clean) / 100;
    }

    private formatToCurrency(value: number): string {
        if (isNaN(value)) return '';

        const parts = value.toFixed(2).split('.');
        const integerPart = parts[0];
        const decimalPart = parts[1];

        const withThousands = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return `€ ${withThousands}.${decimalPart}`;
    }
}