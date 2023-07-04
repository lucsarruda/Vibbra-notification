export interface User
{
    id: string;
    name: string;
    email: string;
    password? : string;
    company_name?: string;
    phone_number?: string;
    company_address?: string;
    isSingUpGoogle?: boolean;
    avatarSingUpGoogle?: String;
    data_account? : object
}
