import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.config.js";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
export const login = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Firebase token is required",
      });
    }

    const auth = getAuth(app);

    // Verify Firebase ID token
    const decoded = await auth.verifyIdToken(token);

    // Fetch actual Firebase user profile
    const firebaseUser = await auth.getUser(decoded.uid);

    let user = await User.findOne({
      firebaseUID: decoded.uid,
    });

    // Create user if not already registered
    if (!user) {
      user = await User.create({
        firebaseUID: decoded.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
      });
    }
    const sessionId = crypto.randomUUID();

    await redis.set(
      `sessionId-${sessionId}`,
      JSON.stringify({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      }),
      "EX",
      7 * 24 * 60 * 60,
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(401).json({
      error: "Authentication failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = req.cookies?.sessionId;
  

    
    if (!sessionId) {
      return res.status(400).json({
        ssuccess:false,
        message: "Session ID not found in cookies",
      });
    }
    await redis.del(`sessionId-${sessionId}`);
    res.clearCookie("sessionId");
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      successs:false,
      message:error
    });
  }
};



