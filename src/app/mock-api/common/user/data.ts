/* eslint-disable */

export var user = [
    {
        id: '108682051231946',
        name: 'Sr. Vibbraneo',
        email: 'vibbraneo@vibbraneo.com.br',
        password: 'vibbrante',
        company_name: 'Vibbraneo',
        phone_number: '(49)9999-99999',
        company_address: 'Rua das borboletas - 177, Joinville / SC',
        data_account: {
            apps: [
                {
                    app_id: '1335cf00-eb13-48f3-8070-2bfae424d354',
                    app_name: 'APP Teste',
                    app_token: 'fb4b6f93-178e-4468-8460-6647c411914e',
                    app_active : true,
                    app_active_channels: {
                        webpush: false,
                        email: true,
                        sms: true,
                    }
                },
                {
                    app_name: 'APP Google',
                    app_active: true,
                    app_active_channels: {
                      webpush: false,
                      email: true,
                      sms: false
                    },
                    app_id: '225d3c14-d7a0-47e8-9e76-dacbe91d8d3a',
                    app_token: 'f604150d-0107-49e8-b343-eb9d6f745a19'
                },
                {
                    app_name: 'APP Send XYZ',
                    app_active: false,
                    app_active_channels: {
                        webpush: false,
                        email: false,
                        sms: true
                    },
                    app_id: '3ff7be9f-0de9-4652-845f-653a96294c1e',
                    app_token: '02aa2701-13a2-4c28-8f95-8972cc466107'
                },
            ],
            channels: {
                webpush: {
                    active: true,
                    site: {
                        name: 'WebPush teste',
                        address: 'www.teste.com.br',
                        url_icon: 'teste'
                    },
                    allow_notification: {
                        message_text: 'Aceitar ser um vibbrante?',
                        allow_button_text: 'Aceitar',
                        deny_button_text: 'Rejeitar'
                    },
                    welcome_notification: {
                        message_title: 'Sejam Bem-Vindo',
                        message_text: 'Aceitar ser um vibbrante?',
                        enable_url_redirect: true,
                        url_redirect: 'www.vibbra.com.br'
                    }
                },
                email: {
                    active: true,
                    sever: {
                        smtp_name: 'Google',
                        smpt_port: '225',
                        user_login: 'admin@vibbraneo.com.br',
                        user_password: '123123131'
                    },
                    sender: {
                        name: 'Sr. Vibbrancio',
                        email: 'admin@vibbraneo.com.br'
                    },
                    email_templates: [
                        {
                            name: 'Template 1',
                            uri: 'http://html1.vibbraneo.com.br'
                        }
                    ]

                },
                sms: {
                    active: true,
                    sms_provider: {
                        name: 'TIM Operadora',
                        login: 'adm@adm.com',
                        password: '123'
                    }
                }
            },
            notifications: [
                {
                    id_app: '225d3c14-d7a0-47e8-9e76-dacbe91d8d3a',
                    app_name : 'APP Google', 
                    id_notification: '4564654',
                    date_notification: new Date(2023, 6, 26),
                    type: 'webpush',
                    data_notification: {
                        audience_segments: ['Jose Firmino' , 'Maria'],
                        message_title: 'Sejam Bem-Vindo',
                        message_text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
                        icon_url: 'https://angular.io/',
                        redirect_url: 'www.vibbra.com.br',
                        received: true,
                        opened: true,
                    }
                },
                {
                    id_app: '3ff7be9f-0de9-4652-845f-653a96294c1e',
                    app_name : 'APP Send XYZ',
                    id_notification: '56756756',
                    date_notification: new Date(2023, 6, 26),
                    type: 'sms',
                    data_notification: {
                        phone_number: [
                            '5549988068267'
                        ],
                        sms_mensagem : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labor"
                    }
                },
                {
                    id_app: '1335cf00-eb13-48f3-8070-2bfae424d354',
                    app_name : 'APP Teste',
                    id_notification: '4346756756756',
                    date_notification: new Date(2023, 6, 26),
                    type: 'email',
                    data_notification: {
                        receiver_email: [
                            'teste@teste.com.br',
                            'joao@joaomaria.com'
                        ],
                        email_template_name : 'Template 1'
                    }
                }
            ]
        }
    }
];
