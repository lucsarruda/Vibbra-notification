import { Injectable, inject } from '@angular/core';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { MessagesService } from 'app/layout/common/messages/messages.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { QuickChatService } from 'app/layout/common/quick-chat/quick-chat.service';
import { ShortcutsService } from 'app/layout/common/shortcuts/shortcuts.service';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from './core/services/user.service';
import { AuthService } from './core/auth/auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { User } from './core/types/user.types';

export const initialDataResolver = () =>
{
    const messagesService = inject(MessagesService);
    const navigationService = inject(NavigationService);
    const notificationsService = inject(NotificationsService);
    const quickChatService = inject(QuickChatService);
    const shortcutsService = inject(ShortcutsService);

    // Fork join multiple API endpoint calls to wait all of them to finish
    return forkJoin([
        navigationService.get(),
        messagesService.getAll(),
        notificationsService.getAll(),
        quickChatService.getChats(),
        shortcutsService.getAll(),
    ]);
};


@Injectable({
    providedIn: 'root'
})
export class UserLoggedResolver 
{
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _authService: AuthService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User>
    {
        if (!this._authService.check)
            return null;

        return this._userService.user$;
    }
}
