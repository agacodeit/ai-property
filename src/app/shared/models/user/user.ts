import { UserTypeEnum } from "../../constants/user";

export class User {
    name: string = '';
    id: string = '';
    userTypeEnum: UserTypeEnum = UserTypeEnum.ADMIN;
}