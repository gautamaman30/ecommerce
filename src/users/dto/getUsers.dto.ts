export class GetUsersDto {

    private username: string;
    private email: string;
    private first_name: string;
    private last_name: string;
    private avatar: string;

    
    constructor({username, email, first_name, last_name, avatar}) {
        this.username = username;
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.avatar = avatar; 
    }
}
