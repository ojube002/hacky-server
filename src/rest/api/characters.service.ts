import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";

export default abstract class CharactersService extends AbstractService {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();

    app.post(`/api/${this.toPath('/characters')}`, [ keycloak.protect() ], this.catchAsync(this.createCharacter.bind(this)));
    app.get(`/api/${this.toPath('/characters')}`, [ keycloak.protect() ], this.catchAsync(this.listCharacters.bind(this)));
  }


  /**
   * Creates news article
   * @summary Create news article
   * Accepted parameters:
    * - (body) Character body - Payload
  */
  public abstract createCharacter(req: Request, res: Response): Promise<void>;


  /**
   * Lists Characters
   * @summary Lists characters
   * Accepted parameters:
  */
  public abstract listCharacters(req: Request, res: Response): Promise<void>;

}