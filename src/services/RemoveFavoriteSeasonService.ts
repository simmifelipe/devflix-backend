import { Favorite } from './../models/Favorite';
import { getRepository } from "typeorm";

interface Request {
  user_id: string;
  season_id: number;
}

class RemoveFavoriteSeasonService {

  public async execute({ user_id, season_id }: Request): Promise<void> {
    const favoriteRepository = getRepository(Favorite);

    const favorite = await favoriteRepository.findOne({ user_id, season: { id: season_id } });

    if (!favorite) {
      throw new Error('Titulo não encontrado nos favoritos');
    }

    await favoriteRepository.remove(favorite);
  }
}

export default RemoveFavoriteSeasonService;