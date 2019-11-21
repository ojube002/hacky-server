import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";

export default abstract class FullCharacterService extends AbstractService {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();

    app.get(`/api${this.toPath('/characterlist')}`, [ keycloak.protect(), this.middlewareHandler.bind(this) ], this.catchAsync(this.listCharacters.bind(this)));
  }


  /**
   * Lists Characters
   * @summary Lists characters
   * Accepted parameters:
  */
  public abstract listCharacters(req: Request, res: Response): Promise<void>;

}