import { randomInt } from 'crypto';
import fs from 'fs';
import csv from 'csv-parser'

import { getRepository } from "typeorm";
import { Router } from "express";
import multer from "multer";

import uploadConfig from "../config/upload";

import CreateFavoriteSeasonService from "../services/CreateFavoriteSeasonService";
import CreateSeasonService from "../services/CreateSeasonService";
import RemoveFavoriteSeasonService from "../services/RemoveFavoriteSeasonService";
import { Season } from "./../models/Season";
import { Favorite } from "./../models/Favorite";
import UpdateThumbnailService from "../services/UpdateThumbnailService";
import UpdateImageService from "../services/UpdateImageService";

const seasonRouter = Router();
const upload = multer(uploadConfig);

type CheckFavoriteRequest = {
  userId: string;
  seasonId: string;
}


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

seasonRouter.get("/favorite/check/:userId/:seasonId", async (request, response) => {
  try {
    const { userId, seasonId } = request.params as CheckFavoriteRequest;

    const favoriteRepository = getRepository(Favorite);
    const isFavorite = await favoriteRepository.findOne({
      user_id: userId,
      season: {
        id: Number(seasonId)
      }
    });

    return isFavorite
      ? response.status(200).json(true)
      : response.status(200).json(false);

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
    });

    return response.status(200).json(seasons);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.get("/watching", async (request, response) => {
  try {
    const seasonRepository = getRepository(Season);
    const seasons = await seasonRepository.find({
      watching: true,
    });

    return response.status(200).json(seasons);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

seasonRouter.post("/search", async (request, response) => {
  try {
    const { query } = request.body;

    const result = await getRepository(Season)
      .createQueryBuilder('season')
      .where("lower(season.name) like lower(:name)", { name: `%${query}%` })
      .getMany();

    return response.status(200).json(result);
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

seasonRouter.patch(
  "/:seasonId/image",
  upload.single("image"),
  async (request, response) => {

    try {
      const updateImage = new UpdateImageService();

      const season = await updateImage.execute({
        season_id: Number(request.params.seasonId),
        imageFileName: request.file.filename,
      });

      return response.json(season);

    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
);

// seasonRouter.get("/csv", async (request, response) => {
//   try {
//     const dados: any[] = [];
//     const seasonService = new CreateSeasonService();
//     fs.createReadStream('data.tsv')
//       .pipe(csv({ separator: '\t' }))
//       .on('data', (row) => {
//         if (row.titleType === 'tvSeries' && Number(row.startYear) >= 2020) {
//           console.log(row);
//           dados.push(row);
//         }
//       })
//       .on('end', async () => {
//         console.log('CSV file successfully processed: ');
//         console.log(dados.length)

//         dados.map(async item => {
//           const number = randomInt(1, 3);
//           const episode = randomInt(1, 12);
//           const season = await seasonService.execute({
//             name: item.primaryTitle,
//             age: randomInt(12, 18),
//             genre: item.genres,
//             seasonNumber: `TEMPORADA ${number}`,
//             current_episode: `T${number} : E${episode}`,
//             isNew: false,
//           });
//           console.log(season);
//         });

//         return response.status(200).json(true);
//       });

//   } catch (err) {
//     return response.status(400).json({ error: err.message });
//   }
// });

export default seasonRouter;
