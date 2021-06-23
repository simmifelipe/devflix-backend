import fs from "fs";
import path from "path";
import { getRepository } from "typeorm";

import uploadConfig from "../config/upload";
import { Season } from "../models/Season";

interface Request {
  season_id: number;
  imageFileName: string;
}

class UpdateImageService {
  public async execute({
    season_id,
    imageFileName
  }: Request): Promise<Season> {
    const seasonRepository = getRepository(Season);

    const season = await seasonRepository.findOne(season_id);

    if (!season) {
      throw new Error("Season não encontrada");
    }

    if (season.image) {
      const seasonImageFilePath = path.join(
        uploadConfig.directory,
        season.thumbnail
      );
      const seasonThumbnailFileExist = await fs.promises.stat(
        seasonImageFilePath
      );

      if (seasonThumbnailFileExist) {
        await fs.promises.unlink(seasonImageFilePath);
      }
    }
    season.image = imageFileName;

    await seasonRepository.save(season);

    return season;
  }
}

export default UpdateImageService;
