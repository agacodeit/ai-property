import { FormControl, FormGroup } from "@angular/forms";

export function isInvalid(formControl: FormControl): boolean {
    return formControl.invalid && formControl.touched;
}

export function scrollToInvalidField(formGroup: FormGroup) {
    const invalidControls = Object.keys(formGroup.controls).filter(key => {
        const control = formGroup.get(key);
        return control && control.invalid && control.touched;
    });

    if (invalidControls.length === 0) return;

    const firstInvalid = invalidControls[0];

    const el = document.querySelector(`[formControlName="${firstInvalid}"]`);

    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
        });
        setTimeout(() => {
            (el as HTMLElement).focus();
        }, 500);
    }
}
