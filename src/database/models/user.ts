import { Database } from "../config/dbConfig";
import { UserType } from "../types/types";

export class UserModel {
  public static async createTable() {
    await Database.query(`
      CREATE TABLE IF NOT EXISTS users(
        user_id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        name VARCHAR (255) NOT NULL,
        email VARCHAR (255) NOT NULL,
        password VARCHAR NOT NULL
      );
    `);
  }

  public static async getAllUsers(): Promise<UserType[]> {
    return await Database.query<UserType>(`SELECT * FROM Users;`);
  }

  public static async create(userData: UserType): Promise<UserType> {
    const user: UserType[] = await Database.query<UserType>(
      `
      INSERT INTO users(name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [userData.name, userData.email, userData.password]
    );

    return user[0];
  }

  public static async getUserByEmail(email: string): Promise<UserType> {
    const user: UserType[] = await Database.query<UserType>(
      "SELECT * FROM users WHERE email = $1;",
      [email]
    );

    return user[0];
  }
}
