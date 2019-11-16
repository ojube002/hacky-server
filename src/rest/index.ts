import { Application } from "express";
import * as Keycloak from "keycloak-connect";

import CharactersServiceImpl from './impl/characters.service';

export default class Api {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    
      new CharactersServiceImpl(app, keycloak);
    
  }
}
