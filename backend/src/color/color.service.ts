import { Injectable } from '@nestjs/common';

@Injectable()
export class ColorService {
  getColor(): string {
    return 'blue';
  }
}
