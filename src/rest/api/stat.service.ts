import { Application, Response, Request } from "express";
import * as Keycloak from "keycloak-connect";
import AbstractService from "../abstract-service";

export default abstract class StatService extends AbstractService {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    super();

    app.post(`/api${this.toPath('/stat')}`, [ keycloak.protect() ], this.catchAsync(this.createStat.bind(this)));
    app.delete(`/api${this.toPath('/stat/${encodeURIComponent(String(characterId))}')}`, [ keycloak.protect() ], this.catchAsync(this.deleteStat.bind(this)));
    app.get(`/api${this.toPath('/stat/${encodeURIComponent(String(characterId))}')}`, [ keycloak.protect() ], this.catchAsync(this.findStat.bind(this)));
    app.put(`/api${this.toPath('/stat')}`, [ keycloak.protect() ], this.catchAsync(this.updateStat.bind(this)));
  }


  /**
   * Creates a new stat
   * @summary Create stat
   * Accepted parameters:
    * - (body) Stat body - Payload
  */
  public abstract createStat(req: Request, res: Response): Promise<void>;


  /**
   * Deletes a stat
   * @summary Deletes a stat
   * Accepted parameters:
    * - (path) number characterId - stat id
  */
  public abstract deleteStat(req: Request, res: Response): Promise<void>;


  /**
   * Finds stat by characterId
   * @summary Find stat
   * Accepted parameters:
    * - (path) string characterId - character id
  */
  public abstract findStat(req: Request, res: Response): Promise<void>;


  /**
   * Updates stat information
   * @summary Updates stat
   * Accepted parameters:
    * - (body) Stat body - Payload
  */
  public abstract updateStat(req: Request, res: Response): Promise<void>;

}