import { Response, Request } from "express";
import NewsArticlesService from "../api/newsArticles.service";
import { NewsArticle } from "../model/models";
import models, { NewsArticleModel } from "../../models";

/**
 * Implementation for NewsArticles REST service
 */
export default class NewsArticlesServiceImpl extends NewsArticlesService {

  /**
   * @inheritdoc
   */
  public async createNewsArticle(req: Request, res: Response): Promise<void> {


    const body: NewsArticle  = req.body;
    const databaseNewsArticle = await models.createNewsArticle(body.title, body.contents, body.imageUrl);
    res.status(200).send(await this.translateDatabaseNewsArticle(databaseNewsArticle));

  }

  /**
   * @inheritdoc
   */
  public async deleteNewsArticle(req: Request, res: Response): Promise<void> {

    const newsArticleId: any = req.params.newsArticleId;
    if (!newsArticleId) {
      this.sendNotFound(res);
      return;
    }

    const databaseNewsArticle = await models.findNewsArticleById(newsArticleId);
    if (!databaseNewsArticle) {
      this.sendNotFound(res);
      return;
    }

    await models.deleteNewsArticle(databaseNewsArticle.id);

    res.status(204).send();
  }

  /**
   * @inheritdoc
   */
  public async findNewsArticle(req: Request, res: Response): Promise<void> {
    const newsArticleId = req.params.newsArticleId;
    if (!newsArticleId) {
      this.sendNotFound(res);
      return;
    }
    const id : any = newsArticleId;
    
    const databaseNewsArticle = await models.findNewsArticleById(id);
    if (!databaseNewsArticle) {
      this.sendNotFound(res);
      return;
    }
    
    res.status(200).send(await this.translateDatabaseNewsArticle(databaseNewsArticle));
  }
  /**
   * @inheritdoc
   */
  public async listNewsArticles(req: Request, res: Response): Promise<void> {
    const newsArticles = await models.listNewsArticles();
    res.status(200).send(newsArticles.map((newsArticle) => this.translateDatabaseNewsArticle(newsArticle)));
  }

  /**
   * @inheritdoc
   */
  public async updateNewsArticle(req: Request, res: Response): Promise<void> {

    const newsArticleId = req.params.newsArticleId;
    if (!newsArticleId) {
      this.sendNotFound(res);
      return;
    }
    
    const databaseNewsArticle = await models.findNewsArticleById(newsArticleId as any);
    if (!databaseNewsArticle) {
      this.sendNotFound(res);
      return;
    }

    const body: NewsArticle = req.body;
    const imageUrl = body.imageUrl || null;
    models.updateNewsArticle(databaseNewsArticle.id, body.title, body.contents, imageUrl, true);

    res.status(200).send(await this.translateDatabaseNewsArticle(databaseNewsArticle));
  }


  /**
   * Translates NewArticle from database model into REST model
   * 
   * @param newsArticleModel database model
   * @returns REST model
   */
  private translateDatabaseNewsArticle(newsArticleModel: NewsArticleModel): NewsArticle | null {
    if (!newsArticleModel) {
      return null;
    }

    return {
      contents: newsArticleModel.contents,
      createdAt: this.truncateTime(newsArticleModel.createdAt),
      id: newsArticleModel.id,
      imageUrl: newsArticleModel.imageUrl,
      title: newsArticleModel.title,
      updatedAt: this.truncateTime(newsArticleModel.updatedAt)
    };
  }

}