import { Request, Response, Router } from "express";
import admin from "../../firebaseAdmin";

const authUserRouter = Router();

authUserRouter.delete(
  "/auth_user/:user_id",
  async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
      await admin.auth().deleteUser(user_id);
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Internal server error");
    }
  }
);

export default authUserRouter;
