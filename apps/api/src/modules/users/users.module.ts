import { Body, Controller, Get, Injectable, Module, Param, Post, Query } from '@nestjs/common';
import { IProvince, IUser, IUserAddress, IWard } from '@gdx/shared-types';
import { DatabaseService } from '../../database/database.module';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async findAll(): Promise<IUser[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        phone: string;
        email: string | null;
        full_name: string;
        role: IUser['role'];
        avatar_url: string | null;
        customer_star_rating: string;
        status: IUser['status'];
        created_at: string;
        updated_at: string;
      }>(
        `SELECT id, phone, email, full_name, role, avatar_url, customer_star_rating, status, created_at, updated_at
         FROM public.users
         ORDER BY created_at DESC
         LIMIT 100`,
      );
      return rows.map((r) => ({
        id: r.id,
        phone: r.phone,
        email: r.email,
        fullName: r.full_name,
        role: r.role,
        avatarUrl: r.avatar_url,
        customerStarRating: Number(r.customer_star_rating),
        status: r.status,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      }));
    }
    return [
      {
        id: '11111111-1111-4111-8111-111111111111',
        phone: '0901234567',
        fullName: 'Nguyễn Minh Tuấn',
        role: 'customer',
        customerStarRating: 5.0,
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  async findOne(id: string): Promise<IUser> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        phone: string;
        email: string | null;
        full_name: string;
        role: IUser['role'];
        avatar_url: string | null;
        customer_star_rating: string;
        status: IUser['status'];
        created_at: string;
        updated_at: string;
      }>(
        `SELECT id, phone, email, full_name, role, avatar_url, customer_star_rating, status, created_at, updated_at
         FROM public.users
         WHERE id = $1::uuid`,
        [id],
      );
      if (rows[0]) {
        const r = rows[0];
        return {
          id: r.id,
          phone: r.phone,
          email: r.email,
          fullName: r.full_name,
          role: r.role,
          avatarUrl: r.avatar_url,
          customerStarRating: Number(r.customer_star_rating),
          status: r.status,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        };
      }
    }
    return {
      id,
      phone: '0901234567',
      fullName: 'Nguyễn Minh Tuấn',
      role: 'customer',
      customerStarRating: 5.0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
  }

  async getProvinces(): Promise<IProvince[]> {
    if (this.db.isConnected) {
      return this.db.query<IProvince>(`SELECT code, name, region FROM public.provinces ORDER BY code`);
    }
    return [
      { code: 'HCM', name: 'TP. Hồ Chí Minh', region: 'Nam' },
      { code: 'HN', name: 'Hà Nội', region: 'Bắc' },
    ];
  }

  async getWards(provinceCode?: string): Promise<IWard[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        code: string;
        province_code: string;
        name: string;
      }>(
        provinceCode
          ? `SELECT code, province_code, name FROM public.wards WHERE province_code = $1 ORDER BY code`
          : `SELECT code, province_code, name FROM public.wards ORDER BY code`,
        provinceCode ? [provinceCode] : [],
      );
      return rows.map((w) => ({
        code: w.code,
        provinceCode: w.province_code,
        name: w.name,
      }));
    }
    return [
      { code: 'HCM-BN', provinceCode: 'HCM', name: 'Phường Bến Nghé' },
      { code: 'HCM-TD', provinceCode: 'HCM', name: 'Phường Thảo Điền' },
      { code: 'HCM-PMH', provinceCode: 'HCM', name: 'Phường Tân Phong' },
    ];
  }

  async getUserAddresses(userId: string): Promise<IUserAddress[]> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{
        id: string;
        user_id: string;
        label: string | null;
        address_line: string;
        ward_code: string;
        lng: number;
        lat: number;
        is_default: boolean;
        created_at: string;
      }>(
        `SELECT id, user_id, label, address_line, ward_code,
                ST_X(location::geometry) AS lng,
                ST_Y(location::geometry) AS lat,
                is_default, created_at
         FROM public.user_addresses
         WHERE user_id = $1::uuid
         ORDER BY is_default DESC, created_at DESC`,
        [userId],
      );
      return rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        label: r.label,
        addressLine: r.address_line,
        wardCode: r.ward_code,
        longitude: Number(r.lng),
        latitude: Number(r.lat),
        isDefault: r.is_default,
        createdAt: r.created_at,
      }));
    }
    return [];
  }

  async addUserAddress(
    userId: string,
    payload: {
      label?: string;
      addressLine: string;
      wardCode: string;
      longitude: number;
      latitude: number;
      isDefault?: boolean;
    },
  ): Promise<IUserAddress> {
    if (this.db.isConnected) {
      const rows = await this.db.query<{ id: string; created_at: string }>(
        `INSERT INTO public.user_addresses (user_id, label, address_line, ward_code, location, is_default)
         VALUES ($1::uuid, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326)::geography, $7)
         RETURNING id, created_at`,
        [
          userId,
          payload.label ?? 'Nhà riêng',
          payload.addressLine,
          payload.wardCode,
          payload.longitude,
          payload.latitude,
          payload.isDefault ?? false,
        ],
      );
      return {
        id: rows[0].id,
        userId,
        label: payload.label ?? 'Nhà riêng',
        addressLine: payload.addressLine,
        wardCode: payload.wardCode,
        longitude: payload.longitude,
        latitude: payload.latitude,
        isDefault: payload.isDefault ?? false,
        createdAt: rows[0].created_at,
      };
    }
    return {
      id: `addr-${Date.now()}`,
      userId,
      label: payload.label ?? 'Nhà riêng',
      addressLine: payload.addressLine,
      wardCode: payload.wardCode,
      longitude: payload.longitude,
      latitude: payload.latitude,
      isDefault: payload.isDefault ?? false,
      createdAt: new Date().toISOString(),
    };
  }
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('locations/provinces')
  getProvinces() {
    return this.usersService.getProvinces();
  }

  @Get('locations/wards')
  getWards(@Query('provinceCode') provinceCode?: string) {
    return this.usersService.getWards(provinceCode);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get(':id/addresses')
  getAddresses(@Param('id') id: string) {
    return this.usersService.getUserAddresses(id);
  }

  @Post(':id/addresses')
  addAddress(
    @Param('id') id: string,
    @Body()
    body: {
      label?: string;
      addressLine: string;
      wardCode: string;
      longitude: number;
      latitude: number;
      isDefault?: boolean;
    },
  ) {
    return this.usersService.addUserAddress(id, body);
  }
}

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
