import * as Bluebird from "bluebird";
import * as Sequelize from "sequelize";
import * as _ from "lodash";
import * as uuid from "uuid4";
import moment = require("moment");

export interface CharacterModel {
  id: string,
  name: string,
  userId: string,
  statsId: string,
  createdAt: Date,
  updatedAt: Date
}

export interface StatModel {
  statsId: string,
  characterId: string,
  level: number,
  experience: number,
  createdAt: Date,
  updatedAt: Date
}


const PRINT_MODEL_INTERFACES = false;

export class Models {

  private sequelize: Sequelize.Sequelize;


  public init(sequelize: Sequelize.Sequelize) {
    this.sequelize = sequelize;
    this.defineModels();
  }

  /**
   * Defines database models
   */
  private defineModels() {

    this.defineModel("Character", {
      id: { type: Sequelize.UUID, primaryKey: true, allowNull: false },
      name: { type: Sequelize.STRING(191), allowNull: false, unique: true },
      userId: { type: Sequelize.UUID, allowNull: false },
      statsId: { type: Sequelize.UUID, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    this.defineModel("Stat", {
      statsId: { type: Sequelize.BIGINT, autoIncrement: true, primaryKey: true, allowNull: false },
      level: { type: Sequelize.BIGINT, defaultValue: 1, allowNull: false },
      experience: { type: Sequelize.BIGINT, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

  }

  /**
   * Defines new database model.
   * 
   * @param {String} name model name
   * @param {Object} attributes model attributes
   * @param {Object} options model options
   */
  private defineModel(name: string, attributes: any, options?: any): Sequelize.Model<any, any> {
    const result = this.sequelize.define(name, attributes, Object.assign(options || {}, {
      charset: "utf8mb4",
      dialectOptions: {
        collate: "utf8mb4_unicode_ci"
      }
    }));

    if (PRINT_MODEL_INTERFACES) {
      this.printModel(name, attributes);
    }

    return result;
  }

  private printModel(name: string, attributes: any) {
    const properties = Object.keys(attributes).map((attributeName: string) => {
      const attribute = attributes[attributeName];
      const attributeType = "" + attribute.type;
      const optional = attribute.allowNull === true;
      let type = "string";

      if (["TEXT", "LONGTEXT", "LONGBLOB", "CHAR(36) BINARY", "VARCHAR(191)"].indexOf(attributeType) != -1) {
        type = "string";
      } else if (["BIGINT", "INTEGER", "DOUBLE PRECISION"].indexOf(attributeType) != -1) {
        type = "number";
      } else if (["TINYINT(1)"].indexOf(attributeType) != -1) {
        type = "boolean";
      } else if (["DATETIME"].indexOf(attributeType) != -1) {
        type = "Date";
      } else {
        type = '"' + attributeType + '" == UNKNOWN!';
      }

      return `  ${attributeName}${optional ? "?" : ""}: ${type}`;
    });

    properties.push(`  createdAt: Date`);
    properties.push(`  updatedAt: Date`);

    console.log(`export interface ${name}Model {\n${properties.join(",\n")}\n}\n`);
  }

  // Characters

  /**
   * Creates character
   * 
   * @param title title 
   * @param contents contents
   * @param imageUrl image URL
   * @returns promise for news article
   */
  createCharacter(name: string, userId: string, statsId: string): PromiseLike<CharacterModel> {
    return this.sequelize.models.Character.create({
      id: uuid(),
      name: name,
      userId: userId,
      statsId: statsId,
      createdAt: moment(),
      updatedAt: moment(),
    });
  }

  /**
   * Lists characters
   * 
   * @param userId first result
   * @param firstResult first result
   * @param maxResults max results
   * @returns promise for characters
   */
  listCharacters(userId: string, firstResult?: number, maxResults?: number): PromiseLike<CharacterModel[]> {
    return this.sequelize.models.Character.findAll({
      where: { userId: userId },
      offset: firstResult,
      limit: maxResults
    });
  }

  /**
   * Deletes a character
   * 
   * @param id character id
   * @returns promise for delete
   */
  deleteCharacter(id: string): PromiseLike<number> {
    return this.sequelize.models.Character.destroy({ where: { id: id } });
  }

  /**
   * Finds an character
   * 
   * @param id character id
   * @returns promise for character or null if not found
   */
  findCharacterById(id: string): PromiseLike<CharacterModel | null> {
    return this.sequelize.models.Character.findOne({ where: { id: id } });
  }

  // Stats

  /**
   * Creates stat
   * 
   * @param id id
   * @param level level
   * @param experience experience
   * @returns promise for stat
   */
  createStat(id: string, level: number, experience: number): PromiseLike<StatModel> {
    return this.sequelize.models.Stat.create({
      statsId: id,
      level: level,
      experience: experience,
      createdAt: moment(),
      updatedAt: moment(),
    });
  }

  /**
   * Updates stat
   * 
   * @param id stat id
   * @param level level
   * @param experience experience
   * @returns promise for update
   */
  updateStat(id: string, level: number, experience: number): PromiseLike<[number, any]> {
    return this.sequelize.models.Stat.update({
      statsId: id,
      level: level,
      experience: experience
    }, {
      where: {
        id: id
      }
    });
  }


  /**
   * Deletes a stat
   * 
   * @param id stat id
   * @returns promise for delete
   */
  deleteStat(id: string): PromiseLike<number> {
    return this.sequelize.models.Stat.destroy({ where: { statsId: id } });
  }

  /**
   * Finds an stat
   * 
   * @param id stat id
   * @returns promise for stat or null if not found
   */
  findStatById(id: string): PromiseLike<StatModel | null> {
    return this.sequelize.models.Stat.findOne({ where: { statsId: id } });
  }

}

const instance = new Models();

export function initializeModels(sequelize: Sequelize.Sequelize) {
  instance.init(sequelize);
}

export default instance;