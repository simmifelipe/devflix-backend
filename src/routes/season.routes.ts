import { getRepository } from "typeorm";
import { json, Router } from "express";
import multer from "multer";

import uploadConfig from "../config/upload";

import CreateFavoriteSeasonService from "../services/CreateFavoriteSeasonService";
import CreateSeasonService from "../services/CreateSeasonService";
import RemoveFavoriteSeasonService from "../services/RemoveFavoriteSeasonService";
import { Season } from "./../models/Season";
import { Favorite } from "./../models/Favorite";
import UpdateThumbnailService from "../services/UpdateThumbnailService";

const seasonRouter = Router();
const upload = multer(uploadConfig);

seasonRouter.delete(
  "/favorite/:userId/:seasonId",
  async (request, response) => {
    try {
      const { userId, seasonId } = request.params;

      const removeFavorite = new RemoveFavoriteSeasonService();

      await removeFavorite.execute({
        user_id: userId,
        season_id: Number(seasonId),
      });

      return response.status(200).send();
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

seasonRouter.post("/favorite", async (request, response) => {
  try {
    const { user_id, season } = request.body;

    const createFavorite = new CreateFavoriteSeasonService();

    const favorite = await createFavorite.execute({
      user_id,
      season,
    });

    return response.json(favorite);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.get("/favorite/:userId", async (request, response) => {
  try {
    const { userId } = request.params;

    const favoriteRepository = getRepository(Favorite);
    const favorites = await favoriteRepository.find({
      where: { user_id: userId },
      relations: ["season"],
    });

    return response.status(200).json(favorites);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.post("/", async (request, response) => {
  try {
    const { name, age, genre, seasonNumber, current_episode } = request.body;

    const createSeason = new CreateSeasonService();

    const season = await createSeason.execute({
      name,
      age,
      genre,
      seasonNumber: seasonNumber,
      current_episode,
    });

    return response.json(season);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.get("/news", async (request, response) => {
  try {
    const seasonRepository = getRepository(Season);
    const seasons = await seasonRepository.find({
      isNew: true,
      watching: false,
    });

    return response.status(200).json(seasons);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.patch(
  "/:seasonId/thumbnail",
  upload.single("thumbnail"),
  async (request, response) => {
    const updateThumbnail = new UpdateThumbnailService();

    const season = await updateThumbnail.execute({
      season_id: Number(request.params.seasonId),
      thumbnailFileName: request.file.filename,
    });

    return response.json(season);
  }
);

export default seasonRouter;
