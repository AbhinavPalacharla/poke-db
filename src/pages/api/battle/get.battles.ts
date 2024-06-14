import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/drizzle/db";
import { eq, inArray } from "drizzle-orm";
import { Battle, Trainer, _BattleToTrainer } from "@/drizzle/schema";
import { handleError } from "@/utils/handleError";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetch all battles
    const battles = await db
      .select({
        battle: Battle,
        trainer: Trainer,
      })
      .from(Battle)
      .leftJoin(_BattleToTrainer, eq(Battle.id, _BattleToTrainer.A))
      .leftJoin(Trainer, eq(_BattleToTrainer.B, Trainer.id))
      .execute();

    if (!battles.length) {
      return res.status(404).json({ error: "No battles found" });
    }

    // Extract unique battle IDs
    const battleIds = Array.from(new Set(battles.map((b) => b.battle.id)));

    // Fetch winners separately to avoid conflicts in joins
    const winners = await db
      .select({
        winner: Trainer,
      })
      .from(Battle)
      .leftJoin(Trainer, eq(Battle.trainerId, Trainer.id))
      .where(inArray(Battle.id, battleIds))
      .execute();

    // Process and format the results
    const result = battleIds.map((battleId) => {
      const battleData = battles.filter((b) => b.battle.id === battleId);
      const winnerData = winners.find(
        (w) => w.winner!.id === battleData[0].battle.trainerId
      );
      const trainers = battleData
        .map((b) => b.trainer)
        .filter((t) => t!.id !== null);

      return {
        ...battleData[0].battle,
        trainers,
        winner: winnerData ? winnerData.winner : null,
      };
    });

    return res.status(200).json(result);
  } catch (err) {
    handleError(err, res);
  }
};

export default handler;
