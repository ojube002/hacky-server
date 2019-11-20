import { Response, Request } from "express";
import CharacterService from "../api/character.service";
import { Character } from "../model/models";
import models, { CharacterModel, StatModel } from "../../models";
import * as uuid from "uuid4";

/**
 * Implementation for Characters REST service
 */
export default class CharacterServiceImpl extends CharacterService {

  /**
   * @inheritdoc
   */
  public async createCharacter(req: Request, res: Response): Promise<void> {

    const body: Character = req.body;

    if (!body.name) {
      this.sendNotFound(res, "name not found");
      return;
    }

    if (!body.userId) {
      this.sendNotFound(res, "user id not found");
      return;
    }

    const statsId = uuid();

    if (!statsId) {
      this.sendNotFound(res, "statsId not generated");
      return;
    }

    try {
      const databaseCharacter = await models.createCharacter(body.name, body.userId, statsId);
      const databaseStat = await models.createStat(statsId, 1, 0);
      res.status(200).send(await this.translateFullCharacter(databaseCharacter, databaseStat));
    } catch (error) {
      this.sendBadRequest(res, error);
    }

  }

  /**
   * @inheritdoc
   */
  public async listCharacters(req: Request, res: Response): Promise<void> {
    const userId: string = req.params.userId;

    if (!userId) {
      this.sendNotFound(res, "userId not found");
      return;
    }

    const characterModels = await models.listCharacters(userId);
    const characterPromises = characterModels.map(async (char) => {
      const stat = await models.findStatById(char.statsId);
      return { CharacterModel: char, StatModel: stat };
    });
    const characters = await Promise.all(characterPromises);

    if (!characters) {
      this.sendNotFound(res, "Characters not found");
      return;
    }

    res.status(200).send(characters.map((character) => character.StatModel && this.translateFullCharacter(character.CharacterModel, character.StatModel)));
  }

  /**
   * @inheritdoc
   */
  public async findCharacter(req: Request, res: Response): Promise<void> {
    const characterId: string = req.params.characterId;

    if (!characterId) {
      this.sendNotFound(res, "characterId not found");
      return;
    }

    const character: CharacterModel | null = await models.findCharacterById(characterId);

    if (!character) {
      this.sendNotFound(res, "character not found");
      return;
    }

    const stat = await models.findStatById(character.statsId);

    if (!stat) {
      this.sendNotFound(res, "stat not found");
      return;
    }

    res.status(200).send(this.translateFullCharacter(character, stat));

  }

  /**
   * @inheritdoc
   */
  public async deleteCharacter(req: Request, res: Response): Promise<void> {
    const characterId: any = req.params.characterId;
    const response = await models.deleteCharacter(characterId);
    if (response)
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
  private translateDatabaseCharacter(characterModel: CharacterModel): Character {
    return {
      id: characterModel.id,
      name: characterModel.name,
      userId: characterModel.userId,
      statsId: characterModel.statsId,
      createdAt: this.truncateTime(characterModel.createdAt),
      updatedAt: this.truncateTime(characterModel.updatedAt)
    };
  }

  /**
   * Translates Character from database model into REST model
   * 
   * @param CharacterModel database model
   * @param StatModel database model
   * @returns REST model
   */
  private translateFullCharacter(characterModel: CharacterModel, statModel: StatModel): any {
    return {
      name: characterModel.name,
      level: statModel.level,
      experience: statModel.experience,
      createdAt: characterModel.createdAt
    };
  }

}