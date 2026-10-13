import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

// Entidade do usuario
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 120 })
    name: string;

    @Column({ length: 160, unique: true})
    email: string;

    @Column({ name: 'password_hash', length: 200 })
    passwordHash: string;

    @Column({ length: 20, default: 'COLABORADOR' })
    role: string;

    @Column({ length: 60, default: 'America/Sao_Paulo'})
    timezone: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}