import { Response, Request } from "express";
import UserService from "../api/user.service";
import { User } from "../model/models";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";



/**
 * Implementation for User REST service
 */
export default class UserServiceImpl extends UserService {



  /**
   * @inheritdoc
   */
  public async createUser(req: Request, res: Response): Promise<void> {

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
      const result = await this.kcAdminClient.users.create({ realm: 'Hacky', ...user });
      res.status(200).send("done:"+result.id);
    } catch (error) {
      //console.log(error);
      res.status(400).send(error.response.data);
      
    }

  }


  /**
   * @inheritdoc
   */
  public async updateUser(req: Request, res: Response): Promise<void> {

    const body: any = req.body;

    if (!body.username) {
      this.sendNotFound(res, "username not found");
      return;
    }

    if (!body.password) {
      this.sendNotFound(res, "password id not found");
      return;
    }



    res.status(200).send();

  }

  /**
   * @inheritdoc
   */
  public async findUser(req: Request, res: Response): Promise<void> {
    const characterId: string = req.params.characterId;


    res.status(200).send();

  }

  /**
   * @inheritdoc
   */
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const userId: any = req.params.userId;


    /* 
        if (response)
          res.status(200).send("deleted character successfully");
        else
          res.send("did not find character to delete"); */
  }




}