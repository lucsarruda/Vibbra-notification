import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChannelsService } from '../channels.service';
import { ActivatedRoute } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations';
import { NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-webpush',
  templateUrl: './webpush.component.html',
  styleUrls: ['./webpush.component.scss'],
  animations   : fuseAnimations,
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports        : [FormsModule, FuseAlertComponent,ReactiveFormsModule, NgIf, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatCheckboxModule ,MatOptionModule, MatButtonModule , MatSlideToggleModule , MatProgressSpinnerModule],
})
export class WebpushComponent {

  @ViewChild('signInNgForm') NgForm: NgForm;

  Form: UntypedFormGroup;
  flashMessage: 'success' | 'error' | null = null;
  user
  /**
   * Constructor
   */
  constructor(
      private _formBuilder: UntypedFormBuilder,
      private _changeDetectorRef: ChangeDetectorRef,
      private _channelsService  : ChannelsService,
      private _activatedRoute : ActivatedRoute,
  )
  {
    this.Form = this._formBuilder.group({
        active    : [ true ],
        site_name    : [''],
        site_address : [''],
        site_url_icon   : [''],
        allow_notification_message_text  : [''],
        allow_notification_allow_button_text  : ['' ],
        allow_notification_deny_button_text  : [''],
        welcome_notification_message_title  : [''],
        welcome_notification_message_text  : [''],
        welcome_notification_enable_url_redirect  : [''],
        welcome_notification_url_redirect  : [''],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {   
    
    this.user = this._activatedRoute.snapshot.data.user;

    this.Form.disable();

    this._channelsService.get( this.user.id , 'webpush').subscribe({
        next: (channel: any) => {
          let data = channel
           // Create the form
          let formdata = {
              active    :  data.active ,
              site_name    : data.site.name ,
              site_address : data.site.address,
              site_url_icon   : data.site.url_icon,
              allow_notification_message_text  : data.allow_notification.message_text,
              allow_notification_allow_button_text  : data.allow_notification.allow_button_text ,
              allow_notification_deny_button_text  : data.allow_notification.deny_button_text,
              welcome_notification_message_title  : data.welcome_notification.message_title,
              welcome_notification_message_text  : data.welcome_notification.message_text,
              welcome_notification_enable_url_redirect  : data.welcome_notification.enable_url_redirect,
              welcome_notification_url_redirect  : data.welcome_notification.url_redirect,
          }

          this.Form.patchValue(formdata);

          this.Form.enable();
        }
    })

   
  }

  public toggle(event: MatSlideToggleChange) {
    if( !event.checked){
      this.Form.get('welcome_notification_url_redirect').setValue('')
      this.Form.get('welcome_notification_url_redirect').disable()
    }else{
      this.Form.get('welcome_notification_url_redirect').enable()
    }

  }

  salve(){
    // Disable the form
    this.Form.disable();

    const formvalue = this.Form.value

    const body = {
      active: formvalue.active,
      site: {
          name: formvalue.site_name,
          address: formvalue.site_address,
          url_icon: formvalue.site_url_icon
      },
      allow_notification: {
          message_text: formvalue.allow_notification_message_text,
          allow_button_text: formvalue.allow_notification_allow_button_text,
          deny_button_text: formvalue.allow_notification_deny_button_text
      },
      welcome_notification: {
          message_title: formvalue.welcome_notification_message_title,
          message_text: formvalue.welcome_notification_message_text,
          enable_url_redirect: formvalue.welcome_notification_enable_url_redirect,
          url_redirect: formvalue.welcome_notification_url_redirect
      }
  }

    this._channelsService.put( this.user.id , 'webpush' , body )
          .subscribe(() => {
              this.showFlashMessage('success')
              this.Form.enable();
          } , 
            () => {
              this.showFlashMessage('error') 
              this.Form.enable();
          });

  }

    /**
    * Show flash message
    */
    showFlashMessage(type: 'success' | 'error'): void
    {
        // Show the message
        this.flashMessage = type;

        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Hide it after 3 seconds
        setTimeout(() => {
            this.flashMessage = null;

            // Mark for check
            this._changeDetectorRef.markForCheck();
        }, 3000);
    }

}

