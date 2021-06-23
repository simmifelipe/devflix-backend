import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Season } from "./Season";


@Entity()
export class Favorite {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: string;

  @OneToOne(() => Season)
  @JoinColumn()
  season: Season;

}