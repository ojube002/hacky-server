import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";
import KcAdminClient from 'keycloak-admin';
import { Credentials } from "keycloak-admin/lib/utils/auth";
import { config, KeycloakAdminConfig } from "../../config";

export default abstract class UserService extends AbstractService {

  protected kcAdminClient: KcAdminClient = new KcAdminClient({realmName:"Hacky"});
  private credentials: Credentials = config().admin;
  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();
    
    app.post(`/api${this.toPath('/user')}`, [this.auth.bind(this)], this.catchAsync(this.createUser.bind(this)));
    app.delete(`/api${this.toPath('/user/${encodeURIComponent(String(userId))}')}`, [keycloak.protect(),this.auth.bind(this)], this.catchAsync(this.deleteUser.bind(this)));
    app.get(`/api${this.toPath('/user/${encodeURIComponent(String(userId))}')}`, [keycloak.protect(),this.auth.bind(this)], this.catchAsync(this.findUser.bind(this)));
    app.put(`/api${this.toPath('/user')}`, [keycloak.protect(),this.auth.bind(this)], this.catchAsync(this.updateUser.bind(this)));
  }
  // middleware for authenticating admin client
  private async auth(req:any, res:any, next:any) : Promise<void>{
    try {
      await this.kcAdminClient.auth(this.credentials);
      next();
    } catch (error) {
      console.log(error);
      res.send(error.data);
    }
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