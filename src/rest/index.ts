import { Application } from "express";
import * as Keycloak from "keycloak-connect";

import CharacterServiceImpl from './impl/character.service';
import FullCharacterServiceImpl from './impl/fullCharacter.service';
import StatServiceImpl from './impl/stat.service';
import UserServiceImpl from './impl/user.service';

export default class Api {

  /**
   * Constructor
   * 
   * @param app Express app
   * @param keycloak Keycloak
   */
  constructor(app: Application, keycloak: Keycloak) {
    
      new CharacterServiceImpl(app, keycloak);
    
      new FullCharacterServiceImpl(app, keycloak);
    
      new StatServiceImpl(app, keycloak);
    
      new UserServiceImpl(app, keycloak);
    
  }
}
