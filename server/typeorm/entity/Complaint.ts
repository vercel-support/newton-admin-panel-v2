import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { Patient } from './Patient';
  
  @Entity()
  export class Complaint {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column('text', { nullable: false })
    text: string;
  
    @Column('int', { nullable: false })
    painLevel: number;
  
    @ManyToOne(() => Patient, (patient) => patient.complaints)
    @JoinColumn({ name: 'patient_id' })
    patient: Patient;
  }