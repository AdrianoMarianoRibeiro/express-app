import { AppBaseEntity } from "../shared/entities";
export declare class User extends AppBaseEntity {
    name: string;
    email: string;
    password: string;
    isActive: boolean;
}
