import { mysqlTable, mysqlSchema, AnyMySqlColumn, foreignKey, primaryKey, int, varchar, mysqlEnum, index, unique, datetime, text } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const Battle = mysqlTable("Battle", {
	id: int("id").autoincrement().notNull(),
	trainerId: int("trainerId").notNull().references(() => Trainer.id, { onDelete: "restrict", onUpdate: "cascade" } ),
},
(table) => {
	return {
		Battle_id: primaryKey({ columns: [table.id], name: "Battle_id"}),
	}
});

export const Item = mysqlTable("Item", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	imageUrl: varchar("imageUrl", { length: 191 }).notNull(),
},
(table) => {
	return {
		Item_id: primaryKey({ columns: [table.id], name: "Item_id"}),
	}
});

export const Move = mysqlTable("Move", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
},
(table) => {
	return {
		Move_id: primaryKey({ columns: [table.id], name: "Move_id"}),
	}
});

export const Pokemon = mysqlTable("Pokemon", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	imageUrl: varchar("imageUrl", { length: 191 }).notNull(),
},
(table) => {
	return {
		Pokemon_id: primaryKey({ columns: [table.id], name: "Pokemon_id"}),
	}
});

export const Trainer = mysqlTable("Trainer", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	gender: mysqlEnum("gender", ['MALE','FEMALE']).notNull(),
	imageUrl: varchar("imageUrl", { length: 191 }).notNull(),
},
(table) => {
	return {
		Trainer_id: primaryKey({ columns: [table.id], name: "Trainer_id"}),
	}
});

export const Type = mysqlTable("Type", {
	id: int("id").autoincrement().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
},
(table) => {
	return {
		Type_id: primaryKey({ columns: [table.id], name: "Type_id"}),
	}
});

export const _BattleToTrainer = mysqlTable("_BattleToTrainer", {
	A: int("A").notNull().references(() => Battle.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Trainer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_BattleToTrainer_AB_unique: unique("_BattleToTrainer_AB_unique").on(table.A, table.B),
	}
});

export const _ItemToTrainer = mysqlTable("_ItemToTrainer", {
	A: int("A").notNull().references(() => Item.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Trainer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_ItemToTrainer_AB_unique: unique("_ItemToTrainer_AB_unique").on(table.A, table.B),
	}
});

export const _MoveToPokemon = mysqlTable("_MoveToPokemon", {
	A: int("A").notNull().references(() => Move.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Pokemon.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_MoveToPokemon_AB_unique: unique("_MoveToPokemon_AB_unique").on(table.A, table.B),
	}
});

export const _MoveToType = mysqlTable("_MoveToType", {
	A: int("A").notNull().references(() => Move.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Type.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_MoveToType_AB_unique: unique("_MoveToType_AB_unique").on(table.A, table.B),
	}
});

export const _PokemonToTrainer = mysqlTable("_PokemonToTrainer", {
	A: int("A").notNull().references(() => Pokemon.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Trainer.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_PokemonToTrainer_AB_unique: unique("_PokemonToTrainer_AB_unique").on(table.A, table.B),
	}
});

export const _PokemonToType = mysqlTable("_PokemonToType", {
	A: int("A").notNull().references(() => Pokemon.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	B: int("B").notNull().references(() => Type.id, { onDelete: "cascade", onUpdate: "cascade" } ),
},
(table) => {
	return {
		B_idx: index().on(table.B),
		_PokemonToType_AB_unique: unique("_PokemonToType_AB_unique").on(table.A, table.B),
	}
});

export const _prisma_migrations = mysqlTable("_prisma_migrations", {
	id: varchar("id", { length: 36 }).notNull(),
	checksum: varchar("checksum", { length: 64 }).notNull(),
	finished_at: datetime("finished_at", { mode: 'string', fsp: 3 }),
	migration_name: varchar("migration_name", { length: 255 }).notNull(),
	logs: text("logs"),
	rolled_back_at: datetime("rolled_back_at", { mode: 'string', fsp: 3 }),
	started_at: datetime("started_at", { mode: 'string', fsp: 3 }).default(sql`(CURRENT_TIMESTAMP(3))`).notNull(),
	applied_steps_count: int("applied_steps_count", { unsigned: true }).default(0).notNull(),
},
(table) => {
	return {
		_prisma_migrations_id: primaryKey({ columns: [table.id], name: "_prisma_migrations_id"}),
	}
});