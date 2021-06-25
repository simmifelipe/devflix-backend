import fs from "fs";
import path from "path";
import { getRepository } from "typeorm";

import uploadConfig from "../config/upload";
import { Season } from "../models/Season";

interface Request {
  season_id: number;
  thumbnailFileName: string;
}

class UpdateThumbnailService {
  public async execute({
    season_id,
    thumbnailFileName
  }: Request): Promise<Season> {
    const seasonRepository = getRepository(Season);

    const season = await seasonRepository.findOne(season_id);

    if (!season) {
      throw new Error("Season não encontrada");
    }

    season.thumbnail = thumbnailFileName;

    await seasonRepository.save(season);

    return season;
  }
}

export default UpdateThumbnailService;
