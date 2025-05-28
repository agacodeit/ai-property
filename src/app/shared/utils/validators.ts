import { FormControl } from "@angular/forms";

export function isInvalid(formControl: FormControl): boolean {
    debugger
    return formControl.invalid && formControl.touched;
}