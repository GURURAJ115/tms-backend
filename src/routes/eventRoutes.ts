import express from "express";
import { getEventDetails, getEvents } from "../controllers/eventController";

const router = express.Router();

router.get("/",getEvents);
router.get("/:id",getEventDetails);

export default router;