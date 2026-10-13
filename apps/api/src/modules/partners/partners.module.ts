import { Body, Controller, Get, Injectable, Module, Param, Patch, Post, Query } from '@nestjs/common';
import {
  IPartnerSchedule,
  PartnerProfileDto,
  RadarOrderDto,
  RecordPartnerLocationDto,
  UpdateKycDto,
} from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class PartnersService {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Calls PL/pgSQL `public.find_waiting_orders_near(p_partner_id)` if `partnerId` is given,
   * or queries `public.orders` with PostGIS `ST_DWithin` around `(lng, lat)`.
   */
  async findNearbyJobs(
    lat: number,
    lng: number,
    radiusKm: number,
    partnerId?: string,
  ): Promise<RadarOrderDto[]> {
    if (this.db.isConnected) {
      if (partnerId) {
        const rows = await this.db.query<{
          order_id: string;
          order_created_at: string;
          order_code: string;
          service_id: number;
          service_name: string;
          scheduled_date: string;
          scheduled_slot: RadarOrderDto['scheduledSlot'];
          duration_hours: string;
          final_amount: string;
          address_line: string;
          distance_m: number;
        }>(`SELECT * FROM public.find_waiting_orders_near($1::uuid)`, [partnerId]);

        return rows.map((r) => ({
          orderId: r.order_id,
          orderCreatedAt: r.order_created_at,
          orderCode: r.order_code,
          serviceId: r.service_id,
          serviceName: r.service_name,
          scheduledDate: r.scheduled_date,
          scheduledSlot: r.scheduled_slot,
          durationHours: Number(r.duration_hours),
          finalAmount: Number(r.final_amount),
          addressLine: r.address_line,
          distanceM: Math.round(Number(r.distance_m)),
        }));
      }

      const radiusMeters = Math.round(radiusKm * 1000);
      const rows = await this.db.query<{
        order_id: string;
        order_created_at: string;
        order_code: string;
        service_id: number;
        service_name: string;
        scheduled_date: string;
        scheduled_slot: RadarOrderDto['scheduledSlot'];
        duration_hours: string;
        final_amount: string;
        address_line: string;
        distance_m: number;
      }>(
        `SELECT o.id AS order_id, o.created_at AS order_created_at, o.order_code,
                o.service_id, sc.name AS service_name, o.scheduled_date,
                o.scheduled_slot, o.duration_hours, o.final_amount, o.address_line,
                ST_Distance(o.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) AS distance_m
         FROM public.orders o
         JOIN public.service_categories sc ON sc.id = o.service_id
         WHERE o.status = 'waiting_partner'
           AND ST_DWithin(o.location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
         ORDER BY distance_m ASC
         LIMIT 50`,
        [lng, lat, radiusMeters],
      );

      return rows.map((r) => ({
        orderId: r.order_id,
        orderCreatedAt: r.order_created_at,
        orderCode: r.order_code,
        serviceId: r.service_id,
        serviceName: r.service_name,
        scheduledDate: r.scheduled_date,
        scheduledSlot: r.scheduled_slot,
        durationHours: Number(r.duration_hours),
        finalAmount: Number(r.final_amount),
        addressLine: r.address_line,
        distanceM: Math.round(Number(r.distance_m)),
      }));
    }

    return [
      {
        orderId: '22222222-2222-4222-8222-222222222222',
        orderCreatedAt: new Date().toISOString(),
        orderCode: 'GDX-100001',
        serviceId: 1,
        serviceName: 'Dọn vệ sinh theo giờ',
        scheduledDate: new Date().toISOString().slice(0, 10),
        scheduledSlot: 'morning',
        durationHours: 3,
        finalAmount: 255000,
        addressLine: 'Vinhomes Central Park, Landmark 2, P.22, Bình Thạnh',
        distanceM: 850,
      },
    ];
  }

  /**
   * Calls PL/pgSQL `public.record_partner_location(p_partner_id, p_longitude, p_latitude, p_accuracy_m, p_speed_kmh)`
   */
  async recordLocation(dto: RecordPartnerLocationDto) {
    if (this.db.isConnected) {
      await this.db.query(
        `SELECT public.record_partner_location($1::uuid, $2::double precision, $3::double precision, $4::numeric, $5::numeric)`,
        [
          dto.partnerId,
          dto.longitude,
          dto.latitude,
          dto.accuracyM ?? 10,
          dto.speedKmh ?? 0,
        ],
      );
    }
    return {
      success: true,
      partnerId: dto.partnerId,
      longitude: dto.longitude,
      latitude: dto.latitude,
      recordedAt: new Date().toISOString(),
    };
  }

  /**
   * Upserts partner profile with pgcrypto `public.encrypt_cccd` and `public.hash_cccd`
   */
  async upsertPartnerProfile(
    partnerId: string,
    payload: {
      cccdPlain: string;
      idIssueDate: string;
      serviceRadiusKm?: number;
    },
  ) {
    const encKey = process.env.CCCD_ENCRYPTION_KEY || 'gdx-dev-cccd-encryption-key-32ch';
    const pepper = process.env.CCCD_HMAC_PEPPER || 'gdx-dev-cccd-hmac-secret-pepper!';

    if (this.db.isConnected) {
      await this.db.query(
        `INSERT INTO public.partner_profiles (
           partner_id, cccd_encrypted, cccd_hash, id_issue_date, service_radius_km, kyc_status, is_active
         )
         VALUES (
           $1::uuid,
           public.encrypt_cccd($2, $3),
           public.hash_cccd($2, $4),
           $5::date,
           $6::numeric,
           'pending',
           false
         )
         ON CONFLICT (partner_id) DO UPDATE
         SET id_issue_date = EXCLUDED.id_issue_date,
             service_radius_km = EXCLUDED.service_radius_km,
             updated_at = CURRENT_TIMESTAMP`,
        [partnerId, payload.cccdPlain, encKey, pepper, payload.idIssueDate, payload.serviceRadiusKm ?? 5.0],
      );
    }
    return { partnerId, status: 'pending' };
  }

  async getKycCandidates(): Promise<PartnerProfileDto[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        partner_id: string;
        full_name: string;
        phone: string;
        star_rating: string;
        total_completed_jobs: number;
        service_radius_km: string;
        is_active: boolean;
        kyc_status: PartnerProfileDto['kycStatus'];
        criminal_record_status: PartnerProfileDto['criminalRecordStatus'];
        theoretical_score: string;
        practical_score: string;
      }>(
        `SELECT p.partner_id, u.full_name, u.phone, p.star_rating, p.total_completed_jobs,
                p.service_radius_km, p.is_active, p.kyc_status, p.criminal_record_status,
                p.theoretical_score, p.practical_score
         FROM public.partner_profiles p
         JOIN public.users u ON u.id = p.partner_id
         ORDER BY p.updated_at DESC`,
      );
      return rows.map((r) => ({
        partnerId: r.partner_id,
        fullName: r.full_name,
        phone: r.phone,
        starRating: Number(r.star_rating),
        totalCompletedJobs: r.total_completed_jobs,
        serviceRadiusKm: Number(r.service_radius_km),
        isActive: r.is_active,
        kycStatus: r.kyc_status,
        criminalRecordStatus: r.criminal_record_status,
        theoreticalScore: Number(r.theoretical_score),
        practicalScore: Number(r.practical_score),
      }));
    }

    return [
      {
        partnerId: 'KYC-2025-084',
        fullName: 'Nguyễn Thị Bích Ngọc',
        phone: '0909123456',
        starRating: 4.95,
        totalCompletedJobs: 120,
        serviceRadiusKm: 5,
        isActive: false,
        kycStatus: 'pending',
        criminalRecordStatus: 'clear',
        theoreticalScore: 95,
        practicalScore: 92,
      },
    ];
  }

  async updateKycStatus(partnerId: string, dto: UpdateKycDto): Promise<PartnerProfileDto> {
    const isApproved = dto.status === 'approved';
    if (this.db.isConnected) {
      await this.db.query(
        `UPDATE public.partner_profiles
         SET kyc_status = $2,
             criminal_record_status = COALESCE($3, criminal_record_status),
             theoretical_score = COALESCE($4, theoretical_score),
             practical_score = COALESCE($5, practical_score),
             is_active = CASE WHEN $2 = 'approved' THEN true ELSE false END,
             updated_at = CURRENT_TIMESTAMP
         WHERE partner_id = $1::uuid`,
        [
          partnerId,
          dto.status,
          dto.criminalRecordStatus ?? (isApproved ? 'clear' : null),
          dto.theoreticalScore ?? null,
          dto.practicalScore ?? null,
        ],
      );
    }

    return {
      partnerId,
      fullName: 'Nguyễn Thị Bích Ngọc',
      phone: '0909123456',
      starRating: 5.0,
      totalCompletedJobs: 0,
      serviceRadiusKm: 5,
      isActive: isApproved,
      kycStatus: dto.status,
      criminalRecordStatus: dto.criminalRecordStatus ?? (isApproved ? 'clear' : 'pending'),
      theoreticalScore: dto.theoreticalScore ?? 95,
      practicalScore: dto.practicalScore ?? 92,
    };
  }

  async getSchedules(partnerId: string): Promise<IPartnerSchedule[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        partner_id: string;
        day_of_week: number;
        slot_type: IPartnerSchedule['slotType'];
        status: IPartnerSchedule['status'];
        updated_at: string;
      }>(
        `SELECT id, partner_id, day_of_week, slot_type, status, updated_at
         FROM public.partner_schedules
         WHERE partner_id = $1::uuid
         ORDER BY day_of_week ASC, slot_type ASC`,
        [partnerId],
      );
      return rows.map((r) => ({
        id: Number(r.id),
        partnerId: r.partner_id,
        dayOfWeek: Number(r.day_of_week),
        slotType: r.slot_type,
        status: r.status,
        updatedAt: r.updated_at,
      }));
    }
    return [];
  }
}

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get('radar')
  getRadarJobs(
    @Query('lat') lat = 10.7769,
    @Query('lng') lng = 106.7009,
    @Query('radiusKm') radiusKm = 5,
    @Query('partnerId') partnerId?: string,
  ) {
    return this.partnersService.findNearbyJobs(
      Number(lat),
      Number(lng),
      Number(radiusKm),
      partnerId,
    );
  }

  @Post(':partnerId/location')
  recordLocation(
    @Param('partnerId') partnerId: string,
    @Body() body: Omit<RecordPartnerLocationDto, 'partnerId'>,
  ) {
    return this.partnersService.recordLocation({ partnerId, ...body });
  }

  @Post(':partnerId/profile')
  upsertProfile(
    @Param('partnerId') partnerId: string,
    @Body() body: { cccdPlain: string; idIssueDate: string; serviceRadiusKm?: number },
  ) {
    return this.partnersService.upsertPartnerProfile(partnerId, body);
  }

  @Get(':partnerId/schedules')
  getSchedules(@Param('partnerId') partnerId: string) {
    return this.partnersService.getSchedules(partnerId);
  }

  @Get('kyc')
  getKycList() {
    return this.partnersService.getKycCandidates();
  }

  @Patch(':partnerId/kyc')
  updateKyc(@Param('partnerId') partnerId: string, @Body() dto: UpdateKycDto) {
    return this.partnersService.updateKycStatus(partnerId, dto);
  }
}

@Module({
  controllers: [PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
