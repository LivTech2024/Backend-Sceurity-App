import { Request, Response, Router } from "express";
import admin from "../../../firebaseAdmin";

const authUserRouter = Router();

authUserRouter.post("/", async (req: Request, res: Response) => {
  const { email, password, user_id, role } = req.body;

  try {
    // Validate email, password, userId, and roles
    if (!email || !password || !user_id || !role) {
      return res
        .status(400)
        .send("Email, password, userId, and roles are required");
    }

    // Create the user
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      uid: user_id, // Set the user ID
    });

    // Add custom claims (roles) to the user
    await admin.auth().setCustomUserClaims(user_id, { role });

    // Return the user ID
    res.status(201).json({ user_id: userRecord.uid });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Internal server error");
  }
});

authUserRouter.put("/", async (req, res) => {
  const { email, user_id } = req.body;

  try {
    // Validate email
    if (!email) {
      return res.status(400).send("Email is required for update");
    }

    // Update the user's email
    await admin.auth().updateUser(user_id, {
      email: email,
    });

    res.status(200).send("User email updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("Internal server error");
  }
});

authUserRouter.delete("/:user_id", async (req: Request, res: Response) => {
  const { user_id } = req.params;

  try {
    await admin.auth().deleteUser(user_id);
    res.status(200).send("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).send("Internal server error");
  }
});

export default authUserRouter;
