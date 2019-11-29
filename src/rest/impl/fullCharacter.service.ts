import { Response, Request } from "express";
import FullCharacterService from "../api/fullCharacter.service";
import { FullCharacter } from "../model/models";
import models, { CharacterModel, StatModel } from "../../models";

/**
 * Implementation for FullCharacters REST service
 */
export default class FullCharacterServiceImpl extends FullCharacterService {


  /**
   * @inheritdoc
   */
  public async listCharacters(req: Request, res: Response): Promise<void> {

    const userId = this.getLoggedUserId(req);

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
   * Translates Character from database model into REST model
   * 
   * @param CharacterModel database model
   * @param StatModel database model
   * @returns REST model
   */
  private translateFullCharacter(characterModel: CharacterModel, statModel: StatModel): FullCharacter {
    return {
      id: characterModel.id,
      name: characterModel.name,
      classType: characterModel.classType,
      userId: characterModel.userId,
      statsId: characterModel.statsId,
      level: statModel.level,
      experience: statModel.experience,
      createdAt: this.truncateTime(characterModel.createdAt),
      updatedAt: this.truncateTime(statModel.updatedAt),
    }
  };
  
}
