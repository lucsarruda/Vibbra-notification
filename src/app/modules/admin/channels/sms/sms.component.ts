import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone     : true,
  imports: [JsonPipe, FormsModule, FuseAlertComponent, ReactiveFormsModule, NgIf, NgFor, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatCheckboxModule, MatOptionModule, MatButtonModule, MatSlideToggleModule, MatProgressSpinnerModule],
})
export class SmsComponent {

  Form: FormGroup;
  flashMessage: 'success' | 'error' | null = null;
  user
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _changeDetectorRef: ChangeDetectorRef,
    private _channelsService: ChannelsService,
    private _activatedRoute: ActivatedRoute,
  ) {
    this.Form = this._formBuilder.group({
      active: [true],
      sms_provider_name : [''],
      sms_provider_login : [''],
      sms_provider_password: [''],
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {

    this.user = this._activatedRoute.snapshot.data.user;

    this.Form.disable();

    this._channelsService.get( this.user.id , 'sms').subscribe({
        next: (channel: any) => {
          let data = channel

          let formdata = {
              active    :  data.active ,
              sms_provider_name : data.sms_provider.name,
              sms_provider_login : data.sms_provider.login,
              sms_provider_password: data.sms_provider.password,
          }

          this.Form.patchValue(formdata);
          
          this.Form.enable();
        }
        
    })

  }

  salve() {
    // Disable the form
    this.Form.disable();

    const formvalue = this.Form.value

    const body = {
      active: formvalue.active,
      sms_provider: {
        name: formvalue.sms_provider_name,
        login: formvalue.sms_provider_login,
        password : formvalue.sms_provider_password
      }
    }

    this._channelsService.put(this.user.id, 'sms', body)
      .subscribe(() => {
        this.showFlashMessage('success')
        this.Form.enable();
      },
        () => {
          this.showFlashMessage('error')
          this.Form.enable();
        });

  }


  /**
  * Show flash message
  */
  showFlashMessage(type: 'success' | 'error'): void {
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