export class GetUsersDto {
    private username: string;
    private first_name: string;
    private last_name: string;
    private title: string;
    
    constructor({username, first_name, last_name, title}) {
        this.username = username;
        this.first_name = first_name;
        this.last_name = last_name;
        this.title = title; 
    }
}