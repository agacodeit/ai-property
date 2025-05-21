import {
    Directive,
    ElementRef,
    HostListener,
    Input,
    OnInit,
    forwardRef
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR,
    ControlValueAccessor,
    NG_VALIDATORS,
    Validator,
    AbstractControl,
    ValidationErrors
} from '@angular/forms';

@Directive({
    selector: '[inputMask]',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputMaskDirective),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => InputMaskDirective),
            multi: true
        }
    ]
})
export class InputMaskDirective implements OnInit, ControlValueAccessor, Validator {
    @Input('inputMask') mask: string = '';

    private regexMap: { [key: string]: RegExp } = {
        '0': /\d/,          // números
        'A': /[a-zA-Z]/,    // letras
        '*': /[a-zA-Z0-9]/  // alfanumérico
    };

    private onChange = (_: any) => { };
    private onTouched = () => { };

    constructor(private el: ElementRef) { }

    ngOnInit(): void {
        this.el.nativeElement.maxLength = this.mask.length;
        this.onInput(null);
    }

    writeValue(value: any): void {
        if (value === null || value === undefined) {
            this.el.nativeElement.value = '';
            return;
        }
        this.el.nativeElement.value = this.applyMask(value);
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.el.nativeElement.disabled = isDisabled;
    }

    @HostListener('input', ['$event'])
    onInput(event: any): void {
        const rawValue = this.el.nativeElement.value.replace(/\W/g, '');
        const formattedValue = this.applyMask(rawValue);

        this.el.nativeElement.value = formattedValue;
        this.onChange(formattedValue);
    }

    @HostListener('blur')
    onBlur() {
        this.onTouched();
    }

    private applyMask(rawValue: string): string {
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
                if (rawChar === maskChar) rawIndex++;
            }
        }

        return formattedValue;
    }

    validate(control: AbstractControl): ValidationErrors | null {
        const value = control.value;

        if (!value) return null;

        if (value.length !== this.mask.length) {
            return { mask: 'Invalid format' };
        }

        for (let i = 0; i < this.mask.length; i++) {
            const maskChar = this.mask[i];
            const valueChar = value[i];

            const matcher = this.regexMap[maskChar];
            if (matcher) {
                if (!matcher.test(valueChar)) {
                    return { mask: 'Invalid format' };
                }
            } else {
                if (valueChar !== maskChar) {
                    return { mask: 'Invalid format' };
                }
            }
        }

        return null;
    }
}