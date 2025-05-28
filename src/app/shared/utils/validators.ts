import { AbstractControl, FormArray, FormControl, FormGroup } from "@angular/forms";

export function isInvalid(formControl: FormControl): boolean {
    return formControl.invalid && formControl.touched;
}

export function scrollToInvalidField(formGroup: FormGroup | FormArray) {
    const firstInvalidControlName = findFirstInvalidControl(formGroup);

    if (!firstInvalidControlName) return;

    const el = document.querySelector(
        `[formControlName="${firstInvalidControlName}"], 
       [formGroupName="${firstInvalidControlName}"],
       [formArrayName="${firstInvalidControlName}"]`
    );

    if (el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
        });

        setTimeout(() => {
            (el as HTMLElement).focus();
        }, 500);
    }
}

function findFirstInvalidControl(control: AbstractControl): string | null {
    if (control instanceof FormGroup || control instanceof FormArray) {
        for (const key of Object.keys(control.controls)) {
            const child = control.get(key);

            if (child) {
                if (child.invalid && child.touched) {
                    if (child instanceof FormControl) {
                        return key;
                    }

                    const deeper = findFirstInvalidControl(child);
                    return deeper ?? key;
                } else if (child instanceof FormGroup || child instanceof FormArray) {
                    const deeper = findFirstInvalidControl(child);
                    if (deeper) return deeper;
                }
            }
        }
    }
    return null;
}
