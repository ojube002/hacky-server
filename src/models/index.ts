import * as Bluebird from "bluebird";
import * as Sequelize from "sequelize";
import * as _ from "lodash";
import * as uuid from "uuid4";
import moment = require("moment");

export interface NewsArticleModel {
  id: number,
  title: string,
  contents: string,
  imageUrl: string,
  createdAt: Date,
  updatedAt: Date
}

export interface CharacterModel {
  id: string,
  name: string,
  userId: string,
  statsId: string,
  createdAt: Date,
  updatedAt: Date,
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
      name: { type: Sequelize.STRING(191), allowNull: false },
      userId: { type: Sequelize.UUID, allowNull: false },
      statsId: { type: Sequelize.UUID, allowNull: false },
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

  
  // News Articles
  
  /**
   * Updates new article
   * 
   * @param id news article id
   * @param title title 
   * @param contents contents
   * @param imageUrl image URL
   * @param silentUpdate silent update
   * @returns promise for update
   */
  updateNewsArticle(id: number, title: string, contents: string, imageUrl: string | null, silentUpdate: boolean): PromiseLike<[number, any]> {
    return this.sequelize.models.NewsArticle.update({
      title: title,
      contents: contents,
      imageUrl: imageUrl
    }, {
      where: {
        id: id
      },
      silent: silentUpdate ? silentUpdate : false
    });
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
  createCharacter(name: string, userId: string, statsId: string ): PromiseLike<CharacterModel> {
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
  listCharacters(userId: string,firstResult?: number, maxResults?: number): PromiseLike<CharacterModel[]> {
    return this.sequelize.models.Character.findAll({ 
      where: {userId: userId},
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
    return this.sequelize.models.Character.destroy({ where: {id: id} });
  }

  /**
   * Finds an character
   * 
   * @param id character id
   * @returns promise for character or null if not found
   */
  findCharacterById(id: string): PromiseLike<CharacterModel | null> {
    return this.sequelize.models.Character.findOne({ where: { id : id } });
  }
 
}

const instance = new Models();

export function initializeModels(sequelize: Sequelize.Sequelize) {
  instance.init(sequelize);
}

export default instance;