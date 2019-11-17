import { Application } from "express";
import * as Keycloak from "keycloak-connect";

import CharacterServiceImpl from './impl/character.service';

export default class Api {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    
      new CharacterServiceImpl(app, keycloak);
    
  }
}
