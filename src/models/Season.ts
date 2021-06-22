import { Column, Entity, IsNull, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Season {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column({nullable: true})
  thumbnail: string;

  @Column({nullable: true})
  image: string;

  @Column()
  age: number;

  @Column()
  genre: string;

  @Column()
  season: string;

  @Column({nullable: true})
  currentEpisode: string;

  @Column({default: 0})
  runningTime: number;

  @Column({default: 0})
  progress: number;

}