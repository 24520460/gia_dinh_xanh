import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import { CriminalRecordStatus, KycStatus } from '@gdx/shared-types';

@Entity('partner_profiles')
export class PartnerProfileEntity {
  @PrimaryColumn({ name: 'partner_id', type: 'uuid' })
  partnerId: string;

  @Column({ name: 'cccd_encrypted', type: 'bytea', select: false })
  cccdEncrypted: Buffer;

  @Column({ name: 'cccd_hash', type: 'varchar', length: 64, unique: true })
  cccdHash: string;

  @Column({ name: 'id_issue_date', type: 'date' })
  idIssueDate: string;

  @Column({
    name: 'criminal_record_status',
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  criminalRecordStatus: CriminalRecordStatus;

  @Column({ name: 'health_cert_expiry', type: 'date', nullable: true })
  healthCertExpiry: string | null;

  @Column({ name: 'theoretical_score', type: 'numeric', precision: 5, scale: 2, default: 0.0 })
  theoreticalScore: number;

  @Column({ name: 'practical_score', type: 'numeric', precision: 5, scale: 2, default: 0.0 })
  practicalScore: number;

  @Column({ name: 'kyc_status', type: 'varchar', length: 20, default: 'pending' })
  kycStatus: KycStatus;

  @Column({ name: 'star_rating', type: 'numeric', precision: 3, scale: 2, default: 5.0 })
  starRating: number;

  @Column({ name: 'total_completed_jobs', default: 0 })
  totalCompletedJobs: number;

  @Column({ name: 'service_radius_km', type: 'numeric', precision: 4, scale: 1, default: 5.0 })
  serviceRadiusKm: number;

  @Column({ name: 'is_active', default: false })
  isActive: boolean;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
