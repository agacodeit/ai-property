import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthenticatedUserComponent } from './pages/authenticated-user/authenticated-user.component';
import { ChatComponent } from './pages/authenticated-user/chat/chat.component';
import { authGuardGuard } from './shared/guard/auth-guard.guard';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'auth', component: AuthenticatedUserComponent,
        canActivate: [authGuardGuard],
        children: [
            {
                path: 'chat',
                component: ChatComponent
            },
            {
                path: 'chat/:id',
                component: ChatComponent
            }
        ]
    }
];
