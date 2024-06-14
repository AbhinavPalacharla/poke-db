import { relations } from "drizzle-orm/relations";
import { Trainer, Battle, _BattleToTrainer, Item, _ItemToTrainer, Move, _MoveToPokemon, Pokemon, _MoveToType, Type, _PokemonToTrainer, _PokemonToType } from "./schema";

export const BattleRelations = relations(Battle, ({one, many}) => ({
	Trainer: one(Trainer, {
		fields: [Battle.trainerId],
		references: [Trainer.id]
	}),
	_BattleToTrainers: many(_BattleToTrainer),
}));

export const TrainerRelations = relations(Trainer, ({many}) => ({
	Battles: many(Battle),
	_BattleToTrainers: many(_BattleToTrainer),
	_ItemToTrainers: many(_ItemToTrainer),
	_PokemonToTrainers: many(_PokemonToTrainer),
}));

export const _BattleToTrainerRelations = relations(_BattleToTrainer, ({one}) => ({
	Battle: one(Battle, {
		fields: [_BattleToTrainer.A],
		references: [Battle.id]
	}),
	Trainer: one(Trainer, {
		fields: [_BattleToTrainer.B],
		references: [Trainer.id]
	}),
}));

export const _ItemToTrainerRelations = relations(_ItemToTrainer, ({one}) => ({
	Item: one(Item, {
		fields: [_ItemToTrainer.A],
		references: [Item.id]
	}),
	Trainer: one(Trainer, {
		fields: [_ItemToTrainer.B],
		references: [Trainer.id]
	}),
}));

export const ItemRelations = relations(Item, ({many}) => ({
	_ItemToTrainers: many(_ItemToTrainer),
}));

export const _MoveToPokemonRelations = relations(_MoveToPokemon, ({one}) => ({
	Move: one(Move, {
		fields: [_MoveToPokemon.A],
		references: [Move.id]
	}),
	Pokemon: one(Pokemon, {
		fields: [_MoveToPokemon.B],
		references: [Pokemon.id]
	}),
}));

export const MoveRelations = relations(Move, ({many}) => ({
	_MoveToPokemon: many(_MoveToPokemon),
	_MoveToTypes: many(_MoveToType),
}));

export const PokemonRelations = relations(Pokemon, ({many}) => ({
	_MoveToPokemon: many(_MoveToPokemon),
	_PokemonToTrainers: many(_PokemonToTrainer),
	_PokemonToTypes: many(_PokemonToType),
}));

export const _MoveToTypeRelations = relations(_MoveToType, ({one}) => ({
	Move: one(Move, {
		fields: [_MoveToType.A],
		references: [Move.id]
	}),
	Type: one(Type, {
		fields: [_MoveToType.B],
		references: [Type.id]
	}),
}));

export const TypeRelations = relations(Type, ({many}) => ({
	_MoveToTypes: many(_MoveToType),
	_PokemonToTypes: many(_PokemonToType),
}));

export const _PokemonToTrainerRelations = relations(_PokemonToTrainer, ({one}) => ({
	Pokemon: one(Pokemon, {
		fields: [_PokemonToTrainer.A],
		references: [Pokemon.id]
	}),
	Trainer: one(Trainer, {
		fields: [_PokemonToTrainer.B],
		references: [Trainer.id]
	}),
}));

export const _PokemonToTypeRelations = relations(_PokemonToType, ({one}) => ({
	Pokemon: one(Pokemon, {
		fields: [_PokemonToType.A],
		references: [Pokemon.id]
	}),
	Type: one(Type, {
		fields: [_PokemonToType.B],
		references: [Type.id]
	}),
}));