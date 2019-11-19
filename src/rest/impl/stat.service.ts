import { Response, Request } from "express";
import { Stat, HttpError } from "../model/models";
import StatService from "../api/stat.service";
import models, { StatModel } from "../../models";



/**
 * Implementation for Stat REST service
 */
export default class StatServiceImpl extends StatService {



  /**
   * @inheritdoc
   */
  public async createStat(req: Request, res: Response): Promise<void> {

    const body: Stat = req.body;

    if (!body.id) {
      this.sendNotFound(res, "id not found");
      return;
    }

    if (!body.level) {
      this.sendNotFound(res, "level not found");
      return;
    }

    if (!body.experience) {
      this.sendNotFound(res, "experience not found");
      return;
    }

    const databaseStat = await models.createStat(body.id, body.level, body.experience);
    res.status(200).send(await this.translateDatabaseStat(databaseStat));


  }


  /**
   * @inheritdoc
   */
  public async updateStat(req: Request, res: Response): Promise<void> {

    const body: Stat = req.body;

    if (!body.id) {
      this.sendNotFound(res, "level not found");
      return;
    }

    if (!body.level) {
      this.sendNotFound(res, "level not found");
      return;
    }

    if (!body.experience) {
      this.sendNotFound(res, "experience not found");
      return;
    }

    try {
      await models.updateStat(body.id, body.level, body.experience);
      res.status(200).send("successfully updated stat");
    }
    catch (error) {
      res.status(400).send(error);
    }

  }

  /**
   * @inheritdoc
   */
  public async findStat(req: Request, res: Response): Promise<void> {
    const id: string = req.params.characterId;

    const stat = await models.findStatById(id);

    if (!stat) {
      this.sendNotFound(res, "stat not found");
      return;
    }

    res.status(200).send(this.translateDatabaseStat(stat));

  }

  /**
   * @inheritdoc
   */
  public async deleteStat(req: Request, res: Response): Promise<void> {
    const characterId: string = req.params.characterId;

    try {
      await models.deleteStat(characterId);
      res.status(200).send("deleted stat successfully");
    } catch (error) {
      res.status(400).send(error);
    }

  }

  /**
  * Translates Character from database model into REST model
  * 
  * @param StatModel database model
  * @returns REST model
  */
  private translateDatabaseStat(StatModel: StatModel): Stat {
    return {
      id: StatModel.id,
      level: StatModel.level,
      experience: StatModel.experience,
      createdAt: StatModel.createdAt,
      updatedAt: StatModel.updatedAt
    };
  }

}