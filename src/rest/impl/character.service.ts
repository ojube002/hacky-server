import { Response, Request } from "express";
import CharacterService from "../api/character.service";
import { Character } from "../model/models";
import models, { CharacterModel } from "../../models";

/**
 * Implementation for Characters REST service
 */
export default class CharacterServiceImpl extends CharacterService {

  /**
   * @inheritdoc
   */
  public async createCharacter(req: Request, res: Response): Promise<void> {

    const body: Character  = req.body;

    if (!body.name) {
      this.sendNotFound(res, "name not found");
      return;
    }

    if (!body.userId) {
      this.sendNotFound(res, "user id not found");
      return;
    }

    if (!body.statsId) {
      this.sendNotFound(res, "stats id not found");
      return;
    }

    const databaseCharacter = await models.createCharacter(body.name, body.userId, body.statsId);


    res.status(200).send(await this.translateDatabaseCharacter(databaseCharacter));

  }
  
  /**
   * @inheritdoc
   */
  public async listCharacters(req: Request, res: Response): Promise<void> {
    const userId: string  = req.params.userId;

    if (!userId) {
      this.sendNotFound(res, "userId not found");
      return;
    }

    const characters = await models.listCharacters(userId);

    if (!characters) {
      this.sendNotFound(res, "Characters not found");
      return;
    }

    res.status(200).send(characters.map((character) => this.translateDatabaseCharacter(character)));
  }

  /**
   * @inheritdoc
   */
  public async findCharacter(req: Request, res: Response): Promise<void> {
    const characterId: string  = req.params.characterId;

    if (!characterId) {
      this.sendNotFound(res, "characterId not found");
      return;
    }

    const character = await models.findCharacterById(characterId);
    
    if (!character) {
      this.sendNotFound(res, "character not found");
      return;
    }

    res.status(200).send(this.translateDatabaseCharacter(character));

  }

  /**
   * @inheritdoc
   */
  public async deleteCharacter(req: Request, res: Response): Promise<void> {
    const characterId: any  = req.params.characterId;
    const response = await models.deleteCharacter(characterId);
    if(response)
      res.status(200).send("deleted character successfully");
    else
      res.send("did not find character to delete");
  }

  /**
   * Translates Character from database model into REST model
   * 
   * @param CharacterModel database model
   * @returns REST model
   */
  private translateDatabaseCharacter(characterModel: CharacterModel): Character{
    return {
      id: characterModel.id,
      name: characterModel.name,
      userId: characterModel.userId,
      statsId: characterModel.statsId,
      createdAt: this.truncateTime(characterModel.createdAt),
      updatedAt: this.truncateTime(characterModel.updatedAt)
    };
  }

}