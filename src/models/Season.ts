import { randomInt } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Season {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  age: number;

  @Column()
  genre: string;

  @Column()
  season: string;

  @Column({ nullable: true })
  current_episode: string;

  @Column({ default: 0 })
  runningTime: number;

  @Column({ default: 0 })
  progress: number;

  @Column({ type: 'decimal', default: 5.1 })
  ratings: number;

  @Column({ default: false })
  watching: boolean;

  @Column({ default: true })
  isNew: boolean;

}