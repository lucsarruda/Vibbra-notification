/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'gestao',
        title: 'Gestão de envios',
        type : 'group',
        children : [
            {
                id   : 'dashboards',
                title: 'Dashboards',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/dashboards'
            },
            {
                id   : 'sends',
                title: 'Notificações',
                type : 'basic',
                icon : 'heroicons_outline:bell-alert',
                link : '/notifications'
            }
        ]
    },
    {
        id   : 'configs',
        title: 'Configurações | Setups',
        type : 'group',
        children : [
            {
                id   : 'apps',
                title: 'Aplicativos',
                type : 'basic',
                icon : 'heroicons_outline:squares-plus',
                link : '/apps'
            },
            {
                id   : 'chanels',
                title: 'Canais',
                type : 'basic',
                icon : 'heroicons_outline:signal',
                link : '/channels'
                /*
                children : [
                    {
                        id   : 'chanels.webpush',
                        title: 'Web Push',
                        type : 'basic',
                        icon : 'heroicons_outline:chat-bubble-bottom-center-text',
                        link : '/chanels/webpush'
                    },
                    {
                        id   : 'chanels.email',
                        title: 'E-mail',
                        type : 'basic',
                        icon : 'heroicons_outline:at-symbol',
                        link : '/chanels/email'
                    },
                    {
                        id   : 'chanels.sms',
                        title: 'SMS',
                        type : 'basic',
                        icon : 'heroicons_outline:device-phone-mobile',
                        link : '/chanesl/sms'
                    },
                ]
                */
        
            }

        ]
    },
    
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'apps',
        title: 'Aplicativos',
        type : 'basic',
        icon : 'heroicons_outline:squares-plus',
        link : '/apps'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'apps',
        title: 'Aplicativos',
        type : 'basic',
        icon : 'heroicons_outline:squares-plus',
        link : '/apps'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'apps',
        title: 'Aplicativos',
        type : 'basic',
        icon : 'heroicons_outline:squares-plus',
        link : '/apps'
    }
];
