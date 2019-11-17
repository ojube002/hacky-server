import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";

export default abstract class CharacterService extends AbstractService {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();

    app.post(`/api${this.toPath('/character')}`, [ keycloak.protect() ], this.catchAsync(this.createCharacter.bind(this)));
    app.delete(`/api${this.toPath('/character/${encodeURIComponent(String(characterId))}')}`, [ keycloak.protect() ], this.catchAsync(this.deleteCharacter.bind(this)));
    app.get(`/api${this.toPath('/character/${encodeURIComponent(String(characterId))}')}`, [ keycloak.protect() ], this.catchAsync(this.findCharacter.bind(this)));
    app.get(`/api${this.toPath('/character/list/${encodeURIComponent(String(userId))}')}`, [ keycloak.protect() ], this.catchAsync(this.listCharacters.bind(this)));
  }


  /**
   * Creates character
   * @summary Create character
   * Accepted parameters:
    * - (body) Character body - Payload
  */
  public abstract createCharacter(req: Request, res: Response): Promise<void>;


  /**
   * Deletes a character
   * @summary Deletes a character
   * Accepted parameters:
    * - (path) string characterId - character id
  */
  public abstract deleteCharacter(req: Request, res: Response): Promise<void>;


  /**
   * Finds character by id
   * @summary Find character
   * Accepted parameters:
    * - (path) string characterId - character id
  */
  public abstract findCharacter(req: Request, res: Response): Promise<void>;


  /**
   * Lists Characters
   * @summary Lists characters
   * Accepted parameters:
    * - (path) string userId - user id
  */
  public abstract listCharacters(req: Request, res: Response): Promise<void>;

}