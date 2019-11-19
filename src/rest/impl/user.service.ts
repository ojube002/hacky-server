import { Response, Request } from "express";
import UserService from "../api/user.service";
import { User, HttpError } from "../model/models";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import KcAdminClient from "keycloak-admin";
import { config } from "../../config"

/**
 * Implementation for User REST service
 */
export default class UserServiceImpl extends UserService {

  private kcAdminClient: KcAdminClient = new KcAdminClient();

  /**
   * @inheritdoc
   */
  public async createUser(req: Request, res: Response): Promise<void> {

    try {
      await this.kcAdminClient.auth(config().admin);
    } catch (error) {
      res.status(400).send(error);
    }

    const body: any = req.body;


    if (!body.username) {
      this.sendNotFound(res, "username not found");
      return;
    }

    if (!body.password) {
      this.sendNotFound(res, "password  not found");
      return;
    }

    const user: UserRepresentation = {
      username: body.username,
      email: "",
      enabled: true,
      credentials: [{ type: "password", value: body.password, temporary: false }]
    }

    try {
      const result = await this.kcAdminClient.users.create({ ...user });

      // res.status(201).send({id: result.id});
      res.status(201).send({ message: "user created succesfully!" });
    } catch (error) {
      const err: HttpError = { code: error.response.status, message: `${error.response.statusText}: ${error.response.data.errorMessage}` };
      res.status(error.response.status).send(err);

    }

  }


  /**
   * @inheritdoc
   */
  public async updateUser(req: Request, res: Response): Promise<void> {

    try {
      await this.kcAdminClient.auth(config().admin);
    } catch (error) {
      res.status(400).send(error);
    }

    const body: any = req.body;

    if (!body.firstName && !body.lastName && !body.email) {
      this.sendBadRequest(res, "invalid request body!");
      return;
    }


    const userId: string = this.getLoggedUserId(req);
    const user: UserRepresentation = {
      email: body.email,
      firstName: body.firstName,
      lastName: body.lastName
    }
    try {
      const result = await this.kcAdminClient.users.update({ id: userId }, user);
      res.status(200).send({ message: "user profile updated succesfully!" });
    } catch (error) {
      const err: HttpError = { code: error.response.status, message: `${error.response.statusText}: ${JSON.stringify(error.response.data)}` };
      res.status(error.response.status).send(err);
    }


  }

  /**
   * @inheritdoc
   */
  public async findUser(req: Request, res: Response): Promise<void> {

    try {
      await this.kcAdminClient.auth(config().admin);
    } catch (error) {
      res.status(400).send(error);
    }

    const characterId: string = req.params.characterId;


    res.status(200).send();

  }

  /**
   * @inheritdoc
   */
  public async deleteUser(req: Request, res: Response): Promise<void> {

    try {
      await this.kcAdminClient.auth(config().admin);
    } catch (error) {
      res.status(400).send(error);
    }

    const userId: any = req.params.userId;


    /* 
        if (response)
          res.status(200).send("deleted character successfully");
        else
          res.send("did not find character to delete"); */
  }




}