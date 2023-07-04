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
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [JsonPipe, FormsModule, FuseAlertComponent, ReactiveFormsModule, NgIf, NgFor, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatCheckboxModule, MatOptionModule, MatButtonModule, MatSlideToggleModule, MatProgressSpinnerModule],
})
export class EmailComponent {

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
      sever_smtp_name: [''],
      sever_smpt_port: [''],
      sever_user_login: [''],
      sever_user_password: [''],
      sender_name: [''],
      sender_email: [''],
      email_templates: this._formBuilder.array([])
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

    this._channelsService.get( this.user.id , 'email').subscribe({
        next: (channel: any) => {
          let data = channel

           
          let formdata = {
              active    :  data.active ,
              sever_smtp_name: data.sever.smtp_name,
              sever_smpt_port: data.sever.smpt_port,
              sever_user_login: data.sever.user_login,
              sever_user_password: data.sever.user_password,
              sender_name: data.sender.name,
              sender_email: data.sender.email,
              //email_templates: data.email_templates
          }

          this.Form.patchValue(formdata);
          
          data.email_templates.forEach((template) =>
          {
              const templateFormGroup = this._formBuilder.group({
                  name   : [template.name],
                  uri   : [template.uri],
              });
              (this.Form.get('email_templates') as UntypedFormArray).push(templateFormGroup);
          });
          
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
        sever: {
          smtp_name: formvalue.sever_smtp_name ,
          smpt_port: formvalue.sever_smpt_port ,
          user_login: formvalue.sever_user_login,
          user_password:  formvalue.sever_user_password
        },
        sender: {
          name: formvalue.sender_name,
          email: formvalue.sender_email 
        },
        email_templates: formvalue.email_templates
    }

    this._channelsService.put(this.user.id, 'email', body)
      .subscribe(() => {
        this.showFlashMessage('success')
        this.Form.enable();
      },
        () => {
          this.showFlashMessage('error')
          this.Form.enable();
        });

  }

  deleteTemplete(Index: number) {
    this.templates().removeAt(Index);
  }


  templates(): FormArray {
    return this.Form.get('email_templates') as FormArray;
  }

  addTemplates() {
    this.templates().push(this.newTemplate());
  }

  newTemplate(): FormGroup {
    return this._formBuilder.group({
      name: '',
      uri: '',
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
