import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthenticatedUserComponent } from './pages/authenticated-user/authenticated-user.component';
import { ChatComponent } from './pages/authenticated-user/chat/chat.component';

export const routes: Routes = [
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'auth', component: AuthenticatedUserComponent,
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
