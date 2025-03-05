import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { I18nService } from 'nestjs-i18n';
import { Sequelize, Transaction } from 'sequelize';

import { CreateUserDto } from '../../modules/user/dto/create-user.dto';
import { UserService } from '../../modules/user/user.service';
import { ClubService } from '../../modules/club/club.service';
import { ClubStaffService } from '../../modules/club-staff/club-staff.service';
import { User } from '../../modules/user/entities/user.entity';
import { StaffStatus } from '../../modules/club-staff/entities/club-staff.entity';
import { AuthRegisterDto } from './dto/create-auth-register.dto';
import { CreateClubStaffDto } from '../../modules/club-staff/dto/create-club-staff.dto';
import { ErrorMap } from '../../shared/common/utils/response/error.map';
import { AuthRegisterBotDto } from './dto/create-auth-register-bot.dto';
import { UUID } from '../../shared/common/interfaces/types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private managementApiToken: string;
  private readonly auth0IssuerUrl: string;
  private readonly auth0ApiUrl: string;
  private readonly auth0MgmtClientId: string;
  private readonly auth0MgmtClientSecret: string;
  private readonly auth0ClientId: string;
  private readonly auth0ClientSecret: string;
  private readonly auth0ApiClientId: string;
  private readonly auth0JwtSecret: string;

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => ClubService))
    private readonly clubService: ClubService,
    private readonly clubStaffService: ClubStaffService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService,
    @Inject('SEQUELIZE') private readonly sequelize: Sequelize,
  ) {
    this.managementApiToken = '';
    this.auth0IssuerUrl = this.configService.get<string>('auth.issuer');
    this.auth0ApiUrl = `${this.auth0IssuerUrl}api/v2/`;
    this.auth0MgmtClientId = this.configService.get<string>(
      'auth.auth0MgmtClientId',
    );
    this.auth0MgmtClientSecret = this.configService.get<string>(
      'auth.auth0MgmtClientSecret',
    );
    this.auth0ClientId = this.configService.get<string>('auth.auth0ClientId');
    this.auth0ClientSecret = this.configService.get<string>(
      'auth.auth0ClientSecret',
    );
  }

  async register(
    auth0UserId: string,
    authRegisterPayload: AuthRegisterDto,
  ): Promise<User> {
    this.logger.log(`Registering user with auth0UserId: ${auth0UserId}`);
    const { clubName, ...basicUserInfo } = authRegisterPayload;

    const transaction: Transaction = await this.sequelize.transaction();

    try {
      const existUser = await this.userService.getMe(auth0UserId);
      if (existUser) {
        await transaction.commit();
        return existUser;
      }

      const user = await this.createInternalUserWithAuth0(
        auth0UserId,
        basicUserInfo,
        transaction,
      );
      const club = await this.clubService.createClub(
        { name: clubName },
        transaction,
      );
      await this.assignUserToClub(user.id, club.id, transaction);
      await transaction.commit();

      return this.userService.getUser(user.id);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async createInternalUserWithAuth0(
    auth0UserId: string,
    basicUserInfo: Partial<CreateUserDto>,
    transaction: Transaction,
  ): Promise<User> {
    const createUserPayload: CreateUserDto = {
      auth0UserId,
      ...basicUserInfo,
    };
    return this.userService.createUser(createUserPayload, transaction);
  }

  private async assignUserToClub(
    userId: string,
    clubId: string,
    transaction: Transaction,
  ): Promise<void> {
    const createClubStaffPayload: CreateClubStaffDto = {
      clubId,
      userId,
      status: StaffStatus.ACTIVE,
    };
    await this.clubStaffService.createClubStaff(
      createClubStaffPayload,
      transaction,
    );
  }

  // async addRolesToUser(auth0UserId: UUID, roles: string[]): Promise<void> {
  //   await this.getManagementApiToken();

  //   const url = `${this.auth0IssuerUrl}api/v2/users/${auth0UserId}/roles`;
  //   const payload = { roles };

  //   try {
  //     await firstValueFrom(
  //       this.httpService.post(url, payload, {
  //         headers: {
  //           Authorization: `Bearer ${this.managementApiToken}`,
  //         },
  //       }),
  //     );
  //   } catch (error) {
  //     const message = await this.i18n.translate(
  //       `errors.${ErrorMap.FAILED_TO_ASSIGN_ROLES}`,
  //     );
  //     throw new Error(message);
  //   }
  // }

  private async getManagementApiToken(): Promise<void> {
    if (this.managementApiToken) return;

    const url = `${this.auth0IssuerUrl}oauth/token`;
    const payload = {
      client_id: this.auth0MgmtClientId,
      client_secret: this.auth0MgmtClientSecret,
      audience: `${this.auth0IssuerUrl}api/v2/`,
      grant_type: 'client_credentials',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload),
      );
      this.managementApiToken = response.data.access_token;
    } catch (error) {
      const message = await this.i18n.translate(
        `errors.${ErrorMap.FAILED_TO_GET_AUTH_TOKEN}`,
      );
      throw new Error(message);
    }
  }

  async refreshUserToken(refreshToken: string): Promise<string> {
    const url = `${this.auth0IssuerUrl}oauth/token`;
    const payload = {
      client_id: this.auth0ApiClientId,
      client_secret: this.auth0JwtSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, payload),
      );
      return response.data.access_token;
    } catch (error) {
      const message = await this.i18n.translate(
        `errors.${ErrorMap.FAILED_TO_REFRESH_TOKEN}`,
      );
      throw new Error(message);
    }
  }

  async createUserInAuth0(
    authRegisterPayload: AuthRegisterBotDto,
  ): Promise<UUID> {
    await this.getManagementApiToken();

    const url = `${this.auth0ApiUrl}users`;
    const payload = {
      email: `${authRegisterPayload.nameBot}@example.com`,
      password: `${authRegisterPayload.nameBot}@example.com`,
      user_metadata: {
        phone: authRegisterPayload.phone,
      },
      connection: 'Username-Password-Authentication',
    };

    try {
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            Authorization: `Bearer ${this.managementApiToken}`,
          },
        }),
      );
      return response.data.user_id;
    } catch (error) {
      this.logger.error(
        'Failed to create user in Auth0',
        error.response?.data || error.message,
      );
      const message = await this.i18n.translate(
        `errors.${ErrorMap.CANNOT_CREATE_MODEL}`,
      );
      throw new Error(message);
    }
  }
}
