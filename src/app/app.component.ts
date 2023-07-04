import { SocialLoginModule } from '@abacritt/angularx-social-login';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    standalone : true,
    imports    : [RouterOutlet,SocialLoginModule],
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
