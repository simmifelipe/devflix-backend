import { Router } from "express";
import CreateSeasonService from "../services/CreateSeasonService";

const seasonRouter = Router();

seasonRouter.post("/", async (request, response) => {
  try {
    const { name, age, genre, seasonNumber } = request.body;

    const createSeason = new CreateSeasonService();

    const season = await createSeason.execute({
      name,
      age,
      genre,
      seasonNumber: seasonNumber,
    });

    return response.json(season);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default seasonRouter;
