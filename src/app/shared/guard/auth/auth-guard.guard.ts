import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ErrorHandlerService } from '../../../services/exceptions/error-handler.service';
import { UserService } from '../../../services/user/user.service';

export const authGuardGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const errorHandlerService = inject(ErrorHandlerService)

  const token = sessionStorage.getItem('tkn_ai_prt');

  if (!token) {
    router.navigate(['/']);
    return false;
  }
  const loggedUser = await userService.getLoggedUser();
  if (loggedUser.success) userService.setLoggedUser(loggedUser.content);
  else {
    errorHandlerService.handleError(loggedUser.error);
    router.navigate(['/']);
    return false;
  }

  return true;
};
