import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";

export default abstract class UserService extends AbstractService {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();

    app.post(`/api${this.toPath('/user')}`, [ keycloak.protect() ], this.catchAsync(this.createUser.bind(this)));
    app.delete(`/api${this.toPath('/User/${encodeURIComponent(String(userId))}')}`, [ keycloak.protect() ], this.catchAsync(this.deleteUser.bind(this)));
    app.get(`/api${this.toPath('/User/${encodeURIComponent(String(userId))}')}`, [ keycloak.protect() ], this.catchAsync(this.findUser.bind(this)));
    app.put(`/api${this.toPath('/user')}`, [ keycloak.protect() ], this.catchAsync(this.updateUser.bind(this)));
  }


  /**
   * Creates a new user
   * @summary Create user
   * Accepted parameters:
    * - (body) User body - Payload
  */
  public abstract createUser(req: Request, res: Response): Promise<void>;


  /**
   * Deletes a user
   * @summary Deletes a user
   * Accepted parameters:
    * - (path) string userId - user id
  */
  public abstract deleteUser(req: Request, res: Response): Promise<void>;


  /**
   * Finds user by id
   * @summary Find user
   * Accepted parameters:
    * - (path) string userId - user id
  */
  public abstract findUser(req: Request, res: Response): Promise<void>;


  /**
   * Updates users information
   * @summary Updates user
   * Accepted parameters:
    * - (body) User body - Payload
  */
  public abstract updateUser(req: Request, res: Response): Promise<void>;

}