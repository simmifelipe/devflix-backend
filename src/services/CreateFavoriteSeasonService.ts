import { Season } from './../models/Season';
import { Favorite } from './../models/Favorite';
import { getRepository } from "typeorm";

interface Request {
  user_id: string;
  season: Season;
}

class CreateFavoriteSeasonService {

  public async execute({ user_id, season }: Request): Promise<Favorite> {
    const favoriteRepository = getRepository(Favorite);

    const alreadyExist = await favoriteRepository.findOne({ user_id, season });

    if (alreadyExist) {
      throw new Error('Titulo já está nos favoritos');
    }

    const favorite = favoriteRepository.create({
      user_id, season
    });

    await favoriteRepository.save(favorite);

    return favorite;
  }
}

export default CreateFavoriteSeasonService;