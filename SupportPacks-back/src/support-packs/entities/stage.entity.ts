
import sequelize from 'sequelize';
import { Table, Column, Model, Length, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, Default, Sequelize, DataType, HasMany } from 'sequelize-typescript';
import { ImportanceLevel } from './importance-level.entity';

@Table({tableName: 'sp_stages', timestamps:false})
export class Stage extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column
    public id: number;

    @Column
    public name: string;
    
    @Column
    public description: string;

    @Column
    public app_id: number;

    // Relations
    @HasMany(() => ImportanceLevel)
    importance_levels: ImportanceLevel;

}