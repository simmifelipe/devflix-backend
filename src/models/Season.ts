import { randomInt } from "crypto";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Season {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 'b106a1415f9d40c7aaa2-Image-Not-Available.png' })
  thumbnail: string;

  @Column({ default: '2c4f5853fe89e6d410e1-product-default.png' })
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

  @Column({ default: false })
  isNew: boolean;

}