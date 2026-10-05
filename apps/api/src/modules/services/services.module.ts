import { Controller, Get, Injectable, Module, Param } from '@nestjs/common';
import {
  IChecklistTemplate,
  IPricingRule,
  IServiceAddon,
  IServiceCategory,
  IVoucher,
} from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class ServicesCatalogService {
  constructor(private readonly db: DatabaseService) {}

  async findAllCategories(): Promise<IServiceCategory[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: number;
        name: string;
        code: string;
        description: string | null;
        base_hourly_rate: string;
        is_active: boolean;
        created_at: string;
      }>(
        `SELECT id, name, code, description, base_hourly_rate, is_active, created_at
         FROM public.service_categories
         WHERE is_active = true
         ORDER BY id ASC`,
      );
      return rows.map((r) => ({
        id: r.id,
        name: r.name,
        code: r.code,
        description: r.description,
        baseHourlyRate: Number(r.base_hourly_rate),
        isActive: r.is_active,
        createdAt: r.created_at,
      }));
    }
    return [
      { id: 1, code: 'CLEANING', name: 'Dọn vệ sinh theo giờ', baseHourlyRate: 85000, isActive: true },
      { id: 2, code: 'COOKING', name: 'Nấu ăn gia đình', baseHourlyRate: 95000, isActive: true },
      { id: 3, code: 'LAUNDRY', name: 'Giặt ủi tại nhà', baseHourlyRate: 75000, isActive: true },
      { id: 4, code: 'DEEP_CLEAN', name: 'Tổng vệ sinh chuyên sâu', baseHourlyRate: 130000, isActive: true },
    ];
  }

  async findAddons(): Promise<IServiceAddon[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: number;
        code: string;
        name: string;
        default_price: string;
        unit: string;
        is_active: boolean;
      }>(
        `SELECT id, code, name, default_price, unit, is_active
         FROM public.service_addons
         WHERE is_active = true
         ORDER BY id ASC`,
      );
      return rows.map((r) => ({
        id: r.id,
        code: r.code,
        name: r.name,
        defaultPrice: Number(r.default_price),
        unit: r.unit,
        isActive: r.is_active,
      }));
    }
    return [
      { id: 1, code: 'BRING_TOOLS', name: 'Mang dụng cụ & hóa chất xanh', defaultPrice: 30000, unit: 'lần', isActive: true },
      { id: 2, code: 'IRONING', name: 'Ủi quần áo gia đình', defaultPrice: 50000, unit: 'giờ', isActive: true },
    ];
  }

  async findPricingRules(): Promise<IPricingRule[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: number;
        zone_id: number | null;
        service_id: number | null;
        day_type: IPricingRule['dayType'];
        slot_type: IPricingRule['slotType'];
        hourly_rate: string | null;
        surcharge_pct: string;
        priority: number;
        effective_from: string;
        effective_to: string | null;
      }>(`SELECT * FROM public.pricing_rules ORDER BY priority DESC, id ASC`);
      return rows.map((r) => ({
        id: r.id,
        zoneId: r.zone_id,
        serviceId: r.service_id,
        dayType: r.day_type,
        slotType: r.slot_type,
        hourlyRate: r.hourly_rate ? Number(r.hourly_rate) : null,
        surchargePct: Number(r.surcharge_pct),
        priority: r.priority,
        effectiveFrom: r.effective_from,
        effectiveTo: r.effective_to,
      }));
    }
    return [];
  }

  async findChecklists(serviceId: number): Promise<IChecklistTemplate[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: number;
        service_id: number;
        item_order: number;
        task_name: string;
        is_required: boolean;
        is_active: boolean;
      }>(
        `SELECT id, service_id, item_order, task_name, is_required, is_active
         FROM public.checklist_templates
         WHERE service_id = $1 AND is_active = true
         ORDER BY item_order ASC`,
        [serviceId],
      );
      return rows.map((r) => ({
        id: r.id,
        serviceId: r.service_id,
        itemOrder: r.item_order,
        taskName: r.task_name,
        isRequired: r.is_required,
        isActive: r.is_active,
      }));
    }
    return [
      { id: 1, serviceId, itemOrder: 1, taskName: 'Quét và lau sàn phòng khách', isRequired: true, isActive: true },
      { id: 2, serviceId, itemOrder: 2, taskName: 'Lau bề mặt bếp, bàn ăn', isRequired: true, isActive: true },
      { id: 3, serviceId, itemOrder: 3, taskName: 'Cọ rửa toilet & gương nhà tắm', isRequired: true, isActive: true },
      { id: 4, serviceId, itemOrder: 4, taskName: 'Thu gom & phân loại rác sinh hoạt', isRequired: true, isActive: true },
    ];
  }

  async findActiveVouchers(): Promise<IVoucher[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: number;
        code: string;
        discount_type: IVoucher['discountType'];
        discount_value: string;
        max_discount_amount: string | null;
        min_order_amount: string;
        usage_limit: number | null;
        per_user_limit: number;
        valid_from: string;
        valid_to: string;
        is_active: boolean;
      }>(
        `SELECT * FROM public.vouchers
         WHERE is_active = true AND CURRENT_TIMESTAMP BETWEEN valid_from AND valid_to`,
      );
      return rows.map((r) => ({
        id: r.id,
        code: r.code,
        discountType: r.discount_type,
        discountValue: Number(r.discount_value),
        maxDiscountAmount: r.max_discount_amount ? Number(r.max_discount_amount) : null,
        minOrderAmount: Number(r.min_order_amount),
        usageLimit: r.usage_limit,
        perUserLimit: r.per_user_limit,
        validFrom: r.valid_from,
        validTo: r.valid_to,
        isActive: r.is_active,
      }));
    }
    return [];
  }
}

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesCatalogService) {}

  @Get()
  findAll() {
    return this.servicesService.findAllCategories();
  }

  @Get('addons')
  findAddons() {
    return this.servicesService.findAddons();
  }

  @Get('pricing-rules')
  findPricingRules() {
    return this.servicesService.findPricingRules();
  }

  @Get('vouchers')
  findVouchers() {
    return this.servicesService.findActiveVouchers();
  }

  @Get(':serviceId/checklists')
  findChecklists(@Param('serviceId') serviceId: string) {
    return this.servicesService.findChecklists(Number(serviceId));
  }
}

@Module({
  controllers: [ServicesController],
  providers: [ServicesCatalogService],
  exports: [ServicesCatalogService],
})
export class ServicesModule {}
