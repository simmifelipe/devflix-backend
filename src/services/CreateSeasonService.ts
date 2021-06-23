import { randomInt } from 'crypto';
import { getRepository } from "typeorm";
import { Season } from "../models/Season";

interface Request {
  name: string;
  age: number;
  genre: string;
  seasonNumber: string;
  current_episode: string;
}

class CreateSeasonService {

  public async execute({ name, age, genre, seasonNumber, current_episode }: Request): Promise<Season> {
    const seasonRepository = getRepository(Season);

    const season = seasonRepository.create({
      name,
      age,
      genre,
      season: seasonNumber,
      current_episode,
      progress: randomInt(0, 95),
      runningTime: randomInt(40, 59)
    });

    await seasonRepository.save(season);

    return season;
  }
}

export default CreateSeasonService;