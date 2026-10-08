import express from "express";
import {createHotel,getHotels,updateHotel,deleteHotel}
from "../controllers/hotelControllers.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getHotels);


router.post("/", upload.single("image"), createHotel);

router.put("/:id", upload.single("image"),updateHotel);

router.delete("/:id",upload.single("image"), deleteHotel);

export default router;