import { Body, Controller, Get, Injectable, Module, Param, Patch, Post } from '@nestjs/common';
import {
  CheckOutShiftDto,
  IShift,
  IShiftChecklist,
  IShiftEvidence,
  ShiftEvidenceStage,
  ShiftTimerStatus,
} from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class ShiftsService {
  constructor(private readonly db: DatabaseService) {}

  async getShiftByOrder(orderId: string): Promise<
    IShift & {
      elapsedSeconds: number;
      beforePhotoUrls: string[];
      afterPhotoUrls: string[];
    }
  > {
    if (this.db.isConnected) {
      const shiftRows = await this.db.query<{
        id: string;
        order_id: string;
        order_created_at: string;
        partner_id: string;
        check_in_time: string | null;
        check_out_time: string | null;
        timer_status: ShiftTimerStatus;
        created_at: string;
        updated_at: string;
      }>(
        `SELECT id, order_id, order_created_at, partner_id, check_in_time, check_out_time, timer_status, created_at, updated_at
         FROM public.shifts
         WHERE order_id::text = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [orderId],
      );

      if (shiftRows[0]) {
        const s = shiftRows[0];
        const checklistRows = await this.db.query<{
          id: string;
          shift_id: string;
          item_order: number;
          task_name: string;
          is_required: boolean;
          is_done: boolean;
          completed_at: string | null;
        }>(
          `SELECT id, shift_id, item_order, task_name, is_required, is_done, completed_at
           FROM public.shift_checklists
           WHERE shift_id = $1::uuid
           ORDER BY item_order ASC, id ASC`,
          [s.id],
        );

        const evidenceRows = await this.db.query<{
          id: string;
          shift_id: string;
          stage: ShiftEvidenceStage;
          photo_url: string;
          caption: string | null;
          uploaded_at: string;
        }>(
          `SELECT id, shift_id, stage, photo_url, caption, uploaded_at
           FROM public.shift_evidences
           WHERE shift_id = $1::uuid
           ORDER BY uploaded_at ASC`,
          [s.id],
        );

        const checklists: IShiftChecklist[] = checklistRows.map((c) => ({
          id: Number(c.id),
          shiftId: c.shift_id,
          itemOrder: Number(c.item_order),
          taskName: c.task_name,
          isRequired: c.is_required,
          isDone: c.is_done,
          completedAt: c.completed_at,
        }));

        const evidences: IShiftEvidence[] = evidenceRows.map((e) => ({
          id: Number(e.id),
          shiftId: e.shift_id,
          stage: e.stage,
          photoUrl: e.photo_url,
          caption: e.caption,
          uploadedAt: e.uploaded_at,
        }));

        const checkInMs = s.check_in_time ? new Date(s.check_in_time).getTime() : Date.now();
        const checkOutMs = s.check_out_time ? new Date(s.check_out_time).getTime() : Date.now();
        const elapsedSeconds = Math.max(0, Math.floor((checkOutMs - checkInMs) / 1000));

        return {
          id: s.id,
          orderId: s.order_id,
          orderCreatedAt: s.order_created_at,
          partnerId: s.partner_id,
          checkInTime: s.check_in_time,
          checkOutTime: s.check_out_time,
          timerStatus: s.timer_status,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
          checklists,
          evidences,
          elapsedSeconds,
          beforePhotoUrls: evidences.filter((e) => e.stage === 'before').map((e) => e.photoUrl),
          afterPhotoUrls: evidences.filter((e) => e.stage === 'after').map((e) => e.photoUrl),
        };
      }
    }

    return {
      id: `shf-${orderId}`,
      orderId,
      orderCreatedAt: new Date().toISOString(),
      partnerId: '22222222-2222-4222-8222-222222222222',
      checkInTime: new Date(Date.now() - 5420 * 1000).toISOString(),
      checkOutTime: null,
      timerStatus: 'running',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      checklists: [],
      evidences: [],
      elapsedSeconds: 5420,
      beforePhotoUrls: [],
      afterPhotoUrls: [],
    };
  }

  /**
   * Inserts into `public.shifts`, triggering `trg_shifts_gen_checklist` to clone `checklist_templates`
   */
  async checkInShift(payload: {
    orderId: string;
    orderCreatedAt: string;
    partnerId: string;
    longitude: number;
    latitude: number;
  }) {
    if (this.db.isConnected) {
      await this.db.query(
        `INSERT INTO public.shifts (
           order_id, order_created_at, partner_id, check_in_time, check_in_location, timer_status
         )
         VALUES (
           $1::uuid, $2::timestamptz, $3::uuid, CURRENT_TIMESTAMP,
           ST_SetSRID(ST_MakePoint($4, $5), 4326)::geography, 'running'
         )
         RETURNING id`,
        [
          payload.orderId,
          payload.orderCreatedAt,
          payload.partnerId,
          payload.longitude,
          payload.latitude,
        ],
      );
      return this.getShiftByOrder(payload.orderId);
    }

    return this.getShiftByOrder(payload.orderId);
  }

  /**
   * Calls PL/pgSQL `public.check_out_shift(p_shift_id, p_longitude, p_latitude)`
   */
  async checkOutShift(shiftId: string, dto: Omit<CheckOutShiftDto, 'shiftId'>) {
    if (this.db.isConnected) {
      await this.db.query(
        `SELECT public.check_out_shift($1::uuid, $2::double precision, $3::double precision)`,
        [shiftId, dto.longitude, dto.latitude],
      );
    }
    return {
      shiftId,
      timerStatus: 'completed' as ShiftTimerStatus,
      checkOutTime: new Date().toISOString(),
    };
  }

  async addEvidence(
    shiftId: string,
    stage: ShiftEvidenceStage,
    photoUrl: string,
    caption?: string,
  ): Promise<IShiftEvidence> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{ id: string; uploaded_at: string }>(
        `INSERT INTO public.shift_evidences (shift_id, stage, photo_url, caption)
         VALUES ($1::uuid, $2, $3, $4)
         RETURNING id, uploaded_at`,
        [shiftId, stage, photoUrl, caption ?? null],
      );
      return {
        id: Number(rows[0].id),
        shiftId,
        stage,
        photoUrl,
        caption: caption ?? null,
        uploadedAt: rows[0].uploaded_at,
      };
    }
    return {
      id: Date.now(),
      shiftId,
      stage,
      photoUrl,
      caption: caption ?? null,
      uploadedAt: new Date().toISOString(),
    };
  }

  async toggleChecklistItem(checklistId: string, isDone: boolean) {
    if (this.db.isConnected) {
      await this.db.query(
        `UPDATE public.shift_checklists
         SET is_done = $2,
             completed_at = CASE WHEN $2 = true THEN CURRENT_TIMESTAMP ELSE NULL END
         WHERE id = $1::bigint`,
        [checklistId, isDone],
      );
    }
    return { checklistId: Number(checklistId), isDone, completedAt: isDone ? new Date().toISOString() : null };
  }

  async updateTimer(orderId: string, timerStatus: ShiftTimerStatus) {
    if (this.db.isConnected) {
      await this.db.query(
        `UPDATE public.shifts SET timer_status = $2 WHERE order_id::text = $1`,
        [orderId, timerStatus],
      );
    }
    return { orderId, timerStatus, updatedAt: new Date().toISOString() };
  }
}

@Controller('shifts')
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get(':orderId')
  getShift(@Param('orderId') orderId: string) {
    return this.shiftsService.getShiftByOrder(orderId);
  }

  @Post('check-in')
  checkIn(
    @Body()
    body: {
      orderId: string;
      orderCreatedAt: string;
      partnerId: string;
      longitude: number;
      latitude: number;
    },
  ) {
    return this.shiftsService.checkInShift(body);
  }

  @Post(':shiftId/check-out')
  checkOut(
    @Param('shiftId') shiftId: string,
    @Body() body: { longitude: number; latitude: number },
  ) {
    return this.shiftsService.checkOutShift(shiftId, body);
  }

  @Post(':shiftId/evidences')
  addEvidence(
    @Param('shiftId') shiftId: string,
    @Body('stage') stage: ShiftEvidenceStage,
    @Body('photoUrl') photoUrl: string,
    @Body('caption') caption?: string,
  ) {
    return this.shiftsService.addEvidence(shiftId, stage, photoUrl, caption);
  }

  @Patch('checklists/:checklistId')
  toggleChecklist(
    @Param('checklistId') checklistId: string,
    @Body('isDone') isDone: boolean,
  ) {
    return this.shiftsService.toggleChecklistItem(checklistId, isDone);
  }

  @Patch(':orderId/timer')
  updateTimer(@Param('orderId') orderId: string, @Body('timerStatus') timerStatus: ShiftTimerStatus) {
    return this.shiftsService.updateTimer(orderId, timerStatus);
  }
}

@Module({
  controllers: [ShiftsController],
  providers: [ShiftsService],
  exports: [ShiftsService],
})
export class ShiftsModule {}
