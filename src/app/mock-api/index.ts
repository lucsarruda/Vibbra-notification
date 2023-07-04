
import { ChatMockApi } from 'app/mock-api/apps/chat/api';
import { AuthMockApi } from 'app/mock-api/common/auth/api';
import { MessagesMockApi } from 'app/mock-api/common/messages/api';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NotificationsMockApi } from 'app/mock-api/common/notifications/api';
import { ShortcutsMockApi } from 'app/mock-api/common/shortcuts/api';
import { UserMockApi } from 'app/mock-api/common/user/api';
import { AppsMockApi } from './common/apps/api';
import { ChannelsMockApi } from './common/channels/api';


export const mockApiServices = [
    ShortcutsMockApi,
    ChatMockApi,
    AuthMockApi,
    MessagesMockApi,
    NavigationMockApi,
    NotificationsMockApi,
    UserMockApi,
    AppsMockApi,
    ChannelsMockApi
];
