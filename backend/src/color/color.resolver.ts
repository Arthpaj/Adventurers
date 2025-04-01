import { Query, Resolver } from '@nestjs/graphql';
import { ColorService } from './color.service';

@Resolver()
export class ColorResolver {
  constructor(private readonly colorService: ColorService) {}

  @Query(() => String)
  getColor(): string {
    return this.colorService.getColor();
  }
}
