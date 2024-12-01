import { ControllerOptions } from '@nestjs/common';
import { ROLES } from '../enums/roles.enum';

export interface CustomControllerOptions extends ControllerOptions {
  /**
   * @description swagger tag that groups routes in swagger ui
   * */
  apiTag?: string | string[];
  /**
   * @description path of the api
   * @example http://somthing/path
   * */
  path?: string | string[];

  auth?: boolean;
  roles?: ROLES[];
}
