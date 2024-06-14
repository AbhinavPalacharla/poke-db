-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Battle` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trainerId` int NOT NULL,
	CONSTRAINT `Battle_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Item` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`imageUrl` varchar(191) NOT NULL,
	CONSTRAINT `Item_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Move` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `Move_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Pokemon` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`imageUrl` varchar(191) NOT NULL,
	CONSTRAINT `Pokemon_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Trainer` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	`gender` enum('MALE','FEMALE') NOT NULL,
	`imageUrl` varchar(191) NOT NULL,
	CONSTRAINT `Trainer_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `Type` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(191) NOT NULL,
	CONSTRAINT `Type_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `_BattleToTrainer` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_BattleToTrainer_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_ItemToTrainer` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_ItemToTrainer_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_MoveToPokemon` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_MoveToPokemon_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_MoveToType` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_MoveToType_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_PokemonToTrainer` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_PokemonToTrainer_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_PokemonToType` (
	`A` int NOT NULL,
	`B` int NOT NULL,
	CONSTRAINT `_PokemonToType_AB_unique` UNIQUE(`A`,`B`)
);
--> statement-breakpoint
CREATE TABLE `_prisma_migrations` (
	`id` varchar(36) NOT NULL,
	`checksum` varchar(64) NOT NULL,
	`finished_at` datetime(3),
	`migration_name` varchar(255) NOT NULL,
	`logs` text,
	`rolled_back_at` datetime(3),
	`started_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`applied_steps_count` int unsigned NOT NULL DEFAULT 0,
	CONSTRAINT `_prisma_migrations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Battle` ADD CONSTRAINT `Battle_trainerId_fkey` FOREIGN KEY (`trainerId`) REFERENCES `Trainer`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_BattleToTrainer` ADD CONSTRAINT `_BattleToTrainer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Battle`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_BattleToTrainer` ADD CONSTRAINT `_BattleToTrainer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Trainer`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_ItemToTrainer` ADD CONSTRAINT `_ItemToTrainer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Item`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_ItemToTrainer` ADD CONSTRAINT `_ItemToTrainer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Trainer`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_MoveToPokemon` ADD CONSTRAINT `_MoveToPokemon_A_fkey` FOREIGN KEY (`A`) REFERENCES `Move`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_MoveToPokemon` ADD CONSTRAINT `_MoveToPokemon_B_fkey` FOREIGN KEY (`B`) REFERENCES `Pokemon`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_MoveToType` ADD CONSTRAINT `_MoveToType_A_fkey` FOREIGN KEY (`A`) REFERENCES `Move`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_MoveToType` ADD CONSTRAINT `_MoveToType_B_fkey` FOREIGN KEY (`B`) REFERENCES `Type`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_PokemonToTrainer` ADD CONSTRAINT `_PokemonToTrainer_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pokemon`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_PokemonToTrainer` ADD CONSTRAINT `_PokemonToTrainer_B_fkey` FOREIGN KEY (`B`) REFERENCES `Trainer`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_PokemonToType` ADD CONSTRAINT `_PokemonToType_A_fkey` FOREIGN KEY (`A`) REFERENCES `Pokemon`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `_PokemonToType` ADD CONSTRAINT `_PokemonToType_B_fkey` FOREIGN KEY (`B`) REFERENCES `Type`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `_BattleToTrainer_B_index` ON `_BattleToTrainer` (`B`);--> statement-breakpoint
CREATE INDEX `_ItemToTrainer_B_index` ON `_ItemToTrainer` (`B`);--> statement-breakpoint
CREATE INDEX `_MoveToPokemon_B_index` ON `_MoveToPokemon` (`B`);--> statement-breakpoint
CREATE INDEX `_MoveToType_B_index` ON `_MoveToType` (`B`);--> statement-breakpoint
CREATE INDEX `_PokemonToTrainer_B_index` ON `_PokemonToTrainer` (`B`);--> statement-breakpoint
CREATE INDEX `_PokemonToType_B_index` ON `_PokemonToType` (`B`);
*/